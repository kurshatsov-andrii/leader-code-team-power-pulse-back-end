require('dotenv').config();
const { Product } = require('../models/products');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAllCategories = async (req, res) => {
  //   const { categories } = req.Product;
  const result = await Product.find();
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);

  //   res.status(500).json({ message: "Connect Server Error" });
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
  getAllCategories: ctrlWrapper(getAllCategories),
  getProductByBloodGroup: ctrlWrapper(getProductByBloodGroup),
};
