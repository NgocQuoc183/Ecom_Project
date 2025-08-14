// src/api/productsApi.js
import axios from 'axios';

export const getNewestProducts = async (limit = 6) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/products/newest?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching newest products:", error);
    return [];
  }
};

// Lấy tất cả sản phẩm với phân trang, tìm kiếm, lọc theo danh mục
export const getAllProducts = async (page = 1, limit = 10, category = '', keyword = '', sort = '') => {
  try {
    const response = await axios.get('http://localhost:5000/api/products', {
      params: {
        page,
        limit,
        category,   // Thêm tham số category vào params
        keyword,
        sort
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    return { data: [], page: 1, limit: 10 }; // Trả về dữ liệu rỗng nếu có lỗi
  }
};