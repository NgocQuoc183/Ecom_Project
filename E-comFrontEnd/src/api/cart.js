
import axios from 'axios';

const API_URL = '/api/cart'; // URL của API giỏ hàng

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = async (userId, productId, quantity) => {
  try {
    const response = await axios.post(API_URL, {
      user_id: userId,
      product_id: productId,
      quantity: quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
  }
};

// Hàm lấy giỏ hàng của người dùng
export const getCart = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    throw new Error('Không thể lấy giỏ hàng');
  }
};

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (cartId, quantity) => {
  try {
    const response = await axios.put(`${API_URL}/${cartId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật giỏ hàng:', error);
    throw new Error('Không thể cập nhật giỏ hàng');
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
export const deleteCartItem = async (cartId) => {
  try {
    const response = await axios.delete(`${API_URL}/${cartId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
    throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
  }
};