import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://medicineremainderapp-production.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────
export const register = (data) => api.post('/api/user/register', data);
export const login    = (data) => api.post('/api/user/login', data);

// ── Medicine ──────────────────────────────────────────────────────────────
// Fields: medicineName, slot, time, date, days
export const getMedicines  = ()     => api.get('/api/medicine');
export const addMedicine   = (data) => api.post('/api/medicine', data);
export const deleteMedicine = (id)  => api.delete(`/api/medicine/${id}`);

export default api;
