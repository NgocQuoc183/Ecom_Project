const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.get('/user/:user_id', orderController.getOrdersByUserId);
router.get('/:id', orderController.getOrderDetails);

module.exports = router;
