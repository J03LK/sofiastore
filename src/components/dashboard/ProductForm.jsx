import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { productService } from '../../services/supabase/productService';
import { categoryService } from '../../services/supabase/categoryService';

const ProductForm = ({ onComplete, onCancel }) => {
  const { register, handleSubmit } = useForm();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        size: data.size,
        color: data.color,
        category_id: data.category_id,
        new: data.new === 'true'
      };

      await productService.createProduct(productData, files);
      onComplete();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al crear el producto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 md:p-8 my-8 shadow-xl">
        <h2 className="text-2xl font-bold text-textMain mb-6">Agregar Nuevo Producto</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textMain mb-1">Nombre</label>
              <input {...register('name', { required: true })} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-1">Precio ($)</label>
              <input type="number" step="0.01" {...register('price', { required: true })} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-1">Talla</label>
              <input {...register('size')} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary" placeholder="Ej: M, L, Única" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-1">Color</label>
              <input {...register('color')} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-1">Categoría</label>
              <select {...register('category_id', { required: true })} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary bg-white">
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-1">Estado (¿Es Nuevo?)</label>
              <select {...register('new')} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary bg-white">
                <option value="true">Sí, recién ingresado</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-1">Descripción</label>
            <textarea {...register('description')} rows="3" className="w-full px-4 py-2 border rounded-xl outline-none focus:border-primary"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-1">Imágenes</label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="w-full px-4 py-2 border rounded-xl outline-none"
            />
            <p className="text-xs text-textMuted mt-1">Selecciona una o más imágenes para el producto.</p>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="px-6 py-2 text-textMuted hover:bg-gray-100 rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-hover text-white px-8 py-2 rounded-xl transition-colors disabled:opacity-50 font-medium shadow-md">
              {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
