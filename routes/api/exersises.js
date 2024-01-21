const express = require('express');
const { authenticate } = require('../../middlewares');
const ExersisesController = require('../../controllers/exersises');
const router = express.Router();

router.get(
  '/',
  // authenticate,
  ExersisesController.filterExercises
);

router.get(
  '/categories',
  // authenticate,
  ExersisesController.fetchCategories
);

router.get('/:filter/:exerciseFilter', ExersisesController.filterExercises);
router.get('/:filter', ExersisesController.filterCategories);


module.exports = router;
