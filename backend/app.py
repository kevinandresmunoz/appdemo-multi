from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
import os
from supabase import create_client, Client
from functools import wraps
import uuid
import mimetypes
from werkzeug.utils import secure_filename

# Cargar variables de entorno
load_dotenv()

# Inicializar Flask
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-key-change-in-production")
CORS(app, supports_credentials=True, origins=['https://appdemo-frontend.onrender.com', 'https://appdemo-frontend.onrender.com'])

# Configurar Supabase (solo en backend)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY]):
    raise Exception("Faltan las variables de entorno de Supabase")

# Cliente con service key para operaciones administrativas
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
# Cliente con anon key para autenticación
supabase_auth: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Configuración de archivos permitidos
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_extension(filename):
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

# Decorador para rutas que requieren autenticación
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "No autorizado"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Ruta de prueba
@app.route('/')
def hello():
    return {"message": "API del Gestor de Productos funcionando correctamente"}

# ========= MANEJO DE IMÁGENES =========

@app.route('/api/upload-image', methods=['POST'])
@require_auth
def upload_image():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se envió ningún archivo"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Tipo de archivo no permitido. Usa: png, jpg, jpeg, gif, webp"}), 400
        
        # Verificar tamaño del archivo
        file.seek(0, 2)  # Ir al final del archivo
        file_length = file.tell()
        file.seek(0)  # Volver al inicio
        
        if file_length > MAX_FILE_SIZE:
            return jsonify({"error": "El archivo es muy grande. Máximo 5MB"}), 400
        
        # Generar nombre único para el archivo
        file_extension = get_file_extension(file.filename)
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Leer contenido del archivo
        file_content = file.read()
        
        # Determinar el tipo de imagen (producto o servicio) desde el parámetro
        image_type = request.form.get('type', 'product')  # por defecto 'product'
        bucket_name = 'product-images' if image_type == 'product' else 'service-images'
        
        # Subir a Supabase Storage
        result = supabase.storage.from_(bucket_name).upload(
            unique_filename,
            file_content,
            file_options={
                "content-type": f"image/{file_extension}"
            }
        )
        
        if hasattr(result, 'error') and result.error:
            return jsonify({"error": f"Error al subir imagen: {result.error}"}), 500
        
        # Obtener URL pública
        public_url_response = supabase.storage.from_(bucket_name).get_public_url(unique_filename)
        image_url = public_url_response
        
        return jsonify({
            "message": "Imagen subida exitosamente",
            "image_url": image_url,
            "filename": unique_filename
        }), 201
        
    except Exception as e:
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500

@app.route('/api/delete-image/<filename>', methods=['DELETE'])
@require_auth
def delete_image(filename):
    try:
        # Validar que el bucket sea válido
        bucket = request.args.get('bucket', 'product-images')
        if bucket not in ['product-images', 'service-images']:
            return jsonify({"error": "Bucket no válido"}), 400
            
        # Eliminar imagen del Storage
        result = supabase.storage.from_(bucket).remove([filename])
        
        return jsonify({"message": "Imagen eliminada exitosamente"})
        
    except Exception as e:
        return jsonify({"error": f"Error al eliminar imagen: {str(e)}"}), 500

# Obtener todos los productos
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        response = supabase.table('products').select('*').execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Crear nuevo producto
@app.route('/api/products', methods=['POST'])
@require_auth
def create_product():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('name') or not data.get('price'):
            return jsonify({"error": "Nombre y precio son requeridos"}), 400
        
        response = supabase.table('products').insert(data).execute()
        return jsonify(response.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Obtener producto por ID
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        response = supabase.table('products').select('*').eq('id', product_id).execute()
        
        if not response.data:
            return jsonify({"error": "Producto no encontrado"}), 404
            
        return jsonify(response.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Actualizar producto
@app.route('/api/products/<int:product_id>', methods=['PUT'])
@require_auth
def update_product(product_id):
    try:
        data = request.get_json()
        
        response = supabase.table('products').update(data).eq('id', product_id).execute()
        
        if not response.data:
            return jsonify({"error": "Producto no encontrado"}), 404
            
        return jsonify(response.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Eliminar producto
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@require_auth
def delete_product(product_id):
    try:
        # Obtener producto para eliminar imagen si existe
        product_response = supabase.table('products').select('*').eq('id', product_id).execute()
        
        if not product_response.data:
            return jsonify({"error": "Producto no encontrado"}), 404
        
        product = product_response.data[0]
        
        # Eliminar imagen del storage si existe y es una URL de Supabase
        if product.get('image_url') and 'supabase' in product['image_url']:
            try:
                # Extraer nombre del archivo de la URL
                filename = product['image_url'].split('/')[-1]
                supabase.storage.from_("product-images").remove([filename])
            except:
                pass  # Si falla la eliminación de la imagen, continuar eliminando el producto
        
        # Eliminar producto
        response = supabase.table('products').delete().eq('id', product_id).execute()
        
        if not response.data:
            return jsonify({"error": "Producto no encontrado"}), 404
            
        return jsonify({"message": "Producto eliminado correctamente"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Obtener categorías
@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        response = supabase.table('categories').select('*').execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Crear categoría
@app.route('/api/categories', methods=['POST'])
@require_auth
def create_category():
    try:
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({"error": "Nombre es requerido"}), 400
        
        response = supabase.table('categories').insert(data).execute()
        return jsonify(response.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========= AUTENTICACIÓN =========

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email y contraseña son requeridos"}), 400
        
        # Autenticar con Supabase
        auth_response = supabase_auth.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if auth_response.user:
            # Guardar sesión
            session['user_id'] = auth_response.user.id
            session['user_email'] = auth_response.user.email
            
            return jsonify({
                "message": "Login exitoso",
                "user": {
                    "id": auth_response.user.id,
                    "email": auth_response.user.email
                }
            })
        else:
            return jsonify({"error": "Credenciales inválidas"}), 401
            
    except Exception as e:
        return jsonify({"error": "Error de autenticación: " + str(e)}), 401

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({"message": "Logout exitoso"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        return jsonify({
            "authenticated": True,
            "user": {
                "id": session['user_id'],
                "email": session['user_email']
            }
        })
    else:
        return jsonify({"authenticated": False}), 401

# ========= SERVICIOS =========

@app.route('/api/services', methods=['GET'])
def get_services():
    try:
        response = supabase.table('services').select('*').eq('is_active', True).execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/services', methods=['POST'])
@require_auth
def create_service():
    try:
        data = request.get_json()
        
        if not data.get('name') or not data.get('price'):
            return jsonify({"error": "Nombre y precio son requeridos"}), 400
        
        response = supabase.table('services').insert(data).execute()
        return jsonify(response.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    try:
        response = supabase.table('services').select('*').eq('id', service_id).execute()
        
        if not response.data:
            return jsonify({"error": "Servicio no encontrado"}), 404
            
        return jsonify(response.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/services/<int:service_id>', methods=['PUT'])
@require_auth
def update_service(service_id):
    try:
        data = request.get_json()
        
        response = supabase.table('services').update(data).eq('id', service_id).execute()
        
        if not response.data:
            return jsonify({"error": "Servicio no encontrado"}), 404
            
        return jsonify(response.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/services/<int:service_id>', methods=['DELETE'])
@require_auth
def delete_service(service_id):
    try:
        # Obtener servicio para eliminar imagen si existe
        service_response = supabase.table('services').select('*').eq('id', service_id).execute()
        
        if not service_response.data:
            return jsonify({"error": "Servicio no encontrado"}), 404
        
        service = service_response.data[0]
        
        # Eliminar imagen del storage si existe y es una URL de Supabase
        if service.get('image_url') and 'supabase' in service['image_url']:
            try:
                # Extraer nombre del archivo de la URL
                filename = service['image_url'].split('/')[-1]
                supabase.storage.from_("service-images").remove([filename])
            except:
                pass  # Si falla la eliminación de la imagen, continuar eliminando el servicio
        
        # Eliminar servicio
        response = supabase.table('services').delete().eq('id', service_id).execute()
        
        if not response.data:
            return jsonify({"error": "Servicio no encontrado"}), 404
            
        return jsonify({"message": "Servicio eliminado correctamente"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========= INFORMACIÓN DE CONTACTO =========

@app.route('/api/contact', methods=['GET'])
def get_contact():
    try:
        response = supabase.table('contact_info').select('*').limit(1).execute()
        
        if response.data:
            return jsonify(response.data[0])
        else:
            return jsonify({})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/contact', methods=['PUT'])
@require_auth
def update_contact():
    try:
        data = request.get_json()
        
        # Verificar si ya existe un registro
        existing = supabase.table('contact_info').select('*').limit(1).execute()
        
        if existing.data:
            # Actualizar registro existente
            response = supabase.table('contact_info').update(data).eq('id', existing.data[0]['id']).execute()
        else:
            # Crear nuevo registro
            response = supabase.table('contact_info').insert(data).execute()
        
        return jsonify(response.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Para Vercel
app_instance = app

if __name__ == '__main__':
    app.run(debug=True)