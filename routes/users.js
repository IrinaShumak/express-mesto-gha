const userRrouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getOtherUser,
  getCurrentUser,
  getAllUsers,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRrouter.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getAllUsers);

userRrouter.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getCurrentUser);

userRrouter.get('/:userId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }).unknown(true),
}), getOtherUser);

userRrouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

userRrouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^https?:\/\/(www.)?[\w-]+\..+#?$/),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), updateUserAvatar);

module.exports = userRrouter;
