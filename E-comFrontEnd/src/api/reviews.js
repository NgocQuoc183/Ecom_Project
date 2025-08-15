import axios from 'axios';

const API_URL = 'http://localhost:3001/api/reviews';

// Lấy danh sách đánh giá của sản phẩm
export const getProductReviews = async (productId, page = 1, limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
};

// Lấy thống kê đánh giá của sản phẩm
export const getProductReviewStats = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
};

// Thêm đánh giá mới
export const addReview = async (reviewData) => {
  try {
    console.log('API: Sending review data:', reviewData);

    const response = await axios.post(API_URL, reviewData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('API: Review response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};
