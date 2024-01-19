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
      throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    const payload = {
      id: newUser._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(newUser._id, { token });

    res.status(201).json({
      user: {
        token,
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
    const updatedData = await User.findOneAndUpdate(
      { email },

      req.body,

      {
        new: true,
      }
    );

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

const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const avatarURL = req.file.path;

    console.log(avatarURL);

    await User.findByIdAndUpdate(_id, { avatarURL }, { new: true });
    res.status(200).json({ avatarURL });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTargets = (req, res) => {
  const { bmr, targetTime } = req.user;
  res.json({ bmr, targetTime });
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  addUserData,
  updateAvatar,
  getTargets,
};
