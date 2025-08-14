const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/user/:id', userController.getUserProfile);         // Đúng với getUserProfile
router.put('/user/:id', userController.updateUserProfile);     // Sửa thành /user/:id thay vì /profile/:id
router.post('/user/change-password/:id', userController.changePassword); // Sửa thành /user/change-password/:id

module.exports = router;