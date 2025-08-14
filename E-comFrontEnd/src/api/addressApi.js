const API_URL = '/api/address';

// Lấy danh sách tỉnh/thành phố
export const getProvinces = async () => {
  try {
    const response = await fetch(`${API_URL}/provinces`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Lỗi khi lấy danh sách tỉnh/thành phố');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw error;
  }
};

// Lấy danh sách quận/huyện theo tỉnh
export const getDistricts = async (provinceCode) => {
  try {
    const response = await fetch(`${API_URL}/districts/${provinceCode}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Lỗi khi lấy danh sách quận/huyện');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

// Lấy danh sách xã/phường theo quận/huyện
export const getWards = async (districtCode) => {
  try {
    const response = await fetch(`${API_URL}/wards/${districtCode}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Lỗi khi lấy danh sách xã/phường');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
};

// Lấy thông tin địa chỉ đầy đủ
export const getFullAddress = async (provinceCode, districtCode, wardCode) => {
  try {
    const params = new URLSearchParams();
    if (provinceCode) params.append('provinceCode', provinceCode);
    if (districtCode) params.append('districtCode', districtCode);
    if (wardCode) params.append('wardCode', wardCode);
    
    const response = await fetch(`${API_URL}/full-address?${params}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Lỗi khi lấy thông tin địa chỉ');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching full address:', error);
    throw error;
  }
};
