require('dotenv').config();
const { Product } = require('../models/products');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAllProducts = async (req, res) => {
  const {
    title = null,
    category = null,
    recommended = null,
    page = 1,
    limit = 24,
  } = req.query;
  const skip = (page - 1) * limit;

  const mainQuery = {};

  title && (mainQuery.title = { $regex: title.trim(), $options: 'i' });
  category && (mainQuery.category = { $regex: category.trim(), $options: 'i' });

  if (recommended) {
    const { userParams } = req.user;

    if (!userParams) {
      throw HttpError(404, 'Not found');
    }

    mainQuery[`groupBloodNotAllowed.${userParams.blood}`] =
      recommended === 'true' ? 'false' : 'true';
  }

  const data = await Product.find(mainQuery).skip(skip).limit(limit);

  const sum = await Product.countDocuments(mainQuery);

  res.status(200).json({ data, page: +page, limit: +limit, sum });
};

const getProductByBloodGroup = async (req, res) => {
  const { blood } = req.user;
  const recomended = req.query.recomended;

  const query = {};

  if (recomended !== undefined) {
    const isRecomended = JSON.parse(recomended);

    if (isRecomended) {
      query[`groupBloodNotAllowed.${blood}`] = false;
    } else {
      query[`groupBloodNotAllowed.${blood}`] = true;
    }
  }

  const filteredProductsByBloodGroup = await Product.find(query);

  res.json(filteredProductsByBloodGroup);
};

const getAllowed = async (req, res, next) => {
  try {
    const blood = parseInt(req.query.blood, 10);

    const validBloodGroups = [1, 2, 3, 4];
    if (!validBloodGroups.includes(blood)) {
      throw HttpError(
        400,
        'Invalid blood group, it should be a number one of 1, 2, 3, 4'
      );
    }

    const result = await Product.find({
      [`groupBloodNotAllowed.${blood}`]: false,
    });

    if (!result) {
      throw HttpError(404, 'Not Found!');
    }

    res.json({
      status: 'List of allowed products',
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getForbiden = async (req, res, next) => {
  try {
    const blood = parseInt(req.query.blood, 10);

    const validBloodGroups = [1, 2, 3, 4];
    if (!validBloodGroups.includes(blood)) {
      throw HttpError(
        400,
        'Invalid blood group, it should be a number one of 1, 2, 3, 4'
      );
    }

    const result = await Product.find({
      [`groupBloodNotAllowed.${blood}`]: true,
    });

    if (!result) {
      throw HttpError(404, 'Not Found!');
    }

    res.json({
      status: 'List of forbidden products',
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProductsCategory = async (req, res) => {
  const result = await Product.distinct('category');
  res.json(result);
};

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await Product.findById(productId);

    if (!result) {
      throw HttpError(404, 'Not Found product by that id');
    }
    res.json({
      status: 'success',
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts: ctrlWrapper(getAllProducts),
  getProductByBloodGroup: ctrlWrapper(getProductByBloodGroup),
  getAllowed: ctrlWrapper(getAllowed),
  getForbiden: ctrlWrapper(getForbiden),
  getProductsCategory: ctrlWrapper(getProductsCategory),
  getProductById: ctrlWrapper(getProductById),
};
