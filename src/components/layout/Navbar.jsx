import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaBars, FaTimes, FaUserLock } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/catalog' },
    { name: 'Nuevos', path: '/catalog?filter=new' },
    { name: 'Contacto', path: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full glass z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3">
            <motion.img 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src="/icon.png" 
              alt="Icono" 
              className="h-10 w-auto mix-blend-multiply"
            />
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-logo font-bold text-5xl text-primary mt-1"
            >
              Sofia Store
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6 text-textMain font-medium">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="hover:text-primary transition-colors duration-200">
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-textMuted hover:text-primary transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-textMuted hover:text-primary transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-textMuted hover:text-primary transition-colors">
                <FaTiktok size={20} />
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <a href="https://wa.me/593979268641" target="_blank" rel="noreferrer" className="bg-success text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-600 transition-colors shadow-sm">
                <FaWhatsapp /> <span>WhatsApp</span>
              </a>
              <Link to="/login" className="text-textMuted hover:text-primary" title="Login Administrador">
                <FaUserLock size={20} />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-textMain focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-textMain hover:text-primary hover:bg-secondary rounded-md"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex space-x-4 px-3 py-2 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-textMuted hover:text-primary"><FaFacebook size={24} /></a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-textMuted hover:text-primary"><FaInstagram size={24} /></a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-textMuted hover:text-primary"><FaTiktok size={24} /></a>
              </div>
              <div className="px-3 py-2 flex justify-between items-center">
                 <a href="https://wa.me/593979268641" target="_blank" rel="noreferrer" className="bg-success text-white px-4 py-2 rounded-full flex items-center gap-2 w-full justify-center">
                  <FaWhatsapp /> <span>WhatsApp</span>
                </a>
              </div>
              <div className="px-3 py-2 text-center">
                 <Link to="/login" onClick={() => setIsOpen(false)} className="text-textMuted hover:text-primary flex items-center justify-center gap-2">
                   <FaUserLock /> <span>Admin Login</span>
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
