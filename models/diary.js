const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const { productSchema } = require('./diaryProduct');
const { exerciseSchema } = require('./diaryExercise');

const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/i;

const diarySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    consumedCalories: {
      type: Number,
    },

    burnedCalories: {
      type: Number,
    },

    products: [],

    exercises: [],
  },
  { versionKey: false, timestamps: true }
);

diarySchema.post('save', handleMongooseError);

const Diary = model('diary', diarySchema);

module.exports = {
  Diary,
};
