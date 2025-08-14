const fs = require('fs');
const path = require('path');

// Đọc dữ liệu từ file JSON
const readJsonFile = (filename) => {
  try {
    const filePath = path.join(__dirname, '../Data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return {};
  }
};

// Cache dữ liệu để tránh đọc file nhiều lần
let provincesData = null;
let districtsData = null;
let wardsData = null;

const loadData = () => {
  if (!provincesData) {
    provincesData = readJsonFile('tinh_tp.json');
  }
  if (!districtsData) {
    districtsData = readJsonFile('quan_huyen.json');
  }
  if (!wardsData) {
    wardsData = readJsonFile('xa_phuong.json');
  }
};

// Lấy danh sách tỉnh/thành phố
exports.getProvinces = (req, res) => {
  try {
    loadData();
    
    // Convert object to array và sort theo tên
    const provinces = Object.values(provincesData).sort((a, b) => 
      a.name.localeCompare(b.name, 'vi', { numeric: true })
    );
    
    res.json({
      success: true,
      data: provinces
    });
  } catch (error) {
    console.error('Error getting provinces:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tỉnh/thành phố'
    });
  }
};

// Lấy danh sách quận/huyện theo tỉnh
exports.getDistricts = (req, res) => {
  try {
    const { provinceCode } = req.params;
    
    if (!provinceCode) {
      return res.status(400).json({
        success: false,
        message: 'Mã tỉnh/thành phố là bắt buộc'
      });
    }
    
    loadData();
    
    // Lọc quận/huyện theo parent_code
    const districts = Object.values(districtsData)
      .filter(district => district.parent_code === provinceCode)
      .sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true }));
    
    res.json({
      success: true,
      data: districts
    });
  } catch (error) {
    console.error('Error getting districts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách quận/huyện'
    });
  }
};

// Lấy danh sách xã/phường theo quận/huyện
exports.getWards = (req, res) => {
  try {
    const { districtCode } = req.params;
    
    if (!districtCode) {
      return res.status(400).json({
        success: false,
        message: 'Mã quận/huyện là bắt buộc'
      });
    }
    
    loadData();
    
    // Lọc xã/phường theo parent_code
    const wards = Object.values(wardsData)
      .filter(ward => ward.parent_code === districtCode)
      .sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true }));
    
    res.json({
      success: true,
      data: wards
    });
  } catch (error) {
    console.error('Error getting wards:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách xã/phường'
    });
  }
};

// Lấy thông tin địa chỉ đầy đủ
exports.getFullAddress = (req, res) => {
  try {
    const { provinceCode, districtCode, wardCode } = req.query;
    
    loadData();
    
    const result = {};
    
    if (provinceCode && provincesData[provinceCode]) {
      result.province = provincesData[provinceCode];
    }
    
    if (districtCode && districtsData[districtCode]) {
      result.district = districtsData[districtCode];
    }
    
    if (wardCode && wardsData[wardCode]) {
      result.ward = wardsData[wardCode];
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting full address:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin địa chỉ'
    });
  }
};
