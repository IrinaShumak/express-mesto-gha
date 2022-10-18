const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const IncorrectInputError = require('../errors/incorrect-input-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectInputError('Переданы некорректные данные при создании карточки.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (card.owner._id === req.user._id) {
          card.delete()
            .then(() => res.send({ data: 'Пост удалён' }));
        } else {
          throw new ForbiddenError('Нельзя удалить чужую карточку');
        }
      } else { throw new NotFoundError('Передан несуществующий _id карточки.'); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectInputError('Переданы некорректные данные для удаления карточки.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else { throw new NotFoundError('Передан несуществующий _id карточки.'); }
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        throw new IncorrectInputError('Переданы некорректные данные для постановки лайка.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else { throw new NotFoundError('Передан несуществующий _id карточки.'); }
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        throw new IncorrectInputError('Переданы некорректные данные для снятия лайка.');
      }
      next(err);
    })
    .catch(next);
};
