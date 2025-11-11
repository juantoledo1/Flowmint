import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (token && isLoggedIn) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    // Verificar autenticación al cargar
    checkAuth();

    // Escuchar cambios en el almacenamiento local
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    // Limpiar cualquier otro dato sensible
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout
  };
};