import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaTrash, FaPlus, FaCheckCircle, FaUserPlus, FaWallet, FaWhatsapp, FaTiktok, FaSignOutAlt } from 'react-icons/fa';
import { 
  createOrder, 
  uploadOrderImage, 
  getClientByWhatsapp, 
  createClient,
  getClientOrders
} from '../../services/supabase/orderService';

const OrderClient = () => {
  // Client state
  const [whatsapp, setWhatsapp] = useState('');
  const [tiktokName, setTiktokName] = useState('');
  const [clientData, setClientData] = useState(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Client Debt state
  const [clientTotals, setClientTotals] = useState({ totalAmount: 0, totalPaid: 0, currentDebt: 0 });
  const [clientOrders, setClientOrders] = useState([]);

  // Order state
  const [items, setItems] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentPrice, setCurrentPrice] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ---------- Effects ----------
  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // ---------- Authentication Handlers ----------

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!whatsapp.trim()) return;

    setIsAuthenticating(true);
    setAuthError('');
    setIsRegistering(false);

    try {
      const client = await getClientByWhatsapp(whatsapp.trim());
      
      if (client) {
        setClientData(client);
        setIsAuthenticated(true);
        fetchClientTotals(whatsapp.trim());
      } else {
        setAuthError('Número no encontrado. Por favor, ingresa tu usuario de TikTok para registrarte.');
        setIsRegistering(true);
      }
    } catch (error) {
      setAuthError('Error al verificar el número');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRegister = async () => {
    if (!whatsapp.trim() || !tiktokName.trim()) {
      setAuthError('Por favor llena ambos campos.');
      return;
    }

    setIsAuthenticating(true);
    setAuthError('');

    try {
      const newClient = await createClient(whatsapp.trim(), tiktokName.trim());
      setClientData(newClient);
      setIsAuthenticated(true);
      setIsRegistering(false);
      setClientTotals({ totalAmount: 0, totalPaid: 0, currentDebt: 0 });
    } catch (error) {
      setAuthError('Error al registrar, tal vez el número ya existe.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setWhatsapp('');
    setTiktokName('');
    setClientData(null);
    setItems([]);
    setAuthError('');
    setIsRegistering(false);
    setIsSuccess(false);
    setClientTotals({ totalAmount: 0, totalPaid: 0, currentDebt: 0 });
    setClientOrders([]);
  };

  // ---------- Debt Handlers ----------
  
  const fetchClientTotals = async (wpNumber) => {
    try {
      const orders = await getClientOrders(wpNumber);
      let totalAmount = 0;
      let totalPaid = 0;
      
      orders.forEach(order => {
        totalAmount += Number(order.total_amount || 0);
        totalPaid += Number(order.paid_amount || 0);
      });

      setClientOrders(orders);
      
      setClientTotals({
        totalAmount,
        totalPaid,
        currentDebt: Math.max(0, totalAmount - totalPaid)
      });
    } catch (error) {
      console.error("Error fetching totals", error);
    }
  };

  // ---------- Order Handlers ----------

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!currentFile || !currentPrice) return;

    const newItem = {
      id: Date.now(),
      file: currentFile,
      previewUrl: previewUrl,
      price: parseFloat(currentPrice)
    };

    setItems([...items, newItem]);
    setCurrentFile(null);
    setCurrentPrice('');
    setPreviewUrl(null);
  };

  const handleRemoveItem = (idToRemove) => {
    setItems(items.filter(item => item.id !== idToRemove));
  };

  const currentOrderTotal = items.reduce((sum, item) => sum + item.price, 0);

  const handleSubmitOrder = async () => {
    if (!whatsapp.trim() || items.length === 0) return;

    setIsSubmitting(true);
    try {
      // 1. Upload all images
      const uploadedItems = await Promise.all(
        items.map(async (item) => {
          const imageUrl = await uploadOrderImage(item.file);
          return {
            price: item.price,
            imageUrl: imageUrl
          };
        })
      );

      // 2. Create the order using whatsapp as the client identifier
      await createOrder(whatsapp.trim(), uploadedItems, currentOrderTotal);
      
      fetchClientTotals(whatsapp.trim());
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Hubo un error al enviar el pedido. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setItems([]);
    setIsSuccess(false);
  };

  // ---------- Render Views ----------

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-soft text-center max-w-md w-full border border-primary/10"
        >
          <FaCheckCircle className="text-success text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-textMain mb-2">¡Pedido Enviado!</h2>
          <p className="text-textMuted mb-6">Hemos recibido tu pedido correctamente.</p>
          <button
            onClick={resetForm}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-medium transition-colors"
          >
            Hacer otro pedido
          </button>
        </motion.div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-noir-bg transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-3 animate-pulse">
            <img src="/icon.png" alt="Icono" className="h-16 w-auto mix-blend-multiply dark:mix-blend-normal dark:invert dark:opacity-80" />
            <span className="font-logo font-bold text-5xl text-primary mt-1">Sofia Store</span>
          </div>
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 transition-colors duration-300">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-noir-surface p-8 rounded-3xl shadow-lg max-w-md w-full border border-gray-100 dark:border-noir-border"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/icon.png" alt="Icono" className="h-12 w-auto mix-blend-multiply dark:mix-blend-normal dark:invert dark:opacity-80" />
              <span className="font-logo font-bold text-4xl text-primary mt-1">Sofia Store</span>
            </div>
            <h1 className="text-3xl font-serif text-textMain dark:text-gray-100 mb-2">Bienvenida</h1>
            <p className="text-textMuted dark:text-gray-400">Ingresa tu número de WhatsApp para continuar y separar tus prendas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-textMain dark:text-gray-300 mb-2">
                Número de WhatsApp
              </label>
              <div className="relative">
                <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ej: 0991234567"
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                  required
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                {authError}
              </div>
            )}

            {isRegistering && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-sm font-medium text-textMain dark:text-gray-300 mb-2">
                  Usuario de TikTok
                </label>
                <div className="relative">
                  <FaTiktok className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={tiktokName}
                    onChange={(e) => setTiktokName(e.target.value)}
                    placeholder="Ej: @maria123"
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-noir-bg rounded-xl border border-gray-200 dark:border-noir-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                  />
                </div>
              </motion.div>
            )}

            {!isRegistering ? (
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isAuthenticating ? 'Verificando...' : 'Entrar'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegister}
                disabled={isAuthenticating}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-medium transition-all shadow-hover hover:shadow-glow-primary dark:shadow-glow-primary disabled:opacity-50 flex justify-center items-center gap-2"
              >
                <FaUserPlus /> {isAuthenticating ? 'Registrando...' : 'Registrarme'}
              </button>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 transition-colors duration-300">
      <div className="text-center mb-6 relative">
        <h1 className="text-3xl font-serif text-noir-main dark:text-noir-text mb-2">Crear Pedido</h1>
        <p className="text-noir-muted dark:text-noir-text/60">Hola, <span className="font-semibold text-primary">{clientData?.tiktok_name}</span> <span className="text-xs">({whatsapp})</span>. Ingresa las prendas que deseas separar.</p>
        
        <button 
          onClick={handleLogout}
          className="absolute right-0 top-0 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
        >
          <FaSignOutAlt /> Salir
        </button>
      </div>

      {/* Debt Banner */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 p-8 rounded-3xl border border-primary/20 dark:border-primary/30 mb-10 shadow-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl opacity-60"></div>
        
        <h3 className="text-xl font-serif text-primary mb-6 flex items-center gap-3 relative z-10">
          <FaWallet className="text-2xl" /> Resumen de tu Cuenta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-white/80 backdrop-blur-md dark:bg-noir-surface/90 p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white dark:border-noir-border/50 transition-transform hover:-translate-y-1 duration-300">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total de Compras</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">${clientTotals.totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md dark:bg-noir-surface/90 p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white dark:border-noir-border/50 transition-transform hover:-translate-y-1 duration-300">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Abonado</p>
            <p className="text-3xl font-bold text-success">${clientTotals.totalPaid.toFixed(2)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md dark:bg-noir-surface/90 p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white dark:border-error/20 relative overflow-hidden transition-transform hover:-translate-y-1 duration-300 group">
            <div className="absolute inset-0 bg-error/5 group-hover:bg-error/10 transition-colors"></div>
            <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
            <p className="text-xs font-semibold text-error/80 uppercase tracking-wider mb-2 relative z-10">Deuda Actual</p>
            <p className="text-3xl font-bold text-error relative z-10">${clientTotals.currentDebt.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Separated Items / Past Orders */}
      {clientOrders.length > 0 && clientOrders.some(o => o.order_items?.length > 0) && (
        <div className="bg-white dark:bg-noir-surface p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-noir-border mb-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif text-gray-900 dark:text-gray-100">Tus Prendas Separadas</h3>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium px-4 py-1.5 rounded-full">
              {clientOrders.reduce((acc, order) => acc + (order.order_items?.length || 0), 0)} prendas
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {clientOrders.flatMap(order => 
              (order.order_items || []).map(item => (
                <div key={item.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col hover:-translate-y-1">
                  
                  {/* Image Container with white background so transparent PNGs look good */}
                  <div className="aspect-[4/5] bg-white relative overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={item.image_url}
                      alt="Prenda separada"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-800 dark:text-gray-200 shadow-sm backdrop-blur-sm border border-gray-100 dark:border-gray-700 uppercase tracking-wider">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-4 flex flex-col justify-between flex-1 bg-gray-50/50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-center mb-3">
                      <span className="text-xs text-gray-400 block mb-1">Precio acordado</span>
                      <span className="font-bold text-2xl text-primary">${Number(item.price).toFixed(2)}</span>
                    </div>
                    
                    {item.comment && (
                      <div className="mt-auto relative">
                        <div className="absolute -top-2 left-4 w-3 h-3 bg-primary/10 rotate-45"></div>
                        <div className="bg-primary/10 dark:bg-primary/20 text-primary-hover dark:text-primary text-xs p-3 rounded-xl rounded-tl-sm italic border border-primary/20 leading-relaxed shadow-sm">
                          "{item.comment}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Add Item Form */}
        <div className="bg-white dark:bg-noir-surface p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-noir-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none"></div>
          
          <h3 className="text-2xl font-serif text-gray-900 dark:text-gray-100 mb-6">Agregar Nueva Prenda</h3>
          <form onSubmit={handleAddItem} className="space-y-6 relative z-10">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Captura de la prenda
              </label>
              <div className="relative border-2 border-dashed border-primary/30 dark:border-primary/50 bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 text-center hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="image-upload"
                />
                {previewUrl ? (
                  <div className="relative h-48 w-full flex justify-center">
                    <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-xl shadow-sm bg-white p-2" />
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center">
                    <div className="w-16 h-16 mb-4 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaUpload className="text-primary text-2xl" />
                    </div>
                    <span className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Haz clic para subir una captura</span>
                    <span className="text-sm text-gray-500">Soporta JPG, PNG</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Precio Acordado ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-lg font-medium">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white dark:focus:bg-gray-800 transition-all dark:text-white text-lg font-medium"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={!currentFile || !currentPrice}
                  className="w-full h-[58px] bg-gray-900 dark:bg-primary hover:bg-black dark:hover:bg-primary-hover text-white rounded-xl font-bold text-lg transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  <FaPlus /> Añadir a la lista
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Order Items List */}
        {items.length > 0 && (
          <div className="bg-white dark:bg-noir-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-noir-border">
            <h3 className="text-lg font-medium text-noir-main dark:text-noir-text mb-4">Resumen de este nuevo pedido</h3>
            
            <div className="space-y-3 mb-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between p-3 border border-gray-100 dark:border-noir-border rounded-xl bg-gray-50 dark:bg-noir-bg"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.previewUrl} alt="Item" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                      <span className="font-medium text-noir-main dark:text-noir-text">${item.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                      title="Eliminar prenda"
                    >
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 dark:border-noir-border pt-4 mb-6">
              <span className="text-noir-muted">Subtotal de este pedido:</span>
              <span className="text-2xl font-semibold text-primary">${currentOrderTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium text-lg transition-all shadow-hover hover:shadow-glow-primary dark:shadow-glow-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Pedido'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderClient;
