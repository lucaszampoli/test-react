const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const titleValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Titulo não deve exceder  {ARGS[1]} caracteres.'
  })
];

const contentValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Content não deve exceder  {ARGS[1]} caracteres.'
  })
];

const dateValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Data invalida'
  })
];

// Definir o database model
const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required.'],
    validate: titleValidator
  },
  content: {
    type: String,
    required: [true, 'content is required.'],
    validate: contentValidator
  },
  date: {
    type: String,
    required: [true, 'date is required.'],
    validate: dateValidator
  }
});

// Usar o plugin validador exclusivo
NoticeSchema.plugin(unique, { message: 'Esse {PATH} já foi usado.' });

const Notice = module.exports = mongoose.model('notice', NoticeSchema);
