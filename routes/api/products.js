const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
// const {aunthenticate} = require('../../middlewares/authenticate')
const ctrl = require('../../controllers/products');

router.get('/', authenticate, ctrl.getAllProducts);
// authenticate
router.get('/byBloodGroup', authenticate, ctrl.getProductByBloodGroup);

router.get('/allowed', authenticate, ctrl.getAllowed);

router.get('/forbiden', authenticate, ctrl.getForbiden);

router.get('/category', authenticate, ctrl.getProductsCategory);

router.get('/current/:productId', authenticate, ctrl.getProductById);

module.exports = router;
