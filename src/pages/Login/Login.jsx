import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch {
      setErrorMsg('Credenciales incorrectas o error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary tracking-widest mb-2">SOFIASTORE</h1>
          <p className="text-textMuted font-medium">Panel de Administración</p>
        </div>

        {errorMsg && (
          <div className="bg-error/10 text-error p-3 rounded-lg mb-6 text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textMain mb-1">Correo Electrónico</label>
            <input 
              {...register('email')}
              type="email" 
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${errors.email ? 'border-error bg-error/5 focus:border-error' : 'border-gray-200 focus:border-primary bg-background'}`}
              placeholder="admin@sofiastore.com"
            />
            {errors.email && <span className="text-error text-xs mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-1">Contraseña</label>
            <input 
              {...register('password')}
              type="password" 
              className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors ${errors.password ? 'border-error bg-error/5 focus:border-error' : 'border-gray-200 focus:border-primary bg-background'}`}
              placeholder="••••••••"
            />
            {errors.password && <span className="text-error text-xs mt-1 block">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-button hover:bg-button-hover text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-70 flex justify-center"
          >
            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
