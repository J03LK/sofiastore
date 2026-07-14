import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl text-textMain mb-8">Página no encontrada</h2>
      <Link to="/" className="bg-button hover:bg-button-hover text-white px-6 py-2 rounded-full transition-colors">
        Volver al Inicio
      </Link>
    </div>
  );
};
export default NotFound;
