const { ctrlWrapper, HttpError } = require('../helpers');
const { Diary } = require('../models/diary');

const getDiary = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.body;

  const diaryEntry = await Diary.findOne({
    owner,
    date,
  })
    .populate(
      'products.productId',
      'weight calories category title groupBloodNotAllowed'
    )
    .populate(
      'exercises.exerciseId',
      'bodyPart equipment gifUrl name target burnedCalories time'
    );

  if (!diaryEntry) {
    throw HttpError(400, 'Diary entry not found');
  }

  res.status(200).json(diaryEntry);
};

const addProduct = async (req, res) => {
  const { productId, amount, date } = req.body;
  const { _id: owner } = req.user;

  let diaryEntry = await Diary.findOne({
    owner,
    date,
  });

  if (!diaryEntry) {
    diaryEntry = new Diary({
      owner,
      date,
    });
  }

  const existingProduct = diaryEntry.products.find(
    product => product.productId.toString() === productId
  );

  if (existingProduct) {
    throw HttpError(400, 'product is already added');
  }

  diaryEntry.products.push({
    productId,
    amount,
  });

  diaryEntry = await diaryEntry.save();

  res.status(201).json(diaryEntry);
};

const deleteProduct = async (req, res) => {
  const { id, date } = req.body;
  const { _id: owner } = req.user;

  const diaryEntry = await Diary.findOneAndUpdate(
    {
      owner,
      date,
      'products.productId': id,
    },
    {
      $pull: {
        products: { productId: id },
      },
    },
    { new: true }
  );

  if (!diaryEntry) {
    throw HttpError(404, 'product ID not found in this collection');
  }

  res.status(200).json('Product deleted successfully');
};

const addExercise = async (req, res) => {
  const { exerciseId, date } = req.body;
  const { _id: owner } = req.user;

  let diaryEntry = await Diary.findOne({
    owner,
    date,
  });

  if (!diaryEntry) {
    diaryEntry = new Diary({
      owner,
      date,
    });
  }

  const existingExercise = diaryEntry.exercises.find(
    exercise => exercise.exerciseId.toString() === exerciseId
  );

  if (existingExercise) {
    throw HttpError(400, 'exercise is already added');
  }

  diaryEntry.exercises.push({
    exerciseId,
  });

  diaryEntry = await diaryEntry.save();

  res.status(201).json(diaryEntry);
};

const deleteExercise = async (req, res) => {
  const { id, date } = req.body;
  const { _id: owner } = req.user;

  const diaryEntry = await Diary.findOneAndUpdate(
    {
      owner,
      date,
      'exercises.exerciseId': id,
    },
    {
      $pull: {
        exercises: { exerciseId: id },
      },
    },
    { new: true }
  );

  if (!diaryEntry) {
    throw HttpError(404, 'exercise ID not found in this collection');
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
