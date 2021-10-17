const express = require('express');
require('express-async-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { errorHandler } = require('./utils/middlewares');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const managerRouter = require('./routes/manager');
const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  autoIndex: true
})
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((err) => {
    console.log('failed to connect to db:', err.message);
  });

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/manage', managerRouter);
app.use(errorHandler);

module.exports = app;
