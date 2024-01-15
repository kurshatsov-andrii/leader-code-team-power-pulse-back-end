const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/i;

const diarySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    date: {
      type: String,
      format: 'dd/mm/YYYY',
      required: true || date,
    },

    consumedCalories: {
      type: Number,
      default: 0,
    },

    burnedCalories: {
      type: Number,
      default: 0,
    },

    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'product',
        },
        amount: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    exercises: [
      {
        exerciseId: {
          type: Schema.Types.ObjectId,
          ref: 'exercises',
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

diarySchema.post('save', handleMongooseError);

const Diary = model('diary', diarySchema);

const joiGetDiarySchema = Joi.object({
  date: Joi.string().regex(dateFormat).required().messages({
    'string.pattern.base':
      'Formate date is wrong. Please follow the correct format: dd/mm/YYYY',
  }),
});

const joiAddProductSchema = Joi.object({
  productId: Joi.string().required(),
  date: Joi.string().regex(dateFormat).required(),
  amount: Joi.number().min(1).required(),
});
const joiDeleteProductSchema = Joi.object({
  id: Joi.string().required(),
  date: Joi.string().regex(dateFormat).required(),
});

const joiAddExerciseSchema = Joi.object({
  exerciseId: Joi.string().required(),
  date: Joi.string().regex(dateFormat).required(),
});
const joiDeleteExerciseSchema = Joi.object({
  id: Joi.string().required(),
  date: Joi.string().regex(dateFormat).required(),
});

const joiSchemas = {
  joiGetDiarySchema,
  joiAddProductSchema,
  joiDeleteProductSchema,
  joiAddExerciseSchema,
  joiDeleteExerciseSchema,
};

module.exports = {
  Diary,
  joiSchemas,
};
