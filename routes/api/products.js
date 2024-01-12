const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate');
// const {aunthenticate} = require('../../middlewares/authenticate')
const ctrl = require('../api/product');

router.get('/categories', authenticate, ctrl.getAllCategories);

router.get('/byBloodGroup', authenticate, ctrl.getProductByBloodGroup);

module.exports = router;
