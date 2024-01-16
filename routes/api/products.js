const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
// const {aunthenticate} = require('../../middlewares/authenticate')
const ctrl = require('../../controllers/products');

router.get('/', authenticate, ctrl.getAllProducts);

router.get('/category', authenticate, ctrl.getProductsCategory);

router.get('/filter', authenticate, ctrl.getProductFilter);
module.exports = router;
