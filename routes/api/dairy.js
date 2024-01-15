const express = require('express');
const router = express.Router();
const { joiSchemas } = require('../../models/diary');

const { validateBody, authenticate } = require('../../middlewares');
const controller = require('../../controllers/diary');

router.get(
  '/getDiary',
  authenticate,
  validateBody(joiSchemas.joiGetDiarySchema),
  controller.getDiary
);

router.post(
  '/addProduct',
  authenticate,
  validateBody(joiSchemas.joiAddProductSchema),
  controller.addProduct
);

router.delete(
  '/deleteProduct',
  authenticate,
  validateBody(joiSchemas.joiDeleteProductSchema),
  controller.deleteProduct
);

router.post(
  '/addExercise',
  authenticate,
  validateBody(joiSchemas.joiAddExerciseSchema),
  controller.addExercise
);

router.delete(
  '/deleteExercise',
  authenticate,
  validateBody(joiSchemas.joiDeleteExerciseSchema),
  controller.deleteExercise
);

module.exports = router;
