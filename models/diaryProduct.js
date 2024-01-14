const { Schema } = require('mongoose');
const Joi = require('joi');

const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/i;

const productSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    // date: {
    //   type: String,
    //   format: 'dd/mm/YYYY',
    //   required: true || date,
    // },
    // amount: {
    //   type: Number,
    //   min: 1,
    //   required: true,
    // },
    // calories: {
    //   type: Number,
    //   min: 1,
    //   required: true,
    // },
  },
  { versionKey: false, timestamps: true }
);

const joiAddProductSchema = Joi.object({
  productId: Joi.string().required(),
  // title: Joi.string().required(),
  // category: Joi.string().required(),
  // calories: Joi.number().min(1).required(),
  // weight: Joi.number().min(1).required(),
  // groupBloodNotAllowed: Joi.boolean().required(),
  // amount: Joi.number().min(1).required(),
});
const joiDeleteProductSchema = Joi.object({
  id: Joi.string().required(),
});

const joiProductSchemas = {
  joiAddProductSchema,
  joiDeleteProductSchema,
};

module.exports = {
  productSchema,
  joiProductSchemas,
};
