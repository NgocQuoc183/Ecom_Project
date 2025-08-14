// const Checkout = () => {
//   return (
//     <div className="text-center text-2xl mt-10">
//       <h1>Checkout Page</h1>
//     </div>
//   );
// };

// export default Checkout;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/order'; // Import API (bạn cần tạo file này nếu chưa)
import jwtDecode from 'jwt-decode'; // Để lấy userId
import { FaCheckCircle } from 'react-icons/fa'; // Icon success

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], total = 0 } = location.state || {}; // Nhận từ Cart

  const [userId, setUserId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Lấy userId từ token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);   
        setUserId(decoded.userId || decoded.id || decoded.sub);
      } catch {
        setError('Token không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      setError('Bạn cần đăng nhập để đặt hàng.');
      navigate('/login');
    }
  }, [navigate]);

  // Hàm submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !paymentMethod) {
      return setError('Vui lòng điền đầy đủ thông tin.');
    }
    setLoading(true);
    setError(null); // Reset error trước khi gọi API
    try {
      const response = await createOrder({
        user_id: userId,
        shipping_address: shippingAddress,
        payment_method: paymentMethod
      });
      setSuccess(true);
      setTimeout(() => navigate('/ordershistory', { state: { orderId: response.order_id } }), 2000); // Redirect sang trang orders
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl text-gray-600">Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-3 bg-amber-800 text-white rounded-full">Quay về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Thanh toán</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center text-green-600">
            <FaCheckCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl font-semibold">Đặt hàng thành công! Đang chuyển hướng...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phần form thông tin */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Địa chỉ giao hàng</label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows="4"
                    placeholder="Nhập địa chỉ đầy đủ (số nhà, đường, quận/huyện, tỉnh/thành phố)"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Phương thức thanh toán</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                    <option value="bank">Chuyển khoản ngân hàng</option>
                    {/* Thêm option khác nếu cần, ví dụ: VNPay */}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-amber-800 text-white font-semibold rounded-full hover:bg-amber-900 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
              </form>
            </div>

            {/* Phần tóm tắt giỏ hàng */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.cart_id} className="flex justify-between text-gray-800">
                    <span>{item.product_name} (x{item.quantity})</span>
                    <span>{item.total_price.toLocaleString()} VNĐ</span>
                  </div>
                ))}
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span>{total.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout; 