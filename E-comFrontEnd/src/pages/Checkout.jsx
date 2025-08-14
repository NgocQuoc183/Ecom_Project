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
import { createOrderAndPayment } from '../api/paymentApi';
import jwtDecode from 'jwt-decode'; // Để lấy userId
import { FaCheckCircle, FaMapMarkerAlt, FaUser, FaPhone, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa'; // Icon success
import AddressSelector from '../components/AddressSelector';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], total = 0 } = location.state || {}; // Nhận từ Cart

  const [userId, setUserId] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    detailAddress: '',
    addressData: null
  });
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

  // Xử lý thay đổi địa chỉ
  const handleAddressChange = (addressData) => {
    setShippingInfo(prev => ({
      ...prev,
      addressData
    }));
  };

  // Xử lý thay đổi thông tin giao hàng
  const handleShippingInfoChange = (field, value) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Hàm submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!shippingInfo.fullName.trim()) {
      return setError('Vui lòng nhập họ tên người nhận.');
    }
    if (!shippingInfo.phone.trim()) {
      return setError('Vui lòng nhập số điện thoại.');
    }
    if (!shippingInfo.detailAddress.trim()) {
      return setError('Vui lòng nhập địa chỉ chi tiết.');
    }
    if (!shippingInfo.addressData?.wardCode) {
      return setError('Vui lòng chọn đầy đủ Tỉnh/Quận/Xã.');
    }
    if (!paymentMethod) {
      return setError('Vui lòng chọn phương thức thanh toán.');
    }

    // Tạo địa chỉ giao hàng đầy đủ
    const fullShippingAddress = [
      shippingInfo.detailAddress,
      shippingInfo.addressData.fullAddress
    ].join(', ');
    setLoading(true);
    setError(null); // Reset error trước khi gọi API
    try {
      console.log('=== CHECKOUT DEBUG ===');
      console.log('cartItems:', cartItems);
      console.log('userId:', userId);
      console.log('total:', total);

      const orderData = {
        user_id: userId,
        shipping_address: fullShippingAddress,
        payment_method: paymentMethod,
        recipient_name: shippingInfo.fullName,
        recipient_phone: shippingInfo.phone,
        items: cartItems.map(item => {
          console.log('Processing cart item:', item);
          return {
            product_id: item.product_id || item.id,
            quantity: item.quantity,
            price: item.price || item.unit_price
          };
        }),
        total_amount: total
      };

      console.log('Order data to send:', orderData);

      const response = await createOrderAndPayment(orderData);

      // Nếu là VNPay, redirect đến trang thanh toán
      if (response.paymentMethod === 'VNPay' && response.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      // COD hoặc thanh toán khác
      setSuccess(true);
      setTimeout(() => navigate('/ordershistory', { state: { orderId: response.orderId } }), 2000);
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
              <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Thông tin người nhận */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2" />
                      Họ tên người nhận <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleShippingInfoChange('fullName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Nhập họ tên người nhận"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2" />
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                {/* Địa chỉ chi tiết */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Địa chỉ chi tiết <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.detailAddress}
                    onChange={(e) => handleShippingInfoChange('detailAddress', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Số nhà, tên đường..."
                    required
                  />
                </div>

                {/* Address Selector */}
                <div>
                  <AddressSelector
                    onAddressChange={handleAddressChange}
                    required={true}
                  />
                </div>
                {/* Phương thức thanh toán */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-3">
                        <FaMoneyBillWave className="text-green-500" />
                        <div>
                          <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                          <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="VNPay"
                        checked={paymentMethod === 'VNPay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-3">
                        <FaCreditCard className="text-blue-500" />
                        <div>
                          <div className="font-medium">Thanh toán VNPay</div>
                          <div className="text-sm text-gray-500">Thanh toán qua ví điện tử VNPay</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Đặt hàng ngay
                    </>
                  )}
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