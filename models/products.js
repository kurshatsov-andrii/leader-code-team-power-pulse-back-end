const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const productCategorySchema = new Schema({
  weight: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  groupBloodNotAllowed: {
    type: {
      1: Boolean,
      2: Boolean,
      3: Boolean,
      4: Boolean,
    },
    default: {},
  },
});

productCategorySchema.post('save', handleMongooseError);

const Product = model('Product', productCategorySchema);

const categorySchema = new Schema({
  productCategories: Array,
});

const Category = model('Category', categorySchema);

const productValidationSchema = Joi.object({
  weight: Joi.number().required(),
  categories: Joi.number().required(),
  category: Joi.string().required(),
  title: Joi.string().required(),
  groupBloodNotAllowed: Joi.object({
    1: Joi.boolean().required(),
    2: Joi.boolean().required(),
    3: Joi.boolean().required(),
    4: Joi.boolean().required(),
  }),
});

module.exports = {
  Product,
  Category,
  productValidationSchema,
};
