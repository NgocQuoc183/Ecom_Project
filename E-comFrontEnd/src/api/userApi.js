import axios from 'axios';
import jwt_decode from 'jwt-decode';

const API_URL = 'http://localhost:5000/api/user';

// Hàm helper để lấy token và kiểm tra
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Hàm lấy thông tin user từ token đã giải mã
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    return jwt_decode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Các hàm API
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/user/${userId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/${userId}`,
      userData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const changePassword = async (userId, passwordData) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/change-password/${userId}`,
      passwordData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};