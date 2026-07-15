import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrders, updateOrderStatus, addPaymentToOrder, deleteOrder } from '../../services/supabase/orderService';
import { FaSearch, FaEye, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  canceled: 'bg-red-100 text-red-800 border-red-200'
};

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  delivered: 'Entregado',
  canceled: 'Cancelado'
};

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Payment state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      alert("Error al actualizar el estado");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const isConfirmed = window.confirm("¿Estás segura de que quieres eliminar este pedido de forma permanente?");
    if (!isConfirmed) return;

    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      alert("Error al eliminar el pedido.");
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) return;
    
    setIsSubmittingPayment(true);
    try {
      const updatedOrder = await addPaymentToOrder(selectedOrder.id, selectedOrder.paid_amount || 0, paymentAmount);
      
      // Update local state
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, paid_amount: updatedOrder.paid_amount } : o));
      setSelectedOrder({ ...selectedOrder, paid_amount: updatedOrder.paid_amount });
      setPaymentAmount('');
    } catch (error) {
      console.error(error);
      alert("Error al registrar el abono: " + (error.message || error.details || "Error desconocido"));
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por número de WhatsApp o identificador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-noir-border dark:bg-noir-bg rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium dark:text-white"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-noir-surface rounded-2xl shadow-sm border border-gray-100 dark:border-noir-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-textMain dark:text-gray-200">
            <thead className="text-xs text-textMuted dark:text-gray-400 uppercase bg-gray-50/50 dark:bg-noir-bg border-b border-gray-100 dark:border-noir-border">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">WhatsApp Clienta</th>
                <th className="px-6 py-4 font-medium tracking-wider">Fecha</th>
                <th className="px-6 py-4 font-medium tracking-wider">Total</th>
                <th className="px-6 py-4 font-medium tracking-wider">Deuda</th>
                <th className="px-6 py-4 font-medium tracking-wider">Estado</th>
                <th className="px-6 py-4 font-medium tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-noir-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Cargando pedidos...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const debt = Math.max(0, Number(order.total_amount) - Number(order.paid_amount || 0));
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-noir-bg transition-colors">
                      <td className="px-6 py-4 font-medium">{order.client_name}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">${Number(order.total_amount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${debt > 0 ? 'text-error' : 'text-success'}`}>
                          ${debt.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-primary hover:text-primary-hover p-2 hover:bg-primary/5 dark:hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center gap-1"
                            title="Ver detalles"
                          >
                            <FaEye /> <span className="hidden sm:inline">Ver</span>
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex items-center"
                            title="Eliminar pedido"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-noir-surface rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col"
          >
            <div className="sticky top-0 bg-white/90 dark:bg-noir-surface/90 backdrop-blur border-b border-gray-100 dark:border-noir-border p-6 flex justify-between items-center z-10">
              <div>
                <h3 className="text-xl font-serif dark:text-gray-100">Pedido de {selectedOrder.client_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              
              {/* Payment Section */}
              <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/10 dark:border-primary/20">
                <h4 className="font-medium text-primary mb-4 flex items-center gap-2">Gestión de Abonos</h4>
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                  
                  {/* Stats */}
                  <div className="flex gap-6 w-full md:w-auto">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total del Pedido</p>
                      <p className="font-semibold text-lg dark:text-gray-100">${Number(selectedOrder.total_amount).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Abonado</p>
                      <p className="font-semibold text-lg text-success">${Number(selectedOrder.paid_amount || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Deuda</p>
                      <p className="font-semibold text-lg text-error">
                        ${Math.max(0, Number(selectedOrder.total_amount) - Number(selectedOrder.paid_amount || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Add Payment Form */}
                  <form onSubmit={handleAddPayment} className="flex gap-2 w-full md:w-auto">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Monto a abonar"
                      className="w-full md:w-32 px-3 py-2 bg-white dark:bg-noir-bg border border-gray-300 dark:border-noir-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingPayment}
                      className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaPlus /> {isSubmittingPayment ? '...' : 'Abonar'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Status Manager */}
              <div className="p-4 bg-gray-50 dark:bg-noir-bg rounded-xl border border-gray-100 dark:border-noir-border flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Estado del pedido:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="px-4 py-2 border border-gray-200 dark:border-noir-border rounded-lg focus:ring-2 focus:ring-primary/20 bg-white dark:bg-noir-surface dark:text-white"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="delivered">Entregado</option>
                    <option value="canceled">Cancelado</option>
                  </select>
                </div>
                
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                  <FaTrash /> Eliminar permanentemente
                </button>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium text-lg mb-4 dark:text-gray-100">Prendas ({selectedOrder.order_items?.length || 0})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrder.order_items?.map((item) => (
                    <OrderItemEditor 
                      key={item.id} 
                      item={item} 
                      orderId={selectedOrder.id}
                      onItemUpdated={(updatedOrder) => {
                        setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
                        setSelectedOrder(updatedOrder);
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const OrderItemEditor = ({ item, orderId, onItemUpdated }) => {
  const [price, setPrice] = useState(item.price);
  const [comment, setComment] = useState(item.comment || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { updateOrderItem } = await import('../../services/supabase/orderService');
      const updatedOrder = await updateOrderItem(item.id, orderId, price, comment);
      setIsEditing(false);
      onItemUpdated(updatedOrder);
    } catch (error) {
      alert("Error al actualizar la prenda");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <div className="w-1/3 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
        <a href={item.image_url} target="_blank" rel="noopener noreferrer">
          <img src={item.image_url} alt="Prenda" className="w-full h-full object-cover min-h-[120px]" />
        </a>
      </div>
      <div className="p-4 flex flex-col justify-center flex-1 space-y-3">
        {isEditing ? (
          <>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Precio ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-primary dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Comentario (opcional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Ej: Te lo dejo a 50ctvs..."
                className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-primary resize-none dark:text-white"
              />
            </div>
            <div className="flex gap-2 justify-end mt-1">
              <button 
                onClick={() => setIsEditing(false)} 
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="text-xs bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded"
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <span className="font-semibold text-lg dark:text-gray-100">${Number(item.price).toFixed(2)}</span>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-xs text-primary hover:underline"
              >
                Editar
              </button>
            </div>
            {item.comment ? (
              <div className="bg-primary/5 dark:bg-primary/10 p-2 rounded text-sm text-gray-600 dark:text-gray-300 italic border-l-2 border-primary">
                "{item.comment}"
              </div>
            ) : (
              <div className="text-xs text-gray-400 italic">Sin comentarios</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderManager;

