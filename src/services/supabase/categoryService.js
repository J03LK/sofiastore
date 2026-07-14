import { supabase } from './supabaseClient';

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return data;
  },

  async createCategory(category) {
    const { data, error } = await supabase.from('categories').insert([category]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  }
};
