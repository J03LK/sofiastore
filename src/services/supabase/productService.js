import { supabase } from './supabaseClient';

export const productService = {
  async getProducts({ categoryId, status, isNew, limit } = {}) {
    let query = supabase.from('products').select('*, category:categories(name)');
    
    if (categoryId) query = query.eq('category_id', categoryId);
    if (status && status !== 'all') query = query.eq('status', status);
    if (isNew !== undefined) query = query.eq('new', isNew);
    
    query = query.order('created_at', { ascending: false });
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(product => ({
      ...product,
      category: product.category?.name || 'Sin Categoría'
    }));
  },

  async getProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return {
      ...data,
      category: data.category?.name || 'Sin Categoría'
    };
  },

  async createProduct(productData, files) {
    const imageUrls = [];
    
    // Subir imágenes a Storage
    if (files && files.length > 0) {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        imageUrls.push(publicUrl);
      }
    }
    
    // Generar un código simple si no viene
    const code = productData.code || `SF-${Date.now().toString().slice(-5)}`;

    // Insertar en base de datos
    const { data, error } = await supabase.from('products').insert([{
      ...productData,
      code,
      images: imageUrls
    }]).select().single();
    
    if (error) throw error;
    return data;
  },

  async updateProductStatus(id, status) {
    const { data, error } = await supabase.from('products').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }
};
