const express = require('express');
const { authenticate } = require('../../middlewares');
const ExersisesController = require('../../controllers/exersises');
const router = express.Router();

router.get('/', authenticate, ExersisesController.filterExercises);

router.get('/categories', authenticate, ExersisesController.fetchCategories);

router.get(
  '/:filter/:exerciseFilter',
  authenticate,
  ExersisesController.filterExercises
);
router.get('/:filter', authenticate, ExersisesController.filterCategories);

module.exports = router;
