const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard,
  deleteCard,
  getAllCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getAllCards);

cardRouter.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }).unknown(true),
}), deleteCard);

cardRouter.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), createCard);

cardRouter.put('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }).unknown(true),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }).unknown(true),
}), dislikeCard);

module.exports = cardRouter;
