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

-- ==========================================
-- SISTEMA DE PEDIDOS (ORDERS)
-- ==========================================

-- Tabla de Clientas
DROP TABLE IF EXISTS public.clients CASCADE;
CREATE TABLE public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    whatsapp TEXT UNIQUE NOT NULL,
    tiktok_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS Clientas
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de clientes" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Cualquiera puede registrarse" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins pueden ver y modificar clientes" ON public.clients FOR ALL USING (auth.role() = 'authenticated');


-- Tabla de Pedidos
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'canceled')),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Prendas de Pedido (Order Items)
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas para Pedidos
-- Clientas pueden insertar (crear pedido)
CREATE POLICY "Cualquiera puede crear pedidos" ON public.orders FOR INSERT WITH CHECK (true);
-- Clientas pueden ver sus propios pedidos (opcional, si los buscaran) o admins ven todo. 
-- NOTA: Se requiere lectura pública para que el sistema devuelva el ID del pedido recién creado.
CREATE POLICY "Lectura publica de pedidos" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admins pueden ver y modificar pedidos" ON public.orders FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para Prendas de Pedido
CREATE POLICY "Lectura publica de items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Cualquiera puede crear items de pedido" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins pueden ver y modificar items" ON public.order_items FOR ALL USING (auth.role() = 'authenticated');

-- Crear el bucket de Storage para las imágenes de pedidos
insert into storage.buckets (id, name, public) values ('order-images', 'order-images', true);

-- Políticas para Storage de pedidos
create policy "Lectura pública de imágenes de pedidos"
  on storage.objects for select
  using ( bucket_id = 'order-images' );

-- Cualquiera puede subir capturas de pantalla de su pedido
create policy "Cualquiera puede subir imágenes de pedidos"
  on storage.objects for insert
  with check ( bucket_id = 'order-images' );

create policy "Admins pueden actualizar imágenes de pedidos"
  on storage.objects for update
  using ( bucket_id = 'order-images' AND auth.role() = 'authenticated' );

create policy "Admins pueden eliminar imágenes de pedidos"
  on storage.objects for delete
  using ( bucket_id = 'order-images' AND auth.role() = 'authenticated' );

