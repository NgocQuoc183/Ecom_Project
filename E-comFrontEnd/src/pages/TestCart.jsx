import React, { useState } from 'react';
import { addToCart } from '../api/cart';
import jwt_decode from 'jwt-decode';

const TestCart = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy user ID từ token
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

  const testAddToCart = async () => {
    if (!userId) {
      setResult('❌ Chưa đăng nhập! Vui lòng đăng nhập trước.');
      return;
    }

    setLoading(true);
    setResult('⏳ Đang thêm sản phẩm vào giỏ hàng...');

    try {
      const response = await addToCart(userId, 5, 1); // Thêm sản phẩm ID 5, số lượng 1
      setResult(`✅ Thành công! ${response.message}`);
    } catch (error) {
      console.error('Lỗi:', error);
      setResult(`❌ Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setTestToken = () => {
    // Token test từ API login ở trên
    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU1MjAwOTYxLCJleHAiOjE3NTUyODczNjF9.F9j_HxnTuX1emV-6ycjaYaAoHY8yjUcuBHlA6Vl4Ddw";
    localStorage.setItem('token', testToken);
    setResult('✅ Token test đã được set! Bây giờ bạn có thể test thêm vào giỏ hàng.');
    window.location.reload(); // Reload để cập nhật userId
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    setResult('🗑️ Token đã được xóa!');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">🛒 Test Giỏ Hàng</h1>
        
        <div className="space-y-6">
          {/* Thông tin user */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Thông tin đăng nhập:</h3>
            {userId ? (
              <p className="text-green-600">✅ Đã đăng nhập - User ID: {userId}</p>
            ) : (
              <p className="text-red-600">❌ Chưa đăng nhập</p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            {!userId && (
              <button
                onClick={setTestToken}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                🔑 Set Token Test (Đăng nhập giả lập)
              </button>
            )}

            {userId && (
              <>
                <button
                  onClick={testAddToCart}
                  disabled={loading}
                  className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
                >
                  {loading ? '⏳ Đang xử lý...' : '🛒 Test Thêm Vào Giỏ Hàng'}
                </button>

                <button
                  onClick={clearToken}
                  className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  🚪 Đăng xuất (Xóa Token)
                </button>
              </>
            )}
          </div>

          {/* Kết quả */}
          {result && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Kết quả:</h3>
              <p className="whitespace-pre-wrap">{result}</p>
            </div>
          )}

          {/* Hướng dẫn */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📝 Hướng dẫn test:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Nhấn "Set Token Test" để giả lập đăng nhập</li>
              <li>Nhấn "Test Thêm Vào Giỏ Hàng" để test chức năng</li>
              <li>Kiểm tra kết quả hiển thị</li>
              <li>Có thể test nhiều lần để kiểm tra cập nhật số lượng</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCart;
