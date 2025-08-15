
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm để navigate
import { getCart, updateCartItem, deleteCartItem } from '../api/cart';
import { FaTrash } from 'react-icons/fa'; // Thêm icon thùng rác từ react-icons
import jwtDecode from 'jwt-decode'; // Import thư viện decode JWT

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Khởi tạo userId là null
  const navigate = useNavigate();
  

  // Hàm lấy dữ liệu giỏ hàng
  const fetchCart = async () => {
    if (!userId) return; // Nếu chưa có userId, không gọi API
    setLoading(true);
    try {
      const data = await getCart(userId);
      setCartItems(data.cart || []);
    } catch {
      setError('Không thể tải giỏ hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy token từ localStorage và decode để lấy userId khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Giả sử key lưu token là 'token'
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode token
        setUserId(decoded.userId || decoded.id || decoded.sub); // Lấy userId từ decoded (tùy theo cấu trúc token, có thể là userId, id, hoặc sub)
        // Ví dụ: Nếu token có cấu trúc { sub: 123, name: 'User' }, thì dùng decoded.sub
      } catch (err) {
        console.error('Lỗi decode token:', err);
        setError('Token không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token'); // Xóa token lỗi nếu cần
      }
    } else {
      setError('Bạn cần đăng nhập để xem giỏ hàng.');
      // Có thể redirect đến trang login: window.location.href = '/login';
    }
  }, []); // Chỉ chạy một lần khi mount

  // Gọi fetchCart khi userId thay đổi (sau khi decode thành công)
  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // Hàm xử lý cập nhật số lượng
  const handleUpdateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return; // Ngăn số lượng < 1
    try {
      await updateCartItem(cartId, quantity);
      fetchCart(); // Làm mới giỏ hàng
    } catch (error) {
      setError('Lỗi khi cập nhật số lượng: ' + error.message);
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleDeleteItem = async (cartId) => {
    try {
      await deleteCartItem(cartId);
      fetchCart(); // Làm mới giỏ hàng
    } catch (error) {
      setError('Lỗi khi xóa sản phẩm: ' + error.message);
    }
  };

  // Tính tổng giá trị giỏ hàng
  const totalCartPrice = cartItems.reduce((total, item) => {
    const itemTotal = parseFloat(item.total_price) || 0;
    console.log('Cart item:', item.product_name, 'Total price:', item.total_price, 'Parsed:', itemTotal);
    return total + itemTotal;
  }, 0);

  console.log('Final total cart price:', totalCartPrice);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Giỏ hàng của bạn</h1>
        
        {loading && (
          <div className="text-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="h-5 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg text-center mb-6">
            {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">Giỏ hàng của bạn đang trống.</p>
            ) : (
              <>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.cart_id}
                      className="flex items-center border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg mr-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/100x100?text=Ảnh+sản+phẩm";
                        }}
                      />
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">{item.product_name}</h2>
                        <p className="text-gray-600">Đơn giá: {parseFloat(item.price).toLocaleString()} <sup className="text-sm">VNĐ</sup></p>
                        <p className="text-gray-800 font-medium">Tổng: {parseFloat(item.total_price).toLocaleString()} <sup className="text-sm">VNĐ</sup></p>
                        <div className="flex items-center mt-3 gap-2">
                          <label className="text-gray-600 text-sm">Số lượng:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.cart_id, parseInt(e.target.value))}
                            className="w-16 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.cart_id)}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                        title="Xóa sản phẩm"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-right">
                  <p className="text-xl font-bold text-gray-900">
                    Tổng cộng: {totalCartPrice.toLocaleString()} <sup className="text-sm">VNĐ</sup>
                  </p>
                 <button 
                    onClick={() => navigate('/checkout', { state: { cartItems, total: totalCartPrice } })}
                    className="mt-4 px-6 py-3 bg-amber-800 text-white font-semibold rounded-full hover:bg-amber-900 transition-all duration-300"
                  >
                    Thanh toán
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;