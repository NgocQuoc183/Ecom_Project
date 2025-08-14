import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaShoppingBag, FaHome, FaRedo } from 'react-icons/fa';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message') || 'Thanh toán không thành công';

  const handleRetryPayment = () => {
    // Redirect về trang checkout hoặc cart để thử lại
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Failed Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Failed Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-red-500 text-4xl" />
          </div>

          {/* Failed Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanh toán thất bại!
          </h1>
          <p className="text-gray-600 mb-8">
            {decodeURIComponent(message)}
          </p>

          {/* Order Information */}
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-800 mb-4">Thông tin đơn hàng:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium text-red-600">Thanh toán thất bại</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">
                    {new Date().toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetryPayment}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              <FaRedo />
              Thử lại thanh toán
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

        {/* Troubleshooting */}
        <div className="bg-yellow-50 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Một số nguyên nhân có thể gây lỗi:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Số dư tài khoản không đủ</li>
            <li>• Thông tin thẻ không chính xác</li>
            <li>• Kết nối mạng không ổn định</li>
            <li>• Hủy giao dịch trong quá trình thanh toán</li>
            <li>• Ngân hàng từ chối giao dịch</li>
          </ul>
        </div>

        {/* Support Info */}
        <div className="bg-blue-50 rounded-lg p-6 mt-4">
          <h3 className="font-semibold text-blue-800 mb-2">📞 Cần hỗ trợ?</h3>
          <p className="text-blue-700 text-sm">
            Nếu bạn gặp khó khăn trong việc thanh toán, vui lòng liên hệ:
          </p>
          <ul className="text-blue-700 text-sm mt-2 space-y-1">
            <li>• Hotline: 1900-xxxx (24/7)</li>
            <li>• Email: support@example.com</li>
            <li>• Live Chat: Góc dưới bên phải màn hình</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
