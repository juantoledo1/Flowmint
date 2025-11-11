import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: 'http://localhost:4000', // URL base de tu backend
});

// Interceptor para incluir el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Incluir el token en la cabecera de autorización
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Solo eliminar el token si es un error de autenticación (401)
    // No eliminarlo en errores de autorización (403) para operaciones no permitidas
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      // Aquí podrías redirigir al login
      // history.push('/login'); // si estás usando react-router
    }
    return Promise.reject(error);
  }
);

export default api;