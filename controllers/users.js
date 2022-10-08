const User = require('../models/user');

const ERROR_CODE_INCORRECT_DATA = 400;
const ERROR_CODE_MISSING_ENTRY = 404;
const ERROR_CODE_OTHER = 500;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else { res.status(ERROR_CODE_MISSING_ENTRY).send({ message: 'Пользователь с указанным _id не найден.' }); }
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }, // обработчик then получит на вход обновлённую запись
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_MISSING_ENTRY).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }, // обработчик then получит на вход обновлённую запись
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_MISSING_ENTRY).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
    });
};
