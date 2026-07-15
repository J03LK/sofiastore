import { useState, useEffect } from 'react';
import { getOrders } from '../../services/supabase/orderService';
import { FaMoneyBillWave, FaWallet, FaHandHoldingUsd, FaShoppingBag, FaBoxOpen } from 'react-icons/fa';

const StatsManager = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPaid: 0,
    totalDebt: 0,
    activeOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const orders = await getOrders();
        
        let totalSales = 0;
        let totalPaid = 0;
        let activeOrders = 0;
        let deliveredOrders = 0;

        orders.forEach(order => {
          // Skip canceled orders for money stats
          if (order.status !== 'canceled') {
            totalSales += Number(order.total_amount || 0);
            totalPaid += Number(order.paid_amount || 0);
            
            if (order.status === 'delivered') {
              deliveredOrders++;
            } else {
              activeOrders++;
            }
          }
        });

        setStats({
          totalSales,
          totalPaid,
          totalDebt: Math.max(0, totalSales - totalPaid),
          activeOrders,
          deliveredOrders
        });
      } catch (error) {
        console.error("Error fetching stats for dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-colors duration-300">
      <h3 className="text-xl font-serif text-textMain dark:text-gray-100 mb-4">Resumen Financiero</h3>
      
      {/* Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Sales */}
        <div className="bg-white dark:bg-noir-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-noir-border flex items-center gap-4 dark:hover:shadow-glow-primary transition-all duration-300">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl text-blue-600 dark:text-blue-400">
            <FaMoneyBillWave className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Total Vendido</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalSales.toFixed(2)}</p>
          </div>
        </div>

        {/* Total Paid (Recaudado) */}
        <div className="bg-white dark:bg-noir-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-noir-border flex items-center gap-4 dark:hover:shadow-glow-primary transition-all duration-300">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl text-green-600 dark:text-green-400">
            <FaWallet className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Recaudado (Abonos)</p>
            <p className="text-3xl font-bold text-success">${stats.totalPaid.toFixed(2)}</p>
          </div>
        </div>

        {/* Total Debt */}
        <div className="bg-white dark:bg-noir-surface p-6 rounded-2xl shadow-sm border border-red-100 dark:border-noir-border flex items-center gap-4 relative overflow-hidden dark:hover:shadow-glow-primary transition-all duration-300">
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-error"></div>
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl text-red-600 dark:text-red-400">
            <FaHandHoldingUsd className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Deuda en la calle</p>
            <p className="text-3xl font-bold text-error">${stats.totalDebt.toFixed(2)}</p>
          </div>
        </div>

      </div>

      <h3 className="text-xl font-serif text-textMain dark:text-gray-100 mt-10 mb-4">Resumen de Entregas</h3>
      
      {/* Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Orders */}
        <div className="bg-white dark:bg-noir-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-noir-border flex items-center gap-4 dark:hover:shadow-glow-primary transition-all duration-300">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-xl text-yellow-600 dark:text-yellow-500">
            <FaShoppingBag className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pedidos Pendientes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeOrders}</p>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white dark:bg-noir-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-noir-border flex items-center gap-4 dark:hover:shadow-glow-primary transition-all duration-300">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-xl text-purple-600 dark:text-purple-400">
            <FaBoxOpen className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pedidos Entregados</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.deliveredOrders}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatsManager;
