-- Agregar bucket para imágenes de servicios
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de seguridad para el bucket service-images

-- Política para permitir SELECT (leer) a todos los usuarios
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'service-images');

-- Política para permitir INSERT (subir) solo a usuarios autenticados
CREATE POLICY "Authenticated users can upload service images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'service-images' AND auth.role() = 'authenticated');

-- Política para permitir UPDATE (actualizar) solo a usuarios autenticados
CREATE POLICY "Authenticated users can update service images" ON storage.objects FOR UPDATE USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');

-- Política para permitir DELETE (eliminar) solo a usuarios autenticados
CREATE POLICY "Authenticated users can delete service images" ON storage.objects FOR DELETE USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');