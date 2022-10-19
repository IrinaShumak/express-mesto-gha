const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const IncorrectInputError = require('../errors/incorrect-input-err');
const DublicationError = require('../errors/dublication-err');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      _id: user._id,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
      // Возникает, если мы попытаемся записать данные в базу, не соответствущие схеме,
      // например, имя юзера меньше 2 или больше 30 знаков
        next(new IncorrectInputError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new DublicationError('Такая почта уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token })
        .end();
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, criteria, next) => {
  User.findById(criteria) // userId берём из адреса запроса GET /users/:userId
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else { next(new NotFoundError('Пользователь с указанным _id не найден.')); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectInputError('Переданы некорректные данные при запросе.'));
      }
      next(err);
    });
};

module.exports.getOtherUser = (req, res, next) => {
  const criteria = req.params.userId; // userId берём из адреса запроса GET /users/:userId
  getUser(req, res, criteria, next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const criteria = req.user._id;
  getUser(req, res, criteria, next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }, // обработчик then получит на вход обновлённую запись
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectInputError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }, // обработчик then получит на вход обновлённую запись
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectInputError('Переданы некорректные данные при обновлении аватара.'));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      next(err);
    });
};
