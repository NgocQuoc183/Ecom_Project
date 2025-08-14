import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome, FaReceipt } from 'react-icons/fa';
import { checkPaymentStatus } from '../api/paymentApi';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');
  const transactionNo = searchParams.get('transactionNo');

  useEffect(() => {
    if (orderId) {
      fetchOrderInfo();
    }
  }, [orderId]);

  const fetchOrderInfo = async () => {
    try {
      const response = await checkPaymentStatus(orderId);
      setOrderInfo(response.data);
    } catch (error) {
      console.error('Error fetching order info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và sẽ được xử lý sớm nhất.
          </p>

          {/* Order Information */}
          {orderInfo && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-800 mb-4">Thông tin đơn hàng:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">#{orderInfo.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-green-600">
                    {orderInfo.amount?.toLocaleString()} VNĐ
                  </span>
                </div>
                {transactionNo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium">{transactionNo}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium text-green-600">
                    {orderInfo.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Đang xử lý'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">
                    {new Date(orderInfo.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/ordershistory')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              <FaReceipt />
              Xem đơn hàng
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200"
            >
              <FaShoppingBag />
              Tiếp tục mua sắm
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
            >
              <FaHome />
              Về trang chủ
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">📧 Thông báo quan trọng:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Bạn sẽ nhận được email xác nhận đơn hàng trong vài phút tới</li>
            <li>• Đơn hàng sẽ được xử lý và giao trong 1-3 ngày làm việc</li>
            <li>• Bạn có thể theo dõi trạng thái đơn hàng trong mục "Lịch sử đơn hàng"</li>
            <li>• Liên hệ hotline nếu cần hỗ trợ: 1900-xxxx</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
