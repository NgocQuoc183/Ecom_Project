import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { getOrdersByUser, getOrderDetails } from '../api/order';
import { FaEye, FaSpinner } from 'react-icons/fa';

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

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-12 text-center"><FaSpinner className="animate-spin w-8 h-8 mx-auto" /></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 py-12 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Lịch sử đơn hàng</h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 border border-gray-200 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold">Đơn hàng #{order.id}</p>
                  <p>Tổng: {order.total_amount.toLocaleString()} VNĐ</p>
                  <p>Ngày: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                <button
                  onClick={() => handleViewDetails(order.id)}
                  className="px-4 py-2 bg-amber-800 text-white rounded-full flex items-center"
                >
                  <FaEye className="mr-2" /> Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        )}

        {detailsLoading && <p className="text-center mt-4">Đang tải chi tiết...</p>}
        {selectedOrder && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng #{selectedOrder.order.id}</h2>
            <p>Địa chỉ giao: {selectedOrder.order.shipping_address}</p>
            <p>Phương thức: {selectedOrder.order.payment_method}</p>
            <p>Tổng: {selectedOrder.order.total_amount.toLocaleString()} VNĐ</p>
            <h3 className="font-semibold mt-4">Sản phẩm:</h3>
            <ul className="space-y-2">
              {selectedOrder.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{(item.price * item.quantity).toLocaleString()} VNĐ</span>
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedOrder(null)} className="mt-4 px-4 py-2 bg-gray-300 rounded-full">Đóng</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;