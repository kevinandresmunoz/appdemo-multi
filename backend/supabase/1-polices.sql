-- ========= HABILITAR RLS EN TODAS LAS TABLAS =========
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- ========= POLÍTICAS PERMISIVAS PARA DESARROLLO =========
-- Permitir acceso completo tanto a service_role como a authenticated users

-- Políticas para 'categories'
DROP POLICY IF EXISTS "Public access for categories" ON public.categories;
CREATE POLICY "Public access for categories" ON public.categories
  FOR ALL 
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para 'products'
DROP POLICY IF EXISTS "Public access for products" ON public.products;
CREATE POLICY "Public access for products" ON public.products
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para 'appointments'
DROP POLICY IF EXISTS "Public access for appointments" ON public.appointments;
CREATE POLICY "Public access for appointments" ON public.appointments
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para 'invoices'
DROP POLICY IF EXISTS "Public access for invoices" ON public.invoices;
CREATE POLICY "Public access for invoices" ON public.invoices
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para 'invoice_items'
DROP POLICY IF EXISTS "Public access for invoice_items" ON public.invoice_items;
CREATE POLICY "Public access for invoice_items" ON public.invoice_items
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para 'orders'
DROP POLICY IF EXISTS "Public access for orders" ON public.orders;
CREATE POLICY "Public access for orders" ON public.orders
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para 'order_items'
DROP POLICY IF EXISTS "Public access for order_items" ON public.order_items;
CREATE POLICY "Public access for order_items" ON public.order_items
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para 'profiles'
DROP POLICY IF EXISTS "Public access for profiles" ON public.profiles;
CREATE POLICY "Public access for profiles" ON public.profiles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- ========= POLÍTICAS PARA EL STORAGE (IMÁGENES) =========
-- Acceso público completo para desarrollo

-- Política de Lectura (SELECT)
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
CREATE POLICY "Public read access for product images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Política de Subida (INSERT)
DROP POLICY IF EXISTS "Public upload access for product images" ON storage.objects;
CREATE POLICY "Public upload access for product images"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'product-images');

-- Política de Actualización (UPDATE)
DROP POLICY IF EXISTS "Public update access for product images" ON storage.objects;
CREATE POLICY "Public update access for product images"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'product-images');

-- Política de Eliminación (DELETE)
DROP POLICY IF EXISTS "Public delete access for product images" ON storage.objects;
CREATE POLICY "Public delete access for product images"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'product-images');

-- Políticas para 'services'
DROP POLICY IF EXISTS "Public access for services" ON public.services;
CREATE POLICY "Public access for services" ON public.services
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Políticas para 'contact_info'
DROP POLICY IF EXISTS "Public access for contact_info" ON public.contact_info;
CREATE POLICY "Public access for contact_info" ON public.contact_info
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);