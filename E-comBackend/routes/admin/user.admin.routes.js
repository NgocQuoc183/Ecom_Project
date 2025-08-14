const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/user.admin.controller');

// Routes cho quản lý người dùng
router.get('/stats', userController.getUserStats);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/status', userController.toggleUserStatus);

module.exports = router;
