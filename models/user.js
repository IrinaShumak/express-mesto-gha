const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthorizationError = require('../errors/authorization-err');

const userSchema = new mongoose.Schema({
  name: { // имя пользователя
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Жак-Ив Кусто',
  },
  about: { // информация о пользователе
    type: String, // это строка
    minlength: 2, // минимальная длина  — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Исследователь',
  },
  avatar: { // ссылка на аватарку
    type: String, // это строка
    validate: {
      validator(v) { // проверка соответствия схеме электронной почты. v - значение свойства email
        return /^https?:\/\/(www.)?[\w-]+\..+#?$/.test(v);
      },
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: { // почта пользователя для регистрации
    type: String, // это строка
    required: true, // она должна быть у каждого пользователя, обязательное поле
    unique: true, // почта уникальна, не может быть 2х пользователей с одинаковой почтой
    validate: {
      validator(v) { // проверка соответствия схеме электронной почты. v - значение свойства email
        return validator.isEmail(v); // если адрес не соответствует, вернётся false
      },
    },
  },
  password: {
    type: String, // это строка
    required: true, // пароль должен быть у каждого пользователя, обязательное поле
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);
