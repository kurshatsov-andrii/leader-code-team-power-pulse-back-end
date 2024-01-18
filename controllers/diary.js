const { ctrlWrapper, HttpError } = require('../helpers');
const { Diary } = require('../models/diary');
const { Product } = require('../models/products');
const Exercise = require('../models/exercisesSchema');

const getDiary = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.params;
  console.log('date', date);

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
  const { productId, date, amount } = req.body;
  const { _id: owner } = req.user;

  const productInfo = await Product.findById(productId);

  if (!productInfo) {
    throw HttpError(404, 'Product info not found');
  }

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

  const calories = Math.round(
    (productInfo.calories * amount) / productInfo.weight
  );

  const existingProduct = diaryEntry.products.find(
    product => product.productId.toString() === productId
  );

  if (existingProduct) {
    existingProduct.amount += Number(amount);
    existingProduct.calories += calories;

    diaryEntry.consumedCalories += calories;
  } else {
    diaryEntry.products.push({
      productId,
      amount,
      calories,
    });

    diaryEntry.consumedCalories += calories;
  }

  diaryEntry = await diaryEntry.save();

  res.status(201).json(diaryEntry);
};

const deleteProduct = async (req, res) => {
  const { id, date } = req.body;
  const { _id: owner } = req.user;

  const diaryEntry = await Diary.findOne({
    owner,
    date,
    'products.productId': id,
  });

  if (!diaryEntry) {
    throw HttpError(404, 'Product was not found in this collection');
  }

  const deletedProduct = diaryEntry.products.find(
    product => product.productId.toString() === id
  );

  diaryEntry.consumedCalories -= deletedProduct.calories;

  diaryEntry.products = diaryEntry.products.filter(
    product => product.productId.toString() !== id
  );

  await diaryEntry.save();

  res
    .status(200)
    .json(
      `Product deleted successfully. Total consumed calories: ${diaryEntry.consumedCalories}`
    );
};

const addExercise = async (req, res) => {
  const { exerciseId, date, time } = req.body;
  const { _id: owner } = req.user;

  const exerciseInfo = await Exercise.findById(exerciseId);

  if (!exerciseInfo) {
    throw HttpError(404, 'Exercise info not found');
  }

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

  const caloriesBurnedWithExercise = Math.round(
    (exerciseInfo.burnedCalories * time) / (exerciseInfo.time * 60)
  );

  const existingExercise = diaryEntry.exercises.find(
    exercise => exercise.exerciseId.toString() === exerciseId
  );

  if (existingExercise) {
    existingExercise.time += Number(time);
    existingExercise.calories += caloriesBurnedWithExercise;

    diaryEntry.burnedCalories += caloriesBurnedWithExercise;
    diaryEntry.physicalActivityTimeDone += Number(time);
  } else {
    diaryEntry.exercises.push({
      exerciseId,
      time,
      calories: caloriesBurnedWithExercise,
    });

    diaryEntry.burnedCalories += caloriesBurnedWithExercise;
    diaryEntry.physicalActivityTimeDone += Number(time);
  }

  diaryEntry = await diaryEntry.save();

  res.status(201).json(diaryEntry);
};

const deleteExercise = async (req, res) => {
  const { id, date } = req.body;
  const { _id: owner } = req.user;

  const diaryEntry = await Diary.findOne({
    owner,
    date,
    'exercises.exerciseId': id,
  });

  if (!diaryEntry) {
    throw HttpError(404, 'Exercise was not found in this collection');
  }

  const deletedExercise = diaryEntry.exercises.find(
    exercise => exercise.exerciseId.toString() === id
  );

  diaryEntry.burnedCalories -= deletedExercise.calories;
  diaryEntry.physicalActivityTimeDone -= deletedExercise.time;

  diaryEntry.exercises = diaryEntry.exercises.filter(
    exercise => exercise.exerciseId.toString() !== id
  );

  await diaryEntry.save();

  res
    .status(200)
    .json(
      `Exercise deleted successfully. Total exercise time: ${diaryEntry.physicalActivityTimeDone}. Total burned calories: ${diaryEntry.burnedCalories}`
    );
};

module.exports = {
  getDiary: ctrlWrapper(getDiary),
  addProduct: ctrlWrapper(addProduct),
  deleteProduct: ctrlWrapper(deleteProduct),
  addExercise: ctrlWrapper(addExercise),
  deleteExercise: ctrlWrapper(deleteExercise),
};
