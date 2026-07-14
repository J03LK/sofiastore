import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/supabase/authService';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    authService.getSession().then((session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    login: authService.login,
    logout: authService.logout,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
