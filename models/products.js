const { Schema, model } = require('mongoose');
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

const Product = model('product', productCategorySchema);

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: [true, 'Define category name'],
    },
  },
  { versionKey: false }
);

const ProductsCategory = model(
  'productsCategory',
  categorySchema,
  'productsCategories'
);

module.exports = {
  Product,
  ProductsCategory,
};
