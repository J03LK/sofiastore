import { useState, useEffect } from 'react';
import { productService } from '../../services/supabase/productService';
import { FaTrash, FaPlus } from 'react-icons/fa';
import ProductForm from './ProductForm';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await productService.updateProductStatus(id, newStatus);
      loadProducts();
    } catch {
      alert("Error al actualizar el estado");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await productService.deleteProduct(id);
      loadProducts();
    } catch {
      alert("Error al eliminar el producto");
    }
  };

  const statusColors = {
    available: 'bg-success/10 text-success',
    separated: 'bg-error/10 text-error',
    sold: 'bg-gray-200 text-gray-700'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-textMain">Gestión de Productos</h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <FaPlus /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-textMuted">Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-textMuted">No tienes productos. ¡Agrega el primero!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-textMain text-sm">Producto</th>
                  <th className="p-4 font-semibold text-textMain text-sm">Precio</th>
                  <th className="p-4 font-semibold text-textMain text-sm">Categoría</th>
                  <th className="p-4 font-semibold text-textMain text-sm">Estado</th>
                  <th className="p-4 font-semibold text-textMain text-sm text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden">
                          {p.images && p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-textMain line-clamp-1">{p.name}</p>
                          <p className="text-xs text-textMuted font-mono">{p.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-primary">${p.price}</td>
                    <td className="p-4 text-textMuted">{p.category}</td>
                    <td className="p-4">
                      <select 
                        value={p.status} 
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className={`text-sm font-bold px-3 py-1 rounded-full outline-none ${statusColors[p.status]}`}
                      >
                        <option value="available">Disponible</option>
                        <option value="separated">Separado</option>
                        <option value="sold">Vendido</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors ml-2"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <ProductForm 
          onCancel={() => setIsFormOpen(false)} 
          onComplete={() => {
            setIsFormOpen(false);
            loadProducts();
          }} 
        />
      )}
    </div>
  );
};

export default ProductManager;
