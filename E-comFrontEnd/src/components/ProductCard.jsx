
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa'; // Import icon giỏ hàng từ react-icons
import { addToCart } from '../api/cart';
import jwt_decode from 'jwt-decode';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Giải mã token để lấy user_id
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      userId = decodedToken.id;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
    }
  }

  // Hàm xử lý click vào card để chuyển đến trang chi tiết sản phẩm
  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const quantity = 1;

    console.log("Dữ liệu gửi đi:", { user_id: userId, product_id: product.id, quantity });

    try {
      const response = await addToCart(userId, product.id, quantity);

      console.log("Kết quả trả về từ API:", response);

      if (response.message === 'Thêm sản phẩm vào giỏ hàng thành công!' || response.message === 'Cập nhật số lượng trong giỏ hàng thành công.') {
        alert('Sản phẩm đã được thêm vào giỏ hàng');
      } else {
        alert('Lỗi khi thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      alert('Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 w-full max-w-[280px] mx-auto cursor-pointer border border-gray-100"
      onClick={handleProductClick}
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[160px] sm:h-[180px] md:h-[200px] object-contain transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/200x200?text=Ảnh+sản+phẩm";
          }}
        />
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-gray-900">
          {Number(product.price).toLocaleString()} <sup className="text-sm">đ</sup>
        </span>
        <button
          onClick={handleAddToCart}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
          title="Thêm vào giỏ hàng"
        >
          <FaShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;