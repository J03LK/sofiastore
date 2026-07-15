import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="w-full">
      {/* Intro Animation Sequence */}
      <motion.div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, display: 'none' }}
        transition={{ delay: 2, duration: 1, ease: "easeInOut" }}
      >
        <motion.div 
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img src="/icon.png" alt="Icono" className="w-32 md:w-48 mix-blend-multiply drop-shadow-sm dark:mix-blend-normal dark:invert dark:opacity-80" />
          <h1 className="text-7xl md:text-9xl font-logo font-bold text-primary drop-shadow-sm">
            Sofia Store
          </h1>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="pt-20"
      >
        {/* Hero Section - Split Layout */}
        <section className="relative min-h-[80vh] flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 gap-12">
          <motion.div 
            className="flex-1 text-center lg:text-left z-10"
            initial="hidden" animate="visible" variants={fadeInUp}
          >
            <h2 className="text-5xl lg:text-7xl font-serif font-semibold text-textMain leading-tight mb-6">
              Elegancia en <br/><span className="text-primary italic font-light">cada detalle</span>
            </h2>
            <p className="text-lg text-textMuted mb-10 max-w-lg mx-auto lg:mx-0 font-light tracking-wide">
              Descubre nuestra exclusiva colección. Prendas únicas seleccionadas para realzar tu estilo de forma sostenible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to="/catalog" 
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-medium tracking-wide transition-all duration-300 shadow-soft hover:shadow-hover flex items-center gap-2"
              >
                Explorar Colección <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1 w-full relative"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5, duration: 1 }}
          >
            <div className="aspect-[4/5] w-full max-w-md mx-auto relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
                alt="Fashion Model" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </section>

        {/* Categorías */}
        <section className="py-24 bg-primary-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="text-center mb-16"
            >
              <h3 className="text-3xl font-serif text-textMain mb-4">Colecciones</h3>
              <div className="w-16 h-px bg-primary mx-auto"></div>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {['Vestidos', 'Blusas', 'Pantalones', 'Accesorios'].map((cat, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                   className="group cursor-pointer"
                 >
                    <div className="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                      <img 
                        src={`https://images.unsplash.com/photo-${1515378960528 + i}?w=400&auto=format&fit=crop`} 
                        alt={cat} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <span className="font-serif text-lg text-textMain group-hover:text-primary transition-colors">{cat}</span>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* Nuevos Ingresos (Placeholder) */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
              className="flex justify-between items-end mb-12"
            >
              <div>
                <h3 className="text-3xl font-serif text-textMain mb-4">Recién Llegados</h3>
                <div className="w-16 h-px bg-primary"></div>
              </div>
              <Link to="/catalog?filter=new" className="text-sm font-medium tracking-wide text-textMuted hover:text-primary transition-colors uppercase flex items-center gap-2">
                Ver todo <FaArrowRight />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {[1,2,3,4].map(i => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden relative mb-4">
                    <img 
                      src={`https://images.unsplash.com/photo-${1434389672724 + i}?w=400&auto=format&fit=crop`} 
                      alt={`Prenda ${i}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-wide rounded-sm shadow-sm">
                      NUEVO
                    </div>
                  </div>
                  <h4 className="font-medium text-textMain tracking-wide group-hover:text-primary transition-colors">Elegante Prenda {i}</h4>
                  <p className="text-textMuted text-sm mt-1">$45.00</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Home;
