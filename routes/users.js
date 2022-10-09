const userRrouter = require('express').Router();

const {
  createUser,
  getUser,
  getAllUsers,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRrouter.get('/', getAllUsers);

userRrouter.get('/:userId', getUser);

userRrouter.post('/', createUser);

userRrouter.patch('/me', updateUserProfile);

userRrouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRrouter;
