# Configuración de Base de Datos Supabase

## Descripción General

Este directorio contiene los scripts SQL necesarios para configurar completamente la base de datos PostgreSQL en Supabase para el proyecto Gestor de Productos. La configuración incluye tablas, políticas de seguridad, triggers y configuración de almacenamiento de archivos.

## Arquitectura de Base de Datos

### Tablas Principales
```
products           # Catálogo de productos
services           # Servicios ofrecidos  
categories         # Categorías de productos
contact_info       # Información del negocio
profiles           # Perfiles de usuarios administradores
appointments       # Citas médicas/servicios
invoices           # Facturas de venta
invoice_items      # Items de cada factura
orders             # Pedidos del sitio público
order_items        # Items de cada pedido
```

### Storage Buckets
```
product-images     # Imágenes de productos (público)
service-images     # Imágenes de servicios (público)
```

## Configuración Paso a Paso

### 1. Crear Proyecto en Supabase

#### Paso 1.1: Registro y Proyecto
1. Ve a https://supabase.com
2. Crea una cuenta gratuita
3. Click en "New project"
4. Completa los datos:
   - **Name**: `gestor-productos`
   - **Database Password**: Genera una contraseña segura
   - **Region**: Selecciona la más cercana

#### Paso 1.2: Obtener Credenciales
Una vez creado el proyecto, ve a **Settings > API** y copia:
- **Project URL**: `https://tu-proyecto.supabase.co`
- **anon public key**: Clave pública
- **service_role key**: Clave de servicio (mantener secreta)

### 2. Ejecutar Scripts SQL

**IMPORTANTE**: Los scripts deben ejecutarse en el orden exacto indicado.

#### Paso 2.1: Acceder al Editor SQL
1. En tu proyecto Supabase, ve a **SQL Editor**
2. Click en **New query**

#### Paso 2.2: Ejecutar Scripts en Orden

##### Script 1: Crear Tablas (`0-create_tables.sql`)
```sql
-- Copiar y pegar todo el contenido del archivo 0-create_tables.sql
-- Este script crea:
-- ✓ Tabla categories (categorías de productos)
-- ✓ Tabla products (productos del catálogo)
-- ✓ Tabla services (servicios ofrecidos)
-- ✓ Tabla contact_info (información del negocio)
-- ✓ Tabla profiles (perfiles de administradores)
-- ✓ Tabla appointments (citas)
-- ✓ Tabla invoices (facturas)
-- ✓ Tabla invoice_items (items de facturas)
-- ✓ Tabla orders (pedidos públicos)
-- ✓ Tabla order_items (items de pedidos)
-- ✓ Bucket product-images (almacenamiento de imágenes de productos)
```

**Ejecutar**: Click en "Run" y verificar que aparezca "Success"

##### Script 2: Políticas de Seguridad (`1-polices.sql`)
```sql
-- Copiar y pegar todo el contenido del archivo 1-polices.sql
-- Este script configura:
-- ✓ Habilita Row Level Security en todas las tablas
-- ✓ Crea políticas permisivas para desarrollo
-- ✓ Permite acceso público y autenticado según corresponda
```

**Ejecutar**: Click en "Run" y verificar que aparezca "Success"

##### Script 3: Triggers y Funciones (`3-trigger.sql`)
```sql
-- Copiar y pegar todo el contenido del archivo 3-trigger.sql
-- Este script crea:
-- ✓ Función handle_new_user() para crear perfiles automáticamente
-- ✓ Trigger que ejecuta la función al crear nuevos usuarios
```

**Ejecutar**: Click en "Run" y verificar que aparezca "Success"

##### Script 4: Bucket de Servicios (`add_service_images_bucket.sql`)
```sql
-- Copiar y pegar todo el contenido del archivo add_service_images_bucket.sql
-- Este script crea:
-- ✓ Bucket service-images para imágenes de servicios
-- ✓ Políticas de seguridad para el bucket service-images
```

**Ejecutar**: Click en "Run" y verificar que aparezca "Success"

### 3. Verificar Storage para Imágenes

#### Paso 3.1: Verificar Buckets
1. Ve a **Storage** en el panel lateral
2. Verifica que existen los buckets:
   - `product-images` (público)
   - `service-images` (público)
3. Si no existen, créalos manualmente:
   - Click en "New bucket"
   - Name: `product-images` / `service-images`
   - Public bucket: **Activado**

### 4. Crear Usuario Administrador

#### Paso 4.1: Desde el Panel de Supabase
1. Ve a **Authentication > Users** en el panel lateral
2. Click en "Add user"

#### Paso 4.2: Crear Usuario Admin
Completa los datos:
- **Email**: `admin@tu-negocio.com`
- **Password**: `Admin123!` (cambiar después del primer login)
- **Auto Confirm User**: **Activado**

#### Paso 4.3: Verificar Perfil
1. Ve a **Table Editor > profiles**
2. Verifica que se creó automáticamente el perfil del usuario
3. Si no existe, el trigger lo creará en el primer login

### 5. Datos de Prueba (Opcional)

#### Información de Contacto Inicial
```sql
INSERT INTO contact_info (business_name, description) VALUES
('Mi Negocio', 'Descripción de mi negocio')
ON CONFLICT DO NOTHING;
```

#### Categorías de Ejemplo
```sql
INSERT INTO categories (name) VALUES
('Alimentación'),
('Accesorios'),
('Cuidado Personal'),
('Juguetes');
```

#### Productos de Ejemplo
```sql
INSERT INTO products (name, description, price, stock, category_id) VALUES
('Producto Demo 1', 'Descripción del producto demo', 25000.00, 10, 1),
('Producto Demo 2', 'Otro producto de ejemplo', 15000.00, 5, 2);
```

#### Servicios de Ejemplo
```sql
INSERT INTO services (name, description, price, duration, is_active) VALUES
('Servicio Demo 1', 'Descripción del servicio', 50000.00, '1 hora', true),
('Servicio Demo 2', 'Otro servicio de ejemplo', 30000.00, '30 minutos', true);
```

## Verificación de la Configuración

### 1. Verificar Tablas
```sql
-- Listar todas las tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 2. Verificar Políticas
```sql
-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public';
```

### 3. Verificar Storage
```sql
-- Verificar buckets de storage
SELECT id, name, public FROM storage.buckets;
```

### 4. Verificar Usuarios
```sql
-- Verificar usuarios creados
SELECT id, email, created_at FROM auth.users;

-- Verificar perfiles asociados
SELECT * FROM profiles;
```

## Estructura de Tablas Principales

### products
- `id` - Identificador único
- `name` - Nombre del producto
- `description` - Descripción
- `price` - Precio
- `stock` - Cantidad disponible
- `image_url` - URL de la imagen
- `category_id` - Referencia a categorías
- `created_at` - Fecha de creación

### services
- `id` - Identificador único
- `name` - Nombre del servicio
- `description` - Descripción
- `price` - Precio
- `duration` - Duración estimada
- `image_url` - URL de la imagen
- `is_active` - Estado activo/inactivo
- `created_at` - Fecha de creación

### contact_info
- `id` - Identificador único
- `business_name` - Nombre del negocio
- `address` - Dirección
- `phone` - Teléfono
- `email` - Email
- `whatsapp` - WhatsApp
- `facebook` - Facebook URL
- `instagram` - Instagram URL
- `business_hours` - Horarios
- `description` - Descripción del negocio

## Troubleshooting

### Error: "relation does not exist"
- Verificar que se ejecutó el script `0-create_tables.sql`
- Revisar que no haya errores de sintaxis

### Error: "RLS policy violation"
- Verificar que se ejecutó el script `1-polices.sql`
- Confirmar que las políticas están activas

### Error: "bucket does not exist"
- Ejecutar script `add_service_images_bucket.sql`
- Crear manualmente los buckets si es necesario
- Verificar que estén marcados como públicos

### No se crean perfiles automáticamente
- Verificar que se ejecutó el script `3-trigger.sql`
- Revisar que el trigger esté activo:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

### Error en subida de imágenes
- Verificar buckets `product-images` y `service-images`
- Confirmar que las políticas de storage están aplicadas
- Verificar que los buckets son públicos

## Variables de Entorno

Después de completar la configuración, configura estas variables:

### Para desarrollo local (.env)
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anon
SUPABASE_SERVICE_KEY=tu_service_role_key
FLASK_SECRET_KEY=tu_clave_secreta_flask
```

### Para Vercel (Environment Variables)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `FLASK_SECRET_KEY`

## Seguridad en Producción

### Recomendaciones:
1. **Cambiar contraseñas** de usuarios administradores
2. **Revisar políticas RLS** para producción
3. **Habilitar 2FA** en la cuenta de Supabase
4. **Monitorear accesos** desde el dashboard
5. **Configurar límites de API** según el plan

### Políticas Más Restrictivas (Ejemplo):
```sql
-- Solo lectura pública, escritura autenticada|
CREATE POLICY "Public read only" ON products
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated full access" ON products
  FOR ALL TO authenticated USING (true);
```

## Mantenimiento

### Crear Respaldo
```sql
-- Exportar datos principales
\copy (SELECT * FROM products) TO 'products_backup.csv' WITH CSV HEADER;
\copy (SELECT * FROM services) TO 'services_backup.csv' WITH CSV HEADER;
\copy (SELECT * FROM contact_info) TO 'contact_backup.csv' WITH CSV HEADER;
```

### Limpiar Datos de Prueba
```sql
-- CUIDADO: Esto elimina todos los datos
DELETE FROM products WHERE name LIKE '%Demo%';
DELETE FROM services WHERE name LIKE '%Demo%';
```

---

**Nota**: Esta configuración está optimizada para desarrollo y fines educativos. Para producción, revisar las políticas de seguridad según los requisitos específicos del negocio.