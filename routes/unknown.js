const unknownRouter = require('express').Router();
const { showError } = require('../controllers/unknown');

unknownRouter.all('*', showError);

module.exports = unknownRouter;
