const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');

// Lấy danh sách tỉnh/thành phố
router.get('/provinces', addressController.getProvinces);

// Lấy danh sách quận/huyện theo tỉnh
router.get('/districts/:provinceCode', addressController.getDistricts);

// Lấy danh sách xã/phường theo quận/huyện
router.get('/wards/:districtCode', addressController.getWards);

// Lấy thông tin địa chỉ đầy đủ
router.get('/full-address', addressController.getFullAddress);

module.exports = router;
