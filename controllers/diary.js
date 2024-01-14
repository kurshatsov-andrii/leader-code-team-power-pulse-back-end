const { diaryExercise } = require('../models/diaryExercise');
const { ctrlWrapper, HttpError } = require('../helpers');
const { Diary } = require('../models/diary');

const getDiary = async (req, res) => {
  // const { _id: owner } = req.user;
  // const { date } = req.query;
  const { diaryEntryId } = req.params;

  // const filter = { date, owner };
  // const user = await Diary.findOne(filter);

  const diaryEntry = await Diary.findById(diaryEntryId)
    .populate('products')
    .populate('exercises');

  if (!diaryEntry) {
    throw HttpError(400, 'invalid diary ID');
  }

  res.status(200).json(diaryEntry);
};

const addProduct = async (req, res) => {
  const { productId, amount } = req.body;
  // const { _id } = req.user;
  const _id = '65a29de0fe46bdf5bbb31e17';

  const existingProduct = await Diary.findOne({
    owner: _id,
    'products.productId': productId,
  });
  if (existingProduct) {
    throw HttpError(400, 'product is already added');
  }

  const diaryEntry = await Diary.findOneAndUpdate(
    { owner: _id },
    {
      $push: {
        products: {
          productId,
          amount,
        },
      },
    },
    { new: true, upsert: true }
  );

  res.status(201).json(diaryEntry);
};

const deleteProduct = async (req, res) => {
  const { id } = req.body;
  // const { _id } = req.user;
  const _id = '65a29de0fe46bdf5bbb31e17';

  const diaryEntry = await Diary.findOneAndUpdate(
    { owner: _id, 'products.productId': id },
    {
      $pull: {
        products: { productId: id },
      },
    },
    { new: true }
  );

  if (!diaryEntry) {
    throw HttpError(404, 'Diary entry not found');
  }

  res.status(200).json('Product deleted successfully');
};

const addExercise = async (req, res) => {
  const { exerciseId } = req.body;
  // const { _id } = req.user;
  const _id = '65a29de0fe46bdf5bbb31e17';

  const existingExercise = await Diary.findOne({
    owner: _id,
    'exercises.exerciseId': exerciseId,
  });
  if (existingExercise) {
    throw HttpError(400, 'exercise is already added');
  }

  const diaryEntry = await Diary.findOneAndUpdate(
    { owner: _id },
    {
      $push: {
        exercises: {
          exerciseId,
        },
      },
    },
    { new: true, upsert: true }
  );

  res.status(201).json(diaryEntry);
};

const deleteExercise = async (req, res) => {
  const { id } = req.body;
  // const { _id } = req.user;
  const _id = '65a29de0fe46bdf5bbb31e17';

  const diaryEntry = await Diary.findOneAndUpdate(
    { owner: _id, 'exercises.exerciseId': id },
    {
      $pull: {
        exercises: { exerciseId: id },
      },
    },
    { new: true }
  );

  if (!diaryEntry) {
    throw HttpError(404, 'Diary entry not found');
  }

  res.status(200).json('Exercise deleted successfully');
};

module.exports = {
  getDiary: ctrlWrapper(getDiary),
  addProduct: ctrlWrapper(addProduct),
  deleteProduct: ctrlWrapper(deleteProduct),
  addExercise: ctrlWrapper(addExercise),
  deleteExercise: ctrlWrapper(deleteExercise),
};
