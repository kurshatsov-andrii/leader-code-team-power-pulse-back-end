const { HttpError } = require('../helpers');
const ExerciseService = require('../services/exerciseService');

class ExersisesController {
  constructor() {
    this.service = ExerciseService;
  }

  pagination = (page, limit, arrData) => {
    const startIdx = (page - 1) * limit;
    const endIdx = page * limit;

    const data = arrData.slice(startIdx, endIdx);
    const dataLength = data.length;
    const dataMaxLength = arrData.length;
    const maxPages = Math.ceil(dataMaxLength / limit);

    return { data, dataLength, dataMaxLength, maxPages };
  };

  fetchAllCategories = async query => {
    const allCategories = await this.service.fetchCategories(query);

    if (!allCategories) {
      throw HttpError(400);
    }

    return allCategories;
  };

  filterExercises = async (req, res) => {
    const { params } = req;

    const specialExercises = await this.service.fetchExercises(params);

    if (!specialExercises) {
      HttpError(400);
    }

    res.status(200).json(specialExercises);
  };

  filterCategories = async (req, res) => {
    const {
      params,
      query: { limit = 10, page = 1 },
    } = req;

    const specialCategory = await this.service.fetchCategories(params.filter);

    if (!specialCategory) {
      HttpError(400);
    }

    const response = this.pagination(page, limit, specialCategory);

    res.status(200).json(response);
  };

  fetchCategories = async (req, res) => {
    const categories = await this.fetchAllCategories();
    res.status(200).json({ data: categories, length: categories.length });
  };
}

module.exports = new ExersisesController();
