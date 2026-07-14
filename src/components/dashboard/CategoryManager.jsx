import { useState, useEffect } from 'react';
import { categoryService } from '../../services/supabase/categoryService';
import { FaTrash, FaPlus } from 'react-icons/fa';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setLoading(true);
    try {
      await categoryService.createCategory({ name: newCategory });
      setNewCategory('');
      loadCategories();
    } catch {
      alert("Error al crear categoría");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      await categoryService.deleteCategory(id);
      loadCategories();
    } catch {
      alert("Error al eliminar (Puede que haya productos usándola)");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleAdd} className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nombre de nueva categoría..." 
          className="flex-grow px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-primary"
        />
        <button 
          disabled={loading}
          type="submit" 
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <FaPlus /> Agregar
        </button>
      </form>

      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-textMuted text-center py-4">No hay categorías registradas.</p>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="font-medium text-textMain">{cat.name}</span>
              <button 
                onClick={() => handleDelete(cat.id)}
                className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                title="Eliminar"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
