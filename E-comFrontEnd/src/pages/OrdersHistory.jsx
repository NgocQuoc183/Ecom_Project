import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { getOrdersByUser, getOrderDetails } from '../api/order';
import {
  FaEye,
  FaSpinner,
  FaShoppingBag,
  FaClock,
  FaCheck,
  FaTruck,
  FaCheckCircle,
  FaTimes,
  FaCalendarAlt,
  FaMoneyBillWave
} from 'react-icons/fa';

const OrdersHistory = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Lấy userId từ token
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token in OrdersHistory:', token); // Debug token
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded); // Debug payload
        let userIdFromToken = decoded.userId || decoded.id || decoded.sub;
        // Parse userId nếu có dấu ':', ví dụ '11:1' → '11'
        if (typeof userIdFromToken === 'string' && userIdFromToken.includes(':')) {
          userIdFromToken = userIdFromToken.split(':')[0];
          console.log('Parsed userId:', userIdFromToken); // Debug
        }
        setUserId(userIdFromToken); // Lưu userId (string, vì backend chấp nhận string)
      } catch (err) {
        console.error('JWT decode error:', err);
        setError('Token không hợp lệ. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      setError('Bạn cần đăng nhập để xem lịch sử đơn hàng.');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch orders
  useEffect(() => {
    if (userId) {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await getOrdersByUser(userId);
          console.log('Orders response:', response); // Debug
          setOrders(response.orders || []);
        } catch (err) {
          console.error('Fetch orders error:', err);
          setError(err.message || 'Lỗi khi lấy lịch sử đơn hàng.');
          if (err.message.includes('401')) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [userId, navigate]);

  // Xem chi tiết order
  const handleViewDetails = async (orderId) => {
    setDetailsLoading(true);
    setError(null);
    try {
      const response = await getOrderDetails(orderId);
      setSelectedOrder(response);
    } catch (err) {
      console.error('Fetch details error:', err);
      setError(err.message || 'Lỗi khi lấy chi tiết đơn hàng.');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Hàm lấy badge trạng thái
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: 'Chờ xử lý',
        color: 'bg-yellow-100 text-yellow-800',
        icon: FaClock
      },
      confirmed: {
        label: 'Đã xác nhận',
        color: 'bg-blue-100 text-blue-800',
        icon: FaCheck
      },
      shipped: {
        label: 'Đang giao',
        color: 'bg-purple-100 text-purple-800',
        icon: FaTruck
      },
      delivered: {
        label: 'Đã giao',
        color: 'bg-green-100 text-green-800',
        icon: FaCheckCircle
      },
      cancelled: {
        label: 'Đã hủy',
        color: 'bg-red-100 text-red-800',
        icon: FaTimes
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-12 text-center"><FaSpinner className="animate-spin w-8 h-8 mx-auto" /></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 py-12 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
              <FaShoppingBag className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
              <p className="text-gray-600">Theo dõi tình trạng các đơn hàng của bạn</p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 mb-6">Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition duration-200"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order.id}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-gray-400" />
                        <span>Tổng tiền: <strong className="text-amber-600">{order.total_amount.toLocaleString()} VNĐ</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaShoppingBag className="text-gray-400" />
                        <span>Phương thức: {order.payment_method || 'COD'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition duration-200 flex items-center gap-2 w-full lg:w-auto justify-center"
                    >
                      <FaEye />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading Details */}
        {detailsLoading && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-8 text-center">
            <FaSpinner className="animate-spin w-8 h-8 mx-auto text-amber-500 mb-4" />
            <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-amber-500 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Chi tiết đơn hàng #{selectedOrder.order.id}</h2>
                    <p className="text-amber-100">Ngày đặt: {new Date(selectedOrder.order.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedOrder.order.status)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaTruck className="text-amber-500" />
                      Thông tin giao hàng
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <strong>Địa chỉ:</strong> {selectedOrder.order.shipping_address || 'Chưa cập nhật'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Ghi chú:</strong> {selectedOrder.order.notes || 'Không có ghi chú'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaMoneyBillWave className="text-amber-500" />
                      Thông tin thanh toán
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <strong>Phương thức:</strong> {selectedOrder.order.payment_method || 'COD'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Tổng tiền:</strong>
                      <span className="text-xl font-bold text-amber-600 ml-2">
                        {selectedOrder.order.total_amount.toLocaleString()} VNĐ
                      </span>
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaShoppingBag className="text-amber-500" />
                    Sản phẩm đã đặt ({selectedOrder.items.length} sản phẩm)
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                            <p className="text-gray-600 text-sm">Đơn giá: {item.price.toLocaleString()} VNĐ</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-600">
                            {(item.price * item.quantity).toLocaleString()} VNĐ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;