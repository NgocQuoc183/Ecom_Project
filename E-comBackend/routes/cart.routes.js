const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/', cartController.addToCart);
router.get('/', cartController.getCartByUser);
router.put('/:id', cartController.updateCartItem);
router.delete('/:id', cartController.deleteCartItem);



module.exports = router;
