import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // keep or change to your backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const supplierAPI = {
  getAll: (search = '', category = '') => {
    const params = {};
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;
    return api.get('/suppliers', { params });
  },

  getById: (id) => api.get(`/suppliers/${id}`),
  create: (supplierData) => api.post('/suppliers', supplierData),
  update: (id, supplierData) => api.put(`/suppliers/${id}`, supplierData),
  delete: (id) => api.delete(`/suppliers/${id}`),
  contact: (id, contactData) => api.post(`/suppliers/${id}/contact`, contactData),
};

export default api;
