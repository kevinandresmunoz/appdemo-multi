# Gestor de Productos - Sistema Web Completo

Sistema web completo para la gestión de productos y servicios de cualquier tipo de negocio. Incluye sitio público para clientes y panel administrativo para la gestión de contenido. Desarrollado con tecnologías web modernas y preparado para despliegue en la nube.

## Características Principales

### Funcionalidades del Sitio Público
- **Catálogo de Productos**: Visualización atractiva de productos con imágenes, precios y descripciones
- **Lista de Servicios**: Presentación de servicios con detalles de precios y duración
- **Página de Contacto**: Información completa del negocio con datos de contacto y redes sociales
- **Diseño Responsive**: Adaptable a dispositivos móviles, tabletas y escritorio
- **Identidad Dinámica**: El nombre del negocio se actualiza automáticamente en todo el sitio

### Panel Administrativo
- **Sistema de Autenticación**: Login seguro con Supabase Auth
- **Gestión de Productos**: Crear, editar, eliminar productos con subida de imágenes
- **Gestión de Servicios**: Administrar servicios con imágenes y detalles específicos
- **Información del Negocio**: Actualizar datos de contacto, redes sociales y horarios
- **Subida de Imágenes**: Integración con Supabase Storage para manejo de archivos
- **Eliminación Inteligente**: Al eliminar productos/servicios, también se eliminan sus imágenes

### Características Técnicas
- **API RESTful**: Backend con Flask y endpoints bien documentados
- **Base de Datos**: PostgreSQL con Supabase (RLS, triggers, políticas de seguridad)
- **Storage en la Nube**: Manejo de imágenes con Supabase Storage
- **Deploy Ready**: Configurado para despliegue inmediato en Vercel
- **Progressive**: Nombre dinámico del negocio en todas las páginas
- **UI/UX Profesional**: Paleta de colores azul-gris, tipografía moderna

## Estructura del Proyecto

```
app_demo/
├── 📁 frontend/
│   ├── 📁 public/                       # Sitio público para clientes
│   │   ├── 📄 index.html               # Página principal (productos)
│   │   ├── 📄 servicios.html           # Lista de servicios
│   │   ├── 📄 contacto.html            # Información de contacto
│   │   ├── 📁 css/
│   │   │   └── 📄 styles.css           # Estilos globales del sitio
│   │   └── 📁 js/
│   │       ├── 📄 config.js            # Configuración de API y funciones compartidas
│   │       ├── 📄 business-name.js     # Carga dinámica del nombre del negocio
│   │       ├── 📄 footer.js            # Pie de página dinámico
│   │       ├── 📄 products.js          # Lógica para mostrar productos
│   │       ├── 📄 services.js          # Lógica para mostrar servicios
│   │       └── 📄 contact.js           # Lógica para mostrar información de contacto
│   └── 📁 admin/                        # Panel administrativo
│       ├── 📄 login.html               # Página de inicio de sesión
│       ├── 📄 dashboard.html           # Panel de administración principal
│       ├── 📁 css/
│       │   └── 📄 admin.css            # Estilos específicos del panel admin
│       └── 📁 js/
│           ├── 📄 auth.js              # Manejo de autenticación
│           ├── 📄 business-name-admin.js # Nombre dinámico para dashboard
│           ├── 📄 business-name-login.js # Nombre dinámico para login
│           ├── 📄 footer-admin.js      # Pie de página para área admin
│           └── 📄 dashboard.js         # Lógica completa del panel admin
├── 📁 backend/
│   ├── 📄 app.py                       # API Flask principal
│   ├── 📄 requirements.txt             # Dependencias Python
│   └── 📁 supabase/
│       ├── 📄 0-create_tables.sql      # Creación de tablas principales
│       ├── 📄 1-polices.sql            # Políticas de seguridad RLS
│       ├── 📄 3-trigger.sql            # Triggers automáticos
│       ├── 📄 add_service_images_bucket.sql # Configuración de storage para servicios
│       └── 📄 README.md                # Guía de configuración de Supabase
├── 📄 vercel.json                      # Configuración para despliegue en Vercel
├── 📄 runtime.txt                      # Versión de Python para Vercel
├── 📄 package.json                     # Metadatos del proyecto
└── 📄 README.md                        # Este archivo
```

