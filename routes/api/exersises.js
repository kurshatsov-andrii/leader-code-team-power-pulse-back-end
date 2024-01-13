const express = require('express');
const { authenticate } = require('../../middlewares');
const ExersisesController = require('../../controllers/exersises');
const router = express.Router();

router.get(
  '/categories',
  authenticate,
  ExersisesController.fetchExerciseCategories
);
router.get('/exercises', authenticate, ExersisesController.fetchExercises);

module.exports = router;
