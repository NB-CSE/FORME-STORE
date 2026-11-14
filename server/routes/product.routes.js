const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getFeaturedProducts, getCategories } = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

module.exports = router;
