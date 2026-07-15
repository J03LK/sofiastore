import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background dark:bg-noir-bg border-t border-primary/10 dark:border-noir-border mt-20 py-12 text-textMain dark:text-noir-text transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <img src="/icon.png" alt="Icono" className="h-10 w-auto mix-blend-multiply dark:mix-blend-normal dark:invert dark:opacity-80" />
            <span className="font-logo font-bold text-5xl text-primary mt-1">Sofia Store</span>
          </div>
          <p className="text-textMuted dark:text-noir-muted text-sm mt-2 font-light tracking-wide">Elegancia y estilo en cada prenda.</p>
        </div>
        <div className="flex space-x-8 text-sm font-medium tracking-wide">
          <Link to="/" className="hover:text-primary transition-colors duration-300">Inicio</Link>
        </div>
      </div>
      <div className="text-center text-xs text-textMuted dark:text-noir-muted mt-12 font-light tracking-wider">
        &copy; {new Date().getFullYear()} SOFIA STORE. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
