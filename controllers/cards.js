const Card = require('../models/card');

const ERROR_CODE_INCORRECT_DATA = 400;
const ERROR_CODE_MISSING_ENTRY = 404;
const ERROR_CODE_OTHER = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: 'Пост удалён' });
      } else { res.status(ERROR_CODE_MISSING_ENTRY).send({ message: 'Передан несуществующий _id карточки.' }); }
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Переданы некорректные данные для постановки лайка.' });
        return;
      }
      res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else { res.status(ERROR_CODE_MISSING_ENTRY).send({ message: 'Передан несуществующий _id карточки.' }); }
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Переданы некорректные данные для постановки лайка.' });
        return;
      }
      res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else { res.status(ERROR_CODE_MISSING_ENTRY).send({ message: 'Передан несуществующий _id карточки.' }); }
    })
    .catch((err) => {
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Переданы некорректные данные для снятия лайка.' });
        return;
      }
      res.status(ERROR_CODE_OTHER).send({ message: 'Произошла ошибка' });
    });
};
