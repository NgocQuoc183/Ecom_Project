// src/api/adminApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/admin', // Sử dụng URL tương đối để proxy hoạt động
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

// Dashboard Stats
export const getDashboardStats = () => api.get('/categories/dashboard/stats');

// Users
export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const toggleUserStatus = (id, status) => api.patch(`/users/${id}/status`, { status });
export const getUserStats = () => api.get('/users/stats');

export default api;