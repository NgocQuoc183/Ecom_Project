import axios from 'axios';

const API_URL = 'http://localhost:3001/api/admin/reviews';

// Lấy tất cả đánh giá với filter và phân trang
export const getAllReviews = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });

    const response = await axios.get(`${API_URL}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Lấy thống kê đánh giá
export const getReviewStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
};

// Lấy chi tiết một đánh giá
export const getReviewById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review by id:', error);
    throw error;
  }
};

// Xóa đánh giá
export const deleteReview = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
