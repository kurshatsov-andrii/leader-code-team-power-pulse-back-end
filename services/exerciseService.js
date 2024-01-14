const ExerciseCategoriesModel = require('../models/exerciseCategoriesSchema');
const ExerciseModel = require('../models/exercisesSchema');

class ExerciseService {
  constructor() {
    this.categoriesModel = ExerciseCategoriesModel;
    this.exerciseModel = ExerciseModel;
  }

  fetchCategories = async query => {
    const filter = {};

    if (query) {
      filter.filter = query;
    }

    return (await this.categoriesModel.find(filter)) ?? null;
  };

  fetchExercises = async query => {
    const filter = {};

    if (query) {
      filter.filter = query;
    }
    return (await this.exerciseModel.find(filter)) ?? null;
  };
}

module.exports = new ExerciseService();
