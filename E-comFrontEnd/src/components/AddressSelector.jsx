import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { getProvinces, getDistricts, getWards } from '../api/addressApi';

const AddressSelector = ({ 
  onAddressChange, 
  initialAddress = {}, 
  disabled = false,
  required = false 
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false
  });
  
  const [error, setError] = useState('');

  // Load provinces khi component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Set initial values
  useEffect(() => {
    if (initialAddress.provinceCode) {
      setSelectedProvince(initialAddress.provinceCode);
    }
    if (initialAddress.districtCode) {
      setSelectedDistrict(initialAddress.districtCode);
    }
    if (initialAddress.wardCode) {
      setSelectedWard(initialAddress.wardCode);
    }
  }, [initialAddress]);

  // Load districts khi chọn province
  useEffect(() => {
    if (selectedProvince) {
      loadDistricts(selectedProvince);
      setSelectedDistrict('');
      setSelectedWard('');
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  // Load wards khi chọn district
  useEffect(() => {
    if (selectedDistrict) {
      loadWards(selectedDistrict);
      setSelectedWard('');
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  // Notify parent component khi address thay đổi
  useEffect(() => {
    const province = provinces.find(p => p.code === selectedProvince);
    const district = districts.find(d => d.code === selectedDistrict);
    const ward = wards.find(w => w.code === selectedWard);

    const addressData = {
      provinceCode: selectedProvince,
      districtCode: selectedDistrict,
      wardCode: selectedWard,
      province: province || null,
      district: district || null,
      ward: ward || null,
      fullAddress: [ward?.name, district?.name, province?.name].filter(Boolean).join(', ')
    };

    onAddressChange(addressData);
  }, [selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards, onAddressChange]);

  const loadProvinces = async () => {
    try {
      setLoading(prev => ({ ...prev, provinces: true }));
      setError('');
      const data = await getProvinces();
      setProvinces(data);
    } catch (err) {
      setError('Lỗi khi tải danh sách tỉnh/thành phố');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const loadDistricts = async (provinceCode) => {
    try {
      setLoading(prev => ({ ...prev, districts: true }));
      const data = await getDistricts(provinceCode);
      setDistricts(data);
    } catch (err) {
      setError('Lỗi khi tải danh sách quận/huyện');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const loadWards = async (districtCode) => {
    try {
      setLoading(prev => ({ ...prev, wards: true }));
      const data = await getWards(districtCode);
      setWards(data);
    } catch (err) {
      setError('Lỗi khi tải danh sách xã/phường');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, wards: false }));
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Province Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaMapMarkerAlt className="inline mr-2" />
          Tỉnh/Thành phố {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            disabled={disabled || loading.provinces}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            required={required}
          >
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name_with_type}
              </option>
            ))}
          </select>
          {loading.provinces && (
            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* District Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quận/Huyện {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={disabled || loading.districts || !selectedProvince}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            required={required}
          >
            <option value="">-- Chọn Quận/Huyện --</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name_with_type}
              </option>
            ))}
          </select>
          {loading.districts && (
            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* Ward Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Xã/Phường {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            disabled={disabled || loading.wards || !selectedDistrict}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            required={required}
          >
            <option value="">-- Chọn Xã/Phường --</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name_with_type}
              </option>
            ))}
          </select>
          {loading.wards && (
            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;
