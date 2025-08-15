const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.post('/', reviewController.createReview);
router.get('/product/:product_id', reviewController.getReviewsByProduct);
router.get('/product/:product_id/stats', reviewController.getReviewStats);

module.exports = router;
