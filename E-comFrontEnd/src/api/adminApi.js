// src/api/adminApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/admin', // Adjust if your backend is on a different port, e.g., 'http://localhost:5000/api'
  headers: {
    'Content-Type': 'application/json',
  },
  // If auth is needed: api.interceptors.request.use(config => { config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`; return config; });
});

// Categories
export const getAllCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Products
export const getAllProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Orders
export const getAllOrders = () => api.get('/orders');
export const getOrderDetails = (id) => api.get(`/orders/${id}`);
// export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status });

export default api;