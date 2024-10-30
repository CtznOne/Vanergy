import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string) => 
    api.post('/auth/register', { email, password })
};

export const panels = {
  getAll: () => api.get('/panels')
};

export const mppts = {
  getAll: () => api.get('/mppts')
};

export const inverters = {
  getAll: () => api.get('/inverters')
};

export default api;