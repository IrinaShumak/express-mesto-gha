const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-err');

module.exports = (req, res, next) => {
  const { Authorization } = req.headers;

  if (!Authorization || !Authorization.startsWith('Bearer ')) {
    const err = new AuthorizationError('Необходима авторизация');
    next(err);
  }

  const token = Authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    const err = new AuthorizationError('Необходима авторизация');
    next(err);
  }

  req.user = payload;

  next();
};
