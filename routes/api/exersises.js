const express = require('express');
const { authenticate } = require('../../middlewares');
const ExersisesController = require('../../controllers/exersises');
const router = express.Router();

router.get(
  '/',
  authenticate,
  ExersisesController.fetchExercises
);

router.get(
  '/categories',
  authenticate,
  ExersisesController.fetchCategories
);

router.get(
  '/body-part',
  authenticate,
  ExersisesController.fetchBodyParts
);

router.get(
  '/muscles',
  authenticate,
  ExersisesController.fetchMuscles
);

router.get(
  '/equipment',
  authenticate,
  ExersisesController.fetchEquipment
);

module.exports = router;
