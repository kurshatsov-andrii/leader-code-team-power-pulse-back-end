const { Schema, model } = require('mongoose');

const exersisesSchema = new Schema({
  bodyPart: { type: String, required: true },
  equipment: { type: String, required: true },
  gifUrl: {
    type: String,
    default: 'https://media.giphy.com/media/BBkKEBJkmFbTG/giphy.gif',
  },
  name: { type: String, required: true },
  target: { type: String, required: true },
  burnedCalories: { type: Number, required: true },
  time: { type: Number, required: true },
});

module.exports = model('exercises', exersisesSchema);
