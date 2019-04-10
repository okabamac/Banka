const express = require('express');

const morgan = require('morgan');

const app = express();

const cors = require('cors');

const userRoute = require('./src/routes/userRoute');

const authRoute = require('./src/routes/authRoute');

const accountRoute = require('./src/routes/accountRoute');

const transactionRoute = require('./src/routes/transactionRoute');

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/accounts', accountRoute);
app.use('/api/v1/transactions', transactionRoute);


app.use((req, res, next) => {
  const error = new Error('Not found');
  res.statusCode = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    status: res.statusCode,
    error: error.message,
  });
});


module.exports = app;
