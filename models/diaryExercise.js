const { Schema } = require('mongoose');
const Joi = require('joi');

const exerciseSchema = new Schema(
  {
    exerciseId: {
      type: String,
      required: true,
    },
    // date: {
    //   type: String,
    //   format: 'dd/mm/YYYY',
    //   required: true || date,
    // },
    // burnedCalories: {
    //   type: Number,
    //   min: 1,
    //   required: true,
    // },
    // time: {
    //   type: Number,
    //   min: 1,
    //   required: true,
    // },
  },
  { versionKey: false }
);

const joiAddExerciseSchema = Joi.object({
  exerciseId: Joi.string().required(),
  // bodyPart: Joi.string(),
  // equipment: Joi.string(),
  // name: Joi.string(),
  // target: Joi.string(),
  // burnedCalories: Joi.number().min(1),
  // time: Joi.number().min(1).required(),
});
const joiDeleteExerciseSchema = Joi.object({
  id: Joi.string().required(),
});

const joiExerciseSchemas = {
  joiAddExerciseSchema,
  joiDeleteExerciseSchema,
};

module.exports = {
  exerciseSchema,
  joiExerciseSchemas,
};
