import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const isAvailable = product.status === 'available';
  const isSeparated = product.status === 'separated';
  const isSold = product.status === 'sold';

  // Status Badge Configuration
  const getStatusBadge = () => {
    if (isSeparated) return <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-textMain border border-gray-200 text-xs font-medium px-3 py-1 tracking-wider uppercase z-10 shadow-sm">Separado</span>;
    if (isSold) return <span className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 tracking-wider uppercase z-10 shadow-sm">Vendido</span>;
    if (product.new) return <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary border border-primary/20 text-xs font-medium px-3 py-1 tracking-wider uppercase z-10 shadow-sm">Nuevo</span>;
    if (product.sale) return <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 tracking-wider uppercase z-10 shadow-sm">Oferta</span>;
    return null;
  };

  const handleWhatsApp = (e) => {
    e.preventDefault();
    if (!isAvailable) return;
    
    const message = `Hola SOFIA STORE 👋\n\nQuiero separar esta prenda.\n\nNombre:\n${product.name}\n\nPrecio:\n$${product.price}\n\nCódigo:\n${product.code}\n\nEnlace:\n${window.location.origin}/product/${product.id}\n\nMi nombre es:\n\nQuedo atento.`;
    
    const waNumber = '593979268641'; 
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-background rounded-xl overflow-hidden shadow-soft hover:shadow-hover relative group flex flex-col h-full border border-primary/5 transition-shadow"
    >
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50 block">
        {getStatusBadge()}
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1434389672724-14c3616238b2?w=400&auto=format&fit=crop'} 
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif font-medium text-textMain text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="font-medium text-textMain text-lg ml-2 whitespace-nowrap">
            ${product.price}
          </span>
        </div>
        
        <div className="text-xs text-textMuted mb-6 flex gap-2 flex-wrap font-light tracking-wide uppercase">
          {product.size && <span>Talla {product.size}</span>}
          {product.size && product.category && <span>•</span>}
          {product.category && <span>{product.category}</span>}
        </div>

        <div className="mt-auto">
          <button
            onClick={handleWhatsApp}
            disabled={!isAvailable}
            className={`w-full py-3 rounded-none border flex justify-center items-center gap-2 font-medium tracking-wide text-sm transition-all duration-300 ${
              isAvailable 
                ? 'border-primary text-primary hover:bg-primary hover:text-white' 
                : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <FaWhatsapp size={16} />
            {isAvailable ? 'SEPARAR POR WHATSAPP' : 'NO DISPONIBLE'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
