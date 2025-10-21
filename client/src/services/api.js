import axios from 'axios';

// Use relative URL in production, localhost in development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

// Set base URL
axios.defaults.baseURL = API_BASE_URL;

// Certificate API
export const certificateAPI = {
  getAll: () => axios.get('/certificates'),
  getMy: () => axios.get('/certificates/my'),
  getById: (id) => axios.get(`/certificates/${id}`),
  create: (data) => axios.post('/certificates', data),
  download: (id) => axios.get(`/certificates/${id}/download`, { responseType: 'blob' }),
  revoke: (id) => axios.delete(`/certificates/${id}`),
  resendEmail: (id) => axios.post(`/certificates/${id}/resend-email`)
};

// Template API
export const templateAPI = {
  getAll: () => axios.get('/templates'),
  getById: (id) => axios.get(`/templates/${id}`),
  create: (data) => axios.post('/templates', data),
  update: (id, data) => axios.put(`/templates/${id}`, data),
  delete: (id) => axios.delete(`/templates/${id}`)
};

// Analytics API
export const analyticsAPI = {
  getStats: () => axios.get('/analytics/stats'),
  getUserStats: () => axios.get('/analytics/user-stats')
};

export default axios;