## Stack Tecnológico

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Flexbox, Grid, Variables CSS, Responsive Design
- **JavaScript ES6+**: Módulos, Async/Await, DOM manipulation
- **Vanilla JS**: Sin frameworks, máximo rendimiento

### Backend
- **Python 3.12**: Lenguaje del servidor
- **Flask**: Framework web minimalista y potente
- **Flask-CORS**: Manejo de CORS para SPA

### Base de Datos y Storage
- **PostgreSQL**: Base de datos principal (via Supabase)
- **Supabase**: BaaS completo con auth, database y storage
- **Supabase Storage**: Almacenamiento de imágenes en la nube
- **Row Level Security (RLS)**: Seguridad a nivel de fila

### Despliegue
- **Vercel**: Plataforma de despliegue serverless
- **Git**: Control de versiones

## Instalación y Configuración

### 1. Configuración de Supabase

1. **Crear proyecto en Supabase**: Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto

2. **Ejecutar scripts SQL** en orden (desde SQL Editor de Supabase):
   ```sql
   -- Ejecutar en este orden:
   backend/supabase/0-create_tables.sql
   backend/supabase/1-polices.sql
   backend/supabase/3-trigger.sql
   backend/supabase/add_service_images_bucket.sql
   ```

3. **Crear usuario administrador**:
   - Ve a Authentication > Users en Supabase
   - Crea un nuevo usuario con email y contraseña
   - Este será tu acceso al panel admin

4. **Obtener credenciales**:
   - **URL**: Settings > Project Settings > API
   - **Anon Key**: Settings > Project Settings > API
   - **Service Role Key**: Settings > Project Settings > API (⚠️ Mantén segura)

### 2.  Configuración del Backend

1. **Instalar dependencias**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` con tus credenciales de Supabase:
   ```env
   SUPABASE_URL=tu_supabase_url
   SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_KEY=tu_supabase_service_role_key
   FLASK_SECRET_KEY=genera_una_clave_aleatoria_aqui
   ```

3. **Ejecutar servidor local**:
   ```bash
   python app.py
   ```
   El servidor estará disponible en `http://localhost:5000`

### 3.  Configuración del Frontend

El frontend no requiere configuración adicional. Los archivos están configurados para usar la API local en desarrollo (`http://localhost:5000`).

**Para abrir la aplicación**:
- **Sitio público**: Abre `frontend/public/index.html` en tu navegador
- **Panel admin**: Abre `frontend/admin/login.html`

##  Despliegue en Vercel

### Preparación

El proyecto ya está configurado para Vercel con:
-  `vercel.json` configurado
-  `runtime.txt` con Python 3.12
-  `requirements.txt` actualizado
-  Flask app preparada para serverless

### Pasos de Despliegue

1. ** Subir a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin tu-repositorio-github.git
   git push -u origin main
   ```

2. ** Conectar con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

3. ** Configurar Variables de Entorno** en Vercel Dashboard:
   ```
   SUPABASE_URL = tu_supabase_url
   SUPABASE_ANON_KEY = tu_supabase_anon_key
   SUPABASE_SERVICE_KEY = tu_supabase_service_key
   FLASK_SECRET_KEY = clave_secreta_aleatoria
   ```

4. ** Deploy**:
   - Vercel iniciará el deploy automáticamente
   - El proyecto estará disponible en `https://tu-proyecto.vercel.app`

### URLs de Producción
- ** Sitio público**: `https://tu-proyecto.vercel.app/`
- ** Página de servicios**: `https://tu-proyecto.vercel.app/servicios.html`
- ** Contacto**: `https://tu-proyecto.vercel.app/contacto.html`
- ** Admin login**: `https://tu-proyecto.vercel.app/admin/login.html`
- ** Dashboard**: `https://tu-proyecto.vercel.app/admin/dashboard.html`
- ** API**: `https://tu-proyecto.vercel.app/api/products`

##  Documentación de la API

### Autenticación
```http
POST /api/auth/login          # Iniciar sesión
POST /api/auth/logout         # Cerrar sesión
GET  /api/auth/check          # Verificar sesión activa
```

### Productos
```http
GET    /api/products          # Listar todos los productos
POST   /api/products          # Crear nuevo producto ( Auth requerida)
GET    /api/products/{id}     # Obtener producto específico
PUT    /api/products/{id}     # Actualizar producto ( Auth requerida)
DELETE /api/products/{id}     # Eliminar producto ( Auth requerida)
```

### Servicios
```http
GET    /api/services          # Listar todos los servicios
POST   /api/services          # Crear nuevo servicio ( Auth requerida)
GET    /api/services/{id}     # Obtener servicio específico
PUT    /api/services/{id}     # Actualizar servicio ( Auth requerida)
DELETE /api/services/{id}     # Eliminar servicio ( Auth requerida)
```

### Información de Contacto
```http
GET /api/contact              # Obtener información del negocio
PUT /api/contact              # Actualizar información ( Auth requerida)
```

### Categorías
```http
GET  /api/categories          # Listar categorías
POST /api/categories          # Crear categoría ( Auth requerida)
```

### Imágenes
```http
POST   /api/upload-image      # Subir imagen ( Auth requerida)
DELETE /api/delete-image/{filename} # Eliminar imagen ( Auth requerida)
```

##  Esquema de Base de Datos

### Tablas Principales

** products** - Catálogo de productos
- `id` (BIGINT, PK) - Identificador único
- `name` (TEXT, NOT NULL) - Nombre del producto
- `description` (TEXT) - Descripción detallada
- `price` (NUMERIC(10,2), NOT NULL) - Precio
- `stock` (INT, DEFAULT 0) - Cantidad disponible
- `image_url` (TEXT) - URL de la imagen
- `category_id` (BIGINT, FK) - Referencia a categorías
- `subcategory` (TEXT) - Subcategoría
- `expiry_date` (DATE) - Fecha de vencimiento
- `created_at` (TIMESTAMPTZ) - Fecha de creación

** services** - Servicios ofrecidos
- `id` (BIGINT, PK) - Identificador único
- `name` (TEXT, NOT NULL) - Nombre del servicio
- `description` (TEXT) - Descripción detallada
- `price` (NUMERIC(10,2), NOT NULL) - Precio
- `duration` (TEXT) - Duración estimada
- `image_url` (TEXT) - URL de la imagen
- `is_active` (BOOLEAN, DEFAULT TRUE) - Estado activo/inactivo
- `created_at` (TIMESTAMPTZ) - Fecha de creación

** contact_info** - Información del negocio
- `id` (BIGINT, PK) - Identificador único
- `business_name` (TEXT, NOT NULL) - Nombre del negocio
- `address` (TEXT) - Dirección física
- `phone` (TEXT) - Teléfono principal
- `email` (TEXT) - Correo electrónico
- `whatsapp` (TEXT) - Número de WhatsApp
- `facebook` (TEXT) - URL de Facebook
- `instagram` (TEXT) - URL de Instagram
- `business_hours` (TEXT) - Horarios de atención
- `description` (TEXT) - Descripción del negocio
- `updated_at` (TIMESTAMPTZ) - Última actualización

** categories** - Categorías de productos
- `id` (BIGINT, PK) - Identificador único
- `name` (TEXT, NOT NULL, UNIQUE) - Nombre de la categoría
- `created_at` (TIMESTAMPTZ) - Fecha de creación

** profiles** - Perfiles de administradores
- `id` (UUID, PK, FK auth.users) - ID del usuario
- `full_name` (TEXT) - Nombre completo
- `email` (TEXT, UNIQUE) - Correo electrónico
- `updated_at` (TIMESTAMPTZ) - Última actualización

###  Seguridad
- **RLS (Row Level Security)**: Activado en todas las tablas
- **Políticas permisivas**: Para desarrollo y uso educativo
- **Storage público**: Buckets `product-images` y `service-images`
- **Triggers automáticos**: Creación de perfiles de usuario

##  Casos de Uso

Este sistema es perfectamente adaptable para diferentes tipos de negocio:

###  **Tiendas y Comercios**
- Catálogo de productos con stock
- Gestión de categorías
- Información de contacto y horarios

###  **Restaurantes**
- Menú de comidas (como productos)
- Servicios de catering
- Información de delivery y horarios

###  **Salones de Belleza**
- Servicios de belleza con precios y duración
- Productos de cuidado personal
- Reservas por WhatsApp

###  **Talleres y Servicios Técnicos**
- Servicios ofrecidos con tiempo estimado
- Repuestos y productos (como stock)
- Información de contacto

###  **Academias y Cursos**
- Cursos como servicios con duración
- Material educativo como productos
- Horarios y formas de contacto

##  Flujo de Trabajo

### Para Desarrolladores
1. **Desarrollo local**: Ejecutar Flask + abrir HTML en navegador
2. **Testing**: Probar todas las funcionalidades CRUD
3. **Deploy**: Push a GitHub → Auto-deploy en Vercel
4. **Configuración**: Variables de entorno en Vercel Dashboard

### Para Usuarios Finales
1. **Cliente accede** al sitio público
2. **Ve productos/servicios** disponibles
3. **Consulta información** de contacto
4. **Administrador gestiona** contenido desde panel admin

##  Características Técnicas Avanzadas

- ** Progressive Web App Ready**: Fácil conversión a PWA
- ** SEO Friendly**: HTML semántico y meta tags
- ** Accesibilidad**: Estructura ARIA y navegación por teclado
- ** Performance**: Lazy loading de imágenes, CSS y JS minificados
- ** Seguridad**: Validación frontend y backend, sanitización de datos
- ** Escalabilidad**: Estructura modular para nuevas funcionalidades

##  Personalización

### Cambiar Colores
Edita las variables CSS en `frontend/public/css/styles.css`:
```css
:root {
    --primary-blue: #2980b9;      /* Color principal */
    --secondary-blue: #3498db;     /* Color secundario */
    --dark-gray: #34495e;          /* Gris oscuro */
    --light-gray: #95a5a6;         /* Gris claro */
}
```

### Agregar Nuevas Funcionalidades
1. **Backend**: Agregar endpoints en `app.py`
2. **Database**: Crear tablas en Supabase
3. **Frontend**: Crear nuevos archivos JS/CSS
4. **Integration**: Conectar con la API existente

### Modificar Estructura
- **Páginas**: Agregar HTML en `frontend/public/`
- **Estilos**: Extender CSS existente
- **Lógica**: Crear nuevos módulos JS

##  Recursos Adicionales

- **[Supabase Docs](https://supabase.com/docs)**: Documentación oficial
- **[Flask Documentation](https://flask.palletsprojects.com/)**: Guías de Flask
- **[Vercel Docs](https://vercel.com/docs)**: Despliegue y configuración
- **[JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)**: Referencias JS

##  Solución de Problemas

### Error: "No autorizado"
-  Verificar que el usuario esté creado en Supabase
-  Confirmar que las credenciales sean correctas
-  Revisar que las variables de entorno estén configuradas

### Error: "Bucket not found"
-  Ejecutar `add_service_images_bucket.sql`
-  Verificar buckets en Supabase Storage
-  Confirmar políticas de storage

### Error de CORS
-  Verificar configuración en `app.py`
-  Confirmar origins permitidos
-  Revistar headers de peticiones

##  Licencia

MIT License - Libre para uso educativo y comercial.

---

** Desarrollado para fines educativos** | ** Listo para producción** | ** Responsive Design** | ** Cloud Ready**