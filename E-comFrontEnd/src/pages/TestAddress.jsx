import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import AddressSelector from '../components/AddressSelector';

const TestAddress = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: 'Nguyễn Văn A',
    phone: '0123456789',
    detailAddress: '123 Đường ABC'
  });

  const handleAddressChange = (addressData) => {
    setSelectedAddress(addressData);
  };

  const handleInputChange = (field, value) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFullShippingAddress = () => {
    if (!selectedAddress?.fullAddress) return '';
    return [shippingInfo.detailAddress, selectedAddress.fullAddress].join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Address Selector</h1>
              <p className="text-gray-600">Demo chức năng chọn địa chỉ Tỉnh/Quận/Xã</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>
            
            <div className="space-y-4">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              {/* Địa chỉ chi tiết */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ chi tiết
                </label>
                <input
                  type="text"
                  value={shippingInfo.detailAddress}
                  onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Số nhà, tên đường..."
                />
              </div>

              {/* Address Selector */}
              <div>
                <AddressSelector
                  onAddressChange={handleAddressChange}
                  required={true}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Kết quả</h2>
            
            <div className="space-y-4">
              {/* Thông tin người nhận */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Thông tin người nhận:</h3>
                <p><strong>Họ tên:</strong> {shippingInfo.fullName || 'Chưa nhập'}</p>
                <p><strong>Số điện thoại:</strong> {shippingInfo.phone || 'Chưa nhập'}</p>
              </div>

              {/* Địa chỉ đã chọn */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Địa chỉ đã chọn:</h3>
                {selectedAddress ? (
                  <div className="space-y-2">
                    <p><strong>Tỉnh/TP:</strong> {selectedAddress.province?.name_with_type || 'Chưa chọn'}</p>
                    <p><strong>Quận/Huyện:</strong> {selectedAddress.district?.name_with_type || 'Chưa chọn'}</p>
                    <p><strong>Xã/Phường:</strong> {selectedAddress.ward?.name_with_type || 'Chưa chọn'}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Chưa chọn địa chỉ</p>
                )}
              </div>

              {/* Địa chỉ đầy đủ */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <FaCheck className="text-green-600" />
                  Địa chỉ giao hàng đầy đủ:
                </h3>
                <p className="text-green-700 font-medium">
                  {getFullShippingAddress() || 'Vui lòng điền đầy đủ thông tin'}
                </p>
              </div>

              {/* JSON Debug */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Debug JSON:</h3>
                <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                  {JSON.stringify(selectedAddress, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">📝 Hướng dẫn test:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Chọn Tỉnh/Thành phố từ dropdown đầu tiên</li>
            <li>Sau khi chọn tỉnh, dropdown Quận/Huyện sẽ được load tự động</li>
            <li>Chọn Quận/Huyện, dropdown Xã/Phường sẽ được load</li>
            <li>Chọn Xã/Phường để hoàn thành</li>
            <li>Xem kết quả ở bên phải - địa chỉ đầy đủ sẽ được tạo tự động</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestAddress;
