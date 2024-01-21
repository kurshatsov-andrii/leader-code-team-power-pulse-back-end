const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers');
const {
  emailRegexp,
  levelsActivity,
  sex,
  blood,
} = require('../constans/constans');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegexp,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Set password for user'],
    },
    height: {
      type: Number,
      default: 0,
    },
    currentWeight: {
      type: Number,
      default: 0,
    },
    desiredWeight: {
      type: Number,
      default: 0,
    },
    birthday: {
      type: Date,
      validate: {
        validator: function (birthday) {
          const age = (new Date() - birthday) / (1000 * 60 * 60 * 24 * 365.25);
          return age >= 18;
        },
        message: 'The user must be over 18 years old.',
      },
      default: null,
    },
    blood: {
      type: Number,
      enum: blood,
      default: 1,
    },
    sex: {
      type: String,
      enum: sex,
      default: 'male',
    },
    levelActivity: {
      type: Number,
      enum: levelsActivity,
      default: 1,
    },

    bmr: {
      type: Number,
      default: 2200,
    },
    targetTime: {
      type: Number,
      default: 110,
    },
    avatarURL: {
      type: String,
      default: '',
    },

    token: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': 'The email must be a string.',
    'any.required': 'email field is required.',
    'string.pattern.base': 'The email must be in format test@gmail.com.',
  }),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': 'The email must be a string.',
    'any.required': 'email field is required.',
    'string.pattern.base': 'The email must be in format test@gmail.com.',
  }),
  password: Joi.string().min(6).required(),
});

const addUserParamsSchemaJoi = Joi.object({
  name: Joi.string(),
  height: Joi.number().min(35).required().messages({
    'any.required': `Missing required height field`,
  }),
  currentWeight: Joi.number().min(35).required().messages({
    'any.required': `Missing required currentWeigth field`,
  }),
  desiredWeight: Joi.number().min(35).required().messages({
    'any.required': `Missing required desiredWeight field`,
  }),
  birthday: Joi.date().required().messages({
    'any.required': `Missing required birthday field`,
  }),
  blood: Joi.number().valid(1, 2, 3, 4).required().messages({
    'any.required': `Missing required blood field`,
  }),
  sex: Joi.string().lowercase().valid('male', 'female').messages({
    'any.required': `Missing required sex field`,
  }),
  levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required().messages({
    'any.required': `Missing required levelActivity field`,
  }),
});

const schemas = {
  registerSchema,
  loginSchema,
  addUserParamsSchemaJoi,
};

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

module.exports = { User, schemas };
