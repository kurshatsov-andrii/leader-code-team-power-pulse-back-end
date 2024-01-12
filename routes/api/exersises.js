const express = require('express');
const { authenticate } = require('../../middlewares');
const ExersisesController = require('../../controllers/exersises');
const router = express.Router();

router.get('/categories', ExersisesController.fetchExerciseCategories);
router.get('/exercises', ExersisesController.fetchExercises);

module.exports = router;
