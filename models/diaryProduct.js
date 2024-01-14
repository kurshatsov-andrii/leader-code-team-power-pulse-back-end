const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/i;

const productSchema = new Schema(
  {
    productId: {
      type: String,
      ref: 'product',
      required: true,
    },
    // weight: {
    //   type: Number,
    //   required: true,
    //   min: 1,
    // },
    // calories: {
    //   type: Number,
    //   required: true,
    //   min: 1,
    // },
    // category: {
    //   type: String,
    //   required: true,
    // },
    // title: {
    //   type: String,
    //   required: true,
    // },
    // groupBloodNotAllowed: {
    //   type: Boolean,
    //   default: true,
    // },
    // amount: {
    //   type: Number,
    //   required: true,
    //   min: 1,
    // },
  },
  { versionKey: false, timestamps: true }
);

// productSchema.post('save', handleMongooseError);

const joiAddProductSchema = Joi.object({
  productId: Joi.string().required(),
  // title: Joi.string().required(),
  // category: Joi.string().required(),
  // calories: Joi.number().min(1).required(),
  // weight: Joi.number().min(1).required(),
  // groupBloodNotAllowed: Joi.boolean().required(),
  amount: Joi.number().min(1).required(),
});
const joiDeleteProductSchema = Joi.object({
  id: Joi.string().required(),
});

// const DiaryProduct = model('diaryproduct', productSchema);

const joiProductSchemas = {
  joiAddProductSchema,
  joiDeleteProductSchema,
};

module.exports = {
  // DiaryProduct,
  joiProductSchemas,
};
