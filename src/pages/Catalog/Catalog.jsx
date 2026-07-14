import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/catalog/ProductCard';
import { productService } from '../../services/supabase/productService';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros (Simplificados por ahora)
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-textMain mb-4"
        >
          Nuestro Catálogo
        </motion.h1>
        <p className="text-textMuted max-w-2xl mx-auto">
          Explora todas nuestras prendas únicas. Utiliza los filtros para encontrar exactamente lo que buscas.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filtros */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-bold text-lg text-textMain mb-4">Filtros</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-textMain mb-3">Categoría</h3>
              <div className="space-y-2">
                {['all', 'Vestidos', 'Blusas', 'Pantalones', 'Accesorios'].map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer text-textMuted hover:text-primary">
                    <input 
                      type="radio" 
                      name="category" 
                      className="text-primary focus:ring-primary accent-primary" 
                      checked={filterCategory === cat}
                      onChange={() => setFilterCategory(cat)}
                    />
                    <span>{cat === 'all' ? 'Todas' : cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-textMain mb-3">Estado</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Todos' },
                  { value: 'available', label: 'Disponibles' },
                  { value: 'separated', label: 'Separados' },
                  { value: 'sold', label: 'Vendidos' }
                ].map(status => (
                  <label key={status.value} className="flex items-center gap-2 cursor-pointer text-textMuted hover:text-primary">
                    <input 
                      type="radio" 
                      name="status" 
                      className="text-primary focus:ring-primary accent-primary" 
                      checked={filterStatus === status.value}
                      onChange={() => setFilterStatus(status.value)}
                    />
                    <span>{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => { setFilterCategory('all'); setFilterStatus('all'); }}
              className="w-full bg-secondary text-primary font-medium py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <span className="text-textMuted font-medium">{filteredProducts.length} productos</span>
            <select className="bg-white border border-gray-200 text-textMain rounded-lg px-4 py-2 outline-none focus:border-primary">
              <option>Más recientes</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-[400px]"></div>
               ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-textMuted text-lg">No hay productos en esta categoría o la tienda está vacía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
