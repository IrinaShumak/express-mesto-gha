const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { // имя карточки
    type: String, // имя — это строка
    required: true, // оно должно быть у каждой карточки, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: { // ссылка на картинку
    type: String, // это строка
    required: true, // оно должно быть у каждой карточки, обязательное поле
    validate: {
      validator(v) { // проверка соответствия схеме электронной почты. v - значение свойства email
        return /^https?:\/\/(www.)?[\w-]+\..+#?$/.test(v);
      },
    },
  },
  owner: { // ссылка на модель автора карточки
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{ // список лайкнувших пост пользователей
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: { // дата создания
    type: Date, // тип - дата
    default: Date.now, // значение по умолчанию
  },
});

module.exports = mongoose.model('card', cardSchema);
