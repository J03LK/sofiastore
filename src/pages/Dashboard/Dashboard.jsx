import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaBox, FaTags, FaChartLine } from 'react-icons/fa';
import CategoryManager from '../../components/dashboard/CategoryManager';
import ProductManager from '../../components/dashboard/ProductManager';
import { productService } from '../../services/supabase/productService';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({ total: 0, available: 0, separated: 0, sold: 0 });

  useEffect(() => {
    if (activeTab === 'stats') {
      productService.getProducts().then(data => {
        setStats({
          total: data.length,
          available: data.filter(p => p.status === 'available').length,
          separated: data.filter(p => p.status === 'separated').length,
          sold: data.filter(p => p.status === 'sold').length,
        });
      });
    }
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-gray-50/50 pt-20 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-primary/10 hidden md:flex flex-col shadow-soft z-10">
        <div className="p-8 border-b border-primary/5">
          <p className="font-serif font-semibold text-2xl text-primary tracking-widest uppercase mb-1">Admin</p>
          <p className="text-xs text-textMuted tracking-wide font-light truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 p-6 space-y-3">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${activeTab === 'stats' ? 'bg-primary text-white shadow-soft font-medium tracking-wide' : 'text-textMuted hover:bg-primary-light/30 hover:text-primary tracking-wide'}`}
          >
            <FaChartLine /> Estadísticas
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${activeTab === 'products' ? 'bg-primary text-white shadow-soft font-medium tracking-wide' : 'text-textMuted hover:bg-primary-light/30 hover:text-primary tracking-wide'}`}
          >
            <FaBox /> Productos
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 ${activeTab === 'categories' ? 'bg-primary text-white shadow-soft font-medium tracking-wide' : 'text-textMuted hover:bg-primary-light/30 hover:text-primary tracking-wide'}`}
          >
            <FaTags /> Categorías
          </button>
        </nav>
        <div className="p-6 border-t border-primary/5">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 text-gray-500 hover:text-error hover:bg-error/5 rounded-xl transition-all duration-300 tracking-wide"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 bg-[#FAFAFA]">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'stats' && (
            <div>
              <div className="mb-10">
                <h2 className="text-3xl font-serif text-textMain mb-2">Resumen de Tienda</h2>
                <div className="w-12 h-px bg-primary"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Productos Totales', value: stats.total, color: 'text-primary' },
                  { label: 'Disponibles', value: stats.available, color: 'text-success' },
                  { label: 'Separados', value: stats.separated, color: 'text-error' },
                  { label: 'Vendidos', value: stats.sold, color: 'text-gray-500' }
                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-8 rounded-2xl shadow-soft border border-primary/5 flex flex-col justify-between">
                    <p className="text-textMuted text-xs font-medium uppercase tracking-wider mb-4">{stat.label}</p>
                    <div className={`font-serif text-5xl font-light ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-serif text-textMain mb-2">Catálogo</h2>
                <div className="w-12 h-px bg-primary"></div>
              </div>
              <ProductManager />
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-serif text-textMain mb-2">Colecciones</h2>
                <div className="w-12 h-px bg-primary mb-4"></div>
                <p className="text-textMuted text-sm font-light tracking-wide">Gestiona las categorías de tus prendas.</p>
              </div>
              <CategoryManager />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
