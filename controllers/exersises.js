const ExerciseCategoriesModel = require('../models/exerciseCategoriesSchema');
const ExercisesModel = require('../models/exercisesSchema');

class ExersisesController {
  fetchExerciseCategories = async (req, res) => {
    const categories = await ExerciseCategoriesModel.find({}).lean();

    if (!categories) {
      res.status(500);
      throw new Error('Server error');
    }

    res.status(200).json({ data: categories, length: categories.length });
  };

  fetchExercises = async (req, res) => {
    const exercises = await ExercisesModel.find({}).lean();

    if (!exercises) {
      res.status(500);
      throw new Error('Server error');
    }

    res.status(200).json({ data: exercises, length: exercises.length });
  };
}

module.exports = new ExersisesController();
