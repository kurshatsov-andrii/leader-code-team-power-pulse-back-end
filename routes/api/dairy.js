const express = require('express');
const router = express.Router();
const { joiProductSchemas } = require('../../models/diaryProduct');
const { joiExerciseSchemas } = require('../../models/diaryExercise');

const { validateBody, authenticate } = require('../../middlewares');
const controller = require('../../controllers/diary');

router.post(
  '/addProduct',
  // authenticate,
  validateBody(joiProductSchemas.joiAddProductSchema),
  controller.addProduct
);

router.delete(
  '/deleteProduct',
  // authenticate,
  validateBody(joiProductSchemas.joiDeleteProductSchema),
  controller.deleteProduct
);

router.post(
  '/addExercise',
  // authenticate,
  validateBody(joiExerciseSchemas.joiAddExerciseSchema),
  controller.addExercise
);

router.delete(
  '/deleteExercise',
  // authenticate,
  validateBody(joiExerciseSchemas.joiDeleteExerciseSchema),
  controller.deleteExercise
);

module.exports = router;
