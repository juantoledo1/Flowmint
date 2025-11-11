import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

// Users API
export const usersAPI = {
    getAll: async () => {
        const response = await api.get('/usuarios');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    },

    create: async (userData) => {
        const response = await api.post('/usuarios', userData);
        return response.data;
    },

    update: async (id, userData) => {
        const response = await api.patch(`/usuarios/${id}`, userData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    },
};

// Roles API
export const rolesAPI = {
    getAll: async () => {
        const response = await api.get('/roles');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    },

    create: async (roleData) => {
        const response = await api.post('/roles', roleData);
        return response.data;
    },

    update: async (id, roleData) => {
        const response = await api.patch(`/roles/${id}`, roleData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    },
};

// Clients API
export const clientsAPI = {
    getAll: async () => {
        const response = await api.get('/clientes');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/clientes/${id}`);
        return response.data;
    },

    create: async (clientData) => {
        const response = await api.post('/clientes', clientData);
        return response.data;
    },

    update: async (id, clientData) => {
        const response = await api.patch(`/clientes/${id}`, clientData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/clientes/${id}`);
        return response.data;
    },
};

// Employees API
export const employeesAPI = {
    getAll: async () => {
        const response = await api.get('/empleados');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/empleados/${id}`);
        return response.data;
    },

    create: async (employeeData) => {
        const response = await api.post('/empleados', employeeData);
        return response.data;
    },

    update: async (id, employeeData) => {
        const response = await api.patch(`/empleados/${id}`, employeeData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/empleados/${id}`);
        return response.data;
    },
};

// Services API
export const servicesAPI = {
    getAll: async () => {
        const response = await api.get('/servicios');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/servicios/${id}`);
        return response.data;
    },

    create: async (serviceData) => {
        const response = await api.post('/servicios', serviceData);
        return response.data;
    },

    update: async (id, serviceData) => {
        const response = await api.patch(`/servicios/${id}`, serviceData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/servicios/${id}`);
        return response.data;
    },
};

// Appointments API
export const appointmentsAPI = {
    getAll: async () => {
        const response = await api.get('/turnos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/turnos/${id}`);
        return response.data;
    },

    create: async (appointmentData) => {
        const response = await api.post('/turnos', appointmentData);
        return response.data;
    },

    update: async (id, appointmentData) => {
        const response = await api.patch(`/turnos/${id}`, appointmentData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/turnos/${id}`);
        return response.data;
    },
};

// Export default api instance
export default api;
