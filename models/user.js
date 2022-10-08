const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // имя пользователя
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: { // информация о пользователе
    type: String, // это строка
    required: true, // оно должно быть у каждого пользователя, обязательное поле
    minlength: 2, // минимальная длина  — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  avatar: { // ссылка на аватарку
    type: String, // это строка
    required: true, // она должна быть у каждого пользователя, обязательное поле
  },
});
module.exports = mongoose.model('user', userSchema);
