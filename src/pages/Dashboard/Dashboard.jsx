import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingBag, FaChartBar, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import OrderManager from '../../components/dashboard/OrderManager';
import ClientManager from '../../components/dashboard/ClientManager';
import StatsManager from '../../components/dashboard/StatsManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const menuItems = [
    { id: 'orders', label: 'Gestión de Pedidos', icon: FaShoppingBag },
    { id: 'clients', label: 'Clientas', icon: FaUsers },
    { id: 'stats', label: 'Estadísticas', icon: FaChartBar },
    { id: 'settings', label: 'Configuración', icon: FaCog },
  ];

  const handleLogout = () => {
    // Basic logout logic
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-noir-bg flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-noir-surface border-r border-gray-100 dark:border-noir-border flex-shrink-0 sticky top-0 md:h-screen z-20 transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-noir-border">
          <h1 className="text-2xl font-serif text-textMain dark:text-gray-100">Panel de Control</h1>
          <p className="text-sm text-textMuted dark:text-gray-400 mt-1">Administración de Pedidos</p>
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-white font-medium shadow-sm' 
                    : 'text-textMuted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-textMain dark:hover:text-gray-100'
                }`}
              >
                <Icon className={isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-noir-border mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/5 dark:hover:bg-error/10 rounded-xl transition-colors"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h2 className="text-2xl font-serif text-textMain dark:text-gray-100">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'orders' && <OrderManager />}
              {activeTab === 'clients' && <ClientManager />}
              {activeTab === 'stats' && <StatsManager />}
              {activeTab === 'settings' && (
                <div className="bg-white dark:bg-noir-surface p-8 rounded-2xl border border-gray-100 dark:border-noir-border text-center">
                  <FaCog className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-textMain dark:text-gray-100 mb-2">Configuración</h3>
                  <p className="text-textMuted dark:text-gray-400">Opciones de configuración de la tienda.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
