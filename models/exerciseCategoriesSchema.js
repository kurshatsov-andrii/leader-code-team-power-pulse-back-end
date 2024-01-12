const { Schema, model } = require('mongoose');

const exersiseCategoriesSchema = new Schema({
  filter: {
    type: String,
    enum: ['Body parts', 'Equipment', 'Muscles'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imgURL: {
    type: String,
    default:
      'https://imgs.search.brave.com/bYuCPDqmvJHc3v8A-2NhL5APFs9IECkeMZD4m9-uFPY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90YWN0/aWN1YS5jb20udWEv/Y29udGVudC9pbWFn/ZXMvNDEvMzkweDM5/MGw4MG1jMC85OTg3/MDUxMTkzNDcwOS5q/cGVn',
  },
});

module.exports = model('filter', exersiseCategoriesSchema);
