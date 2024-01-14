const { HttpError } = require('../helpers');
const ExerciseService = require('../services/exerciseService');

class ExersisesController {
  constructor() {
    this.service = ExerciseService;
  }
  
  bodyParts = 'Body parts';
  muscles = 'Muscles';
  equipment = 'Equipment';
  
  fetchExercises = async (req, res) => {
    const exercises = await this.service.fetchExercises()
  
    if (!exercises) {
      HttpError(400)
    }
  
    res.status(200).json({ data: exercises, length: exercises.length });
  };
  
  fetchAllCategories = async query => {
    const allCategories = await this.service.fetchCategories(query);

    if (!allCategories) {
      throw HttpError(400);
    }

    return allCategories;
  };

  fetchCategories = async (req, res) => {
    const categories = await this.fetchAllCategories();

    res.status(200).json({ data: categories, length: categories.length });
  };

  fetchBodyParts = async (req, res) => {
    const bodyParts = await this.fetchAllCategories(this.bodyParts);

    res.status(200).json({ data: bodyParts, length: bodyParts.length });
  };

  fetchMuscles = async (req, res) => {
    const muscles = await this.fetchAllCategories(this.muscles);

    res.status(200).json({ data: muscles, length: muscles.length });
  };

  fetchEquipment = async (req, res) => {
    const equipment = await this.fetchAllCategories(this.equipment);

    res.status(200).json({ data: equipment, length: equipment.length });
  };

}

module.exports = new ExersisesController();
