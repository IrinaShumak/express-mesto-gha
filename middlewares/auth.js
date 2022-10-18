const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new AuthorizationError('Необходима авторизация');
    next(err);
  }

  const token = authorization.replace('Bearer ', '');
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
