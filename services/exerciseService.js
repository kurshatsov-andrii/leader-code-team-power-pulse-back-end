const ExerciseCategoriesModel = require('../models/exerciseCategoriesSchema');
const ExerciseModel = require('../models/exercisesSchema');

class ExerciseService {
  constructor() {
    this.categoriesModel = ExerciseCategoriesModel;
    this.exerciseModel = ExerciseModel;
  }

  correctRequests = {
    'Body parts': 'bodyPart',
    Muscles: 'target',
    Equipment: 'equipment',
  };

  fetchCategories = async params => {
    const filter = {};

    if (params) {
      filter.filter = params;
    }

    const result = await this.categoriesModel.find(filter);
    return result ?? null;
  };

  fetchExercises = async params => {
    const { filter, exerciseFilter } = params;
    const corectRequest = this.correctRequests[filter];

    return (
      (await this.exerciseModel.find({ [corectRequest]: exerciseFilter })) ??
      null
    );
  };
}

module.exports = new ExerciseService();