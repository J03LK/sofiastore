import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaArrowLeft } from 'react-icons/fa';
import { productService } from '../../services/supabase/productService';

const Product = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Producto no encontrado:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 min-h-[60vh] flex justify-center items-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center min-h-[60vh]">
        <h2 className="text-3xl font-serif text-textMain mb-6">Colección no encontrada</h2>
        <Link to="/catalog" className="text-primary hover:text-primary-hover underline underline-offset-4 tracking-wide">Volver al catálogo</Link>
      </div>
    );
  }

  const isAvailable = product.status === 'available';
  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1434389672724-14c3616238b2?w=800&auto=format&fit=crop'];

  const handleWhatsApp = () => {
    if (!isAvailable) return;
    const message = `Hola SOFIA STORE 👋\n\nQuiero separar esta prenda.\n\nNombre:\n${product.name}\n\nPrecio:\n$${product.price}\n\nCódigo:\n${product.code || 'S/C'}\n\nEnlace:\n${window.location.origin}/product/${product.id}\n\nMi nombre es:\n\nQuedo atento.`;
    const waUrl = `https://wa.me/593979268641?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link to="/catalog" className="inline-flex items-center text-sm font-medium tracking-wide text-textMuted hover:text-primary mb-12 transition-colors uppercase">
        <FaArrowLeft className="mr-3" /> Volver a Colecciones
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Galería de Imágenes */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full aspect-[4/5] bg-gray-50 overflow-hidden cursor-zoom-in"
          >
            <img 
              src={images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 aspect-[4/5] flex-shrink-0 overflow-hidden transition-all duration-300 ${
                    activeImage === idx ? 'ring-1 ring-primary ring-offset-2 opacity-100' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalles del Producto */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col pt-4 lg:pt-10"
        >
          {/* Etiquetas */}
          <div className="flex gap-3 mb-6">
            {product.new && <span className="bg-white border border-primary/20 text-primary px-3 py-1 text-xs font-medium tracking-wider uppercase">Nuevo</span>}
            {!isAvailable && <span className="bg-gray-100 text-gray-500 px-3 py-1 text-xs font-medium tracking-wider uppercase border border-gray-200">No Disponible</span>}
          </div>

          <h1 className="text-4xl lg:text-5xl font-serif font-medium text-textMain mb-4 leading-tight">{product.name}</h1>
          <p className="text-xl text-textMain mb-10">${product.price}</p>
          
          <div className="w-full h-px bg-gray-200 mb-10"></div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10">
            <div>
              <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Código</p>
              <p className="font-medium text-textMain">{product.code || 'S/C'}</p>
            </div>
            <div>
              <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Talla</p>
              <p className="font-medium text-textMain">{product.size || 'Única'}</p>
            </div>
            <div>
              <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Color</p>
              <p className="font-medium text-textMain">{product.color || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Categoría</p>
              <p className="font-medium text-textMain">{product.category}</p>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xs text-textMuted uppercase tracking-wider mb-3">Descripción</h3>
            <p className="text-textMain font-light leading-relaxed whitespace-pre-wrap tracking-wide">{product.description || 'Una prenda única que resalta por su diseño y comodidad.'}</p>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleWhatsApp}
              disabled={!isAvailable}
              className={`w-full py-4 flex justify-center items-center gap-3 tracking-wide text-sm uppercase transition-all duration-300 ${
                isAvailable 
                  ? 'bg-primary text-white hover:bg-primary-hover shadow-soft hover:shadow-hover' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              <FaWhatsapp size={18} />
              {isAvailable ? 'Separar Prenda' : 'Prenda no disponible'}
            </button>
            {isAvailable && (
              <p className="text-center text-xs text-textMuted mt-4 tracking-wide">
                Serás redirigido a WhatsApp para finalizar la separación.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Product;
