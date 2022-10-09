module.exports.showError = (req, res) => {
  const ERROR_CODE_MISSING_ENTRY = 404;
  res.status(ERROR_CODE_MISSING_ENTRY).send({ message: 'Запрашиваемый ресурс не найден' });
};
