const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/order.admin.controller');

router.get('/', orderController.getAllOrders);
router.put('/:id', orderController.updateOrderStatus);
router.get('/:id', orderController.getOrderDetails);


module.exports = router;
