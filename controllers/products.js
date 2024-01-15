require('dotenv').config();
const { Product } = require('../models/products');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAllProducts = async (req, res) => {
  const {
    title = null,
    category = null,
    recomended = null,
    page = 1,
    limit = 24,
  } = req.query;
  const skip = (page - 1) * limit;

  const mainQuery = {};

  title && (mainQuery.title = { $regex: title.trim(), $options: 'i' });
  category && (mainQuery.category = { $regex: category.trim(), $options: 'i' });

  if (recomended) {
    const { userParams } = req.user;

    if (!userParams) {
      throw HttpError(404, 'Not found');
    }

    mainQuery[`groupBloodNotAllowed.${userParams.blood}`] =
      recomended === 'true' ? 'false' : 'true';
  }

  const data = await Product.find(mainQuery).skip(skip).limit(limit);

  const sum = await Product.countDocuments(mainQuery);

  res.status(200).json({ data, page: +page, limit: +limit, sum });

  // const result = await Product.find();
  // if (!result) {
  //   throw HttpError(404, 'Not found');
  // }
  // res.json(result);
};

const getProductByBloodGroup = async (req, res) => {
  const { blood } = req.user.userParams;
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
module.exports = {
  getAllProducts: ctrlWrapper(getAllProducts),
  getProductByBloodGroup: ctrlWrapper(getProductByBloodGroup),
};
