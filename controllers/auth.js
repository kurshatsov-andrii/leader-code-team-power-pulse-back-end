const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { HttpError, calculateBMR } = require('../helpers');
const { User } = require('../models/user');

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,

      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = (req, res) => {
  res.json(req.user);
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.status(200).json({
      message: 'Logout succses',
    });
  } catch (error) {
    next(error);
  }
};

const addUserData = async (req, res, next) => {
  try {
    const { email } = req.user;
    const updatedData = await User.findOneAndUpdate({ email }, req.body, {
      new: true,
    });

    const { desiredWeight, height, birthday, sex, levelActivity } = updatedData;

    const bmr = calculateBMR(
      desiredWeight,
      height,
      birthday,
      sex,
      levelActivity
    );

    updatedData.bmr = bmr;

    await updatedData.save();

    if (updatedData) {
      res.status(201).json(updatedData);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  addUserData,
};
