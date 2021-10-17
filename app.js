const express = require('express');
require('express-async-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const { errorHandler } = require('./utils/middlewares');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const managerRouter = require('./routes/manager');
const app = express();


const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'taskforce api',
      description: 'Employee Management API',
      contact: {
        name: 'Aron Aman'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Dev server'
      },
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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
