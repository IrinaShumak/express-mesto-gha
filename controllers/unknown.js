const { ERROR_CODE_MISSING_ENTRY } = require('../utils.js/errors');

module.exports.showError = (req, res) => {
  res.status(ERROR_CODE_MISSING_ENTRY).send({ message: 'Запрашиваемый ресурс не найден' });
};
