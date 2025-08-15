const express = require('express');
const router = express.Router();
const reviewAdminController = require('../../controllers/admin/review.admin.controller');

/**
 * Admin Review Routes - Quản lý đánh giá sản phẩm
 */

// GET /api/admin/reviews - Lấy tất cả đánh giá với filter và phân trang
router.get('/', reviewAdminController.getAllReviews);

// GET /api/admin/reviews/stats - Lấy thống kê đánh giá
router.get('/stats', reviewAdminController.getReviewStats);

// GET /api/admin/reviews/:id - Lấy chi tiết một đánh giá
router.get('/:id', reviewAdminController.getReviewById);

// DELETE /api/admin/reviews/:id - Xóa đánh giá
router.delete('/:id', reviewAdminController.deleteReview);

module.exports = router;
