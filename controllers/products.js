require('dotenv').config();
const { Product } = require('../models/products');
const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../models/user');

const getAllProducts = async (req, res) => {
  const { page = 1, limit = 24 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const result = await Product.find().skip(skip).limit(limit);

    if (!result || result.length === 0) {
      throw HttpError(404, 'No categories found.');
    }

    res.json({
      data: result,
      page: +page,
      limit: +limit,
      total: await Product.countDocuments(),
    });
  } catch (error) {
    next(error);
  }
};

const getProductsCategory = async (req, res) => {
  const result = await Product.distinct('category');
  res.json(result);
};

const getProductFilter = async (req, res) => {
  const { category, search, recommended } = req.query;
  const data = {};

  if (category) {
    data.category = category;
  }
  if (search) {
    data.title = { $regex: search, $options: 'i' };
  }

  if (recommended) {
    const { user: id } = req;
    const user = await User.findById(id);
    const bloodGroup = user.blood;

    if (!bloodGroup) {
      console.log('There are na information about your blood group');
    }

    if (recommended === 'true') {
      data[`groupBloodNotAllowed.${bloodGroup}`] = true;
    } else {
      data[`groupBloodNotAllowed.${bloodGroup}`] = false;
    }
  }

  const blood = parseInt(req.query.blood, 10);
  if (!isNaN(blood)) {
    const validBloodGroups = [1, 2, 3, 4];
    if (!validBloodGroups.includes(blood)) {
      throw HttpError(
        400,
        'Invalid blood group, it should be a number one of 1, 2, 3, 4'
      );
    }

    data[`groupBloodNotAllowed.${blood}`] = false;
  }

  const { page = 1, limit = 24 } = req.query;
  const sum = await Product.find(data).count();
  const products = await Product.find(data)
    .limit(limit)
    .skip(limit * (page - 1));

  if (!products) {
    throw HttpError(errorType.BAD_REQUEST);
  }

  res.json({
    sum,
    page,
    limit,
    products,
  });
};

module.exports = {
  getAllProducts: ctrlWrapper(getAllProducts),
  getProductByBloodGroup: ctrlWrapper(getProductByBloodGroup),
  getAllowed: ctrlWrapper(getAllowed),
  getForbiden: ctrlWrapper(getForbiden),
  getProductsCategory: ctrlWrapper(getProductsCategory),
  getProductById: ctrlWrapper(getProductById),
  getProductFilter: ctrlWrapper(getProductFilter),
};
