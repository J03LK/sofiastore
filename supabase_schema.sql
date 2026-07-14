-- Copia y pega esto en el SQL Editor de tu proyecto en Supabase para crear las tablas necesarias

-- Tabla de Categorías
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Productos
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    size TEXT,
    color TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'separated', 'sold')),
    featured BOOLEAN DEFAULT false,
    new BOOLEAN DEFAULT true,
    images TEXT[] DEFAULT '{}',
    slug TEXT UNIQUE,
    code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Políticas para Categorías (Cualquiera puede leer, solo admins pueden modificar)
CREATE POLICY "Lectura pública de categorías" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins pueden modificar categorías" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para Productos (Cualquiera puede leer productos disponibles o todos, solo admins modifican)
CREATE POLICY "Lectura pública de productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins pueden modificar productos" ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- Crear el bucket de Storage para las imágenes
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- Políticas para Storage (Cualquiera puede leer, solo admins pueden subir)
create policy "Lectura pública de imágenes"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Admins pueden subir imágenes"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

create policy "Admins pueden actualizar imágenes"
  on storage.objects for update
  using ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

create policy "Admins pueden eliminar imágenes"
  on storage.objects for delete
  using ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
