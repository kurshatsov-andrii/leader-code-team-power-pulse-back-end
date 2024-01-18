const express = require('express');
const router = express.Router();
const { joiSchemas } = require('../../models/diary');

const {
  validateBody,
  authenticate,
  validateParams,
} = require('../../middlewares');
const controller = require('../../controllers/diary');

router.get(
  '/getDiary/:date',
  authenticate,
  validateParams(joiSchemas.joiGetDiarySchema),
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
  validateBody(joiSchemas.joiDeleteSchema),
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
  validateBody(joiSchemas.joiDeleteSchema),
  controller.deleteExercise
);

module.exports = router;
