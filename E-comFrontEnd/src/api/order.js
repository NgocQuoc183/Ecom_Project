

import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Full URL đến backend

// Tạo đơn hàng
export const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
  }
  try {
    console.log('Sending createOrder to:', `${API_URL}/orders`); // Debug URL
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Create order error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lỗi khi tạo đơn hàng.');
  }
};

// Lấy danh sách đơn hàng theo userId
export const getOrdersByUser = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
  }
  try {
    console.log('Sending getOrdersByUser to:', `${API_URL}/orders/user/${userId}`); // Debug URL
    const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Get orders error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch sử đơn hàng.');
  }
};

// Lấy chi tiết đơn hàng theo orderId
export const getOrderDetails = async (orderId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
  }
  try {
    console.log('Sending getOrderDetails to:', `${API_URL}/orders/${orderId}`); // Debug URL
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Get order details error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy chi tiết đơn hàng.');
  }
};