const express = require('express');
const router = express.Router();
const adminProduct = require('../../controllers/admin/product.admin.controller');

router.post('/', adminProduct.createProduct);
router.get('/', adminProduct.getAllProducts);
router.put('/:id', adminProduct.updateProduct);
router.delete('/:id', adminProduct.deleteProduct);

module.exports = router;
