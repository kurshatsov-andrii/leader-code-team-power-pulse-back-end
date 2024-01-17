const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
const ctrl = require('../../controllers/products');

router.get('/', authenticate, ctrl.getAllProductsWithFilter);

router.get('/category', authenticate, ctrl.getProductsCategory);

module.exports = router;
