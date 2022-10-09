const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRrouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const unknownRouter = require('./routes/unknown');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {});

app.use((req, res, next) => {
  req.user = {
    _id: '6341a8efe2d80ef9ae20b2de',
  };

  next();
});

app.use('/users', userRrouter);

app.use('/cards', cardRouter);

app.use('*', unknownRouter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
