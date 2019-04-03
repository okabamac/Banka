const express = require('express');

const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));



app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(express.json());

// app.use('/api/v1/user', userRoute);
// app.use('/api/v1/account', accountRoute);
// app.use('/api/v1/transaction', transactionRoute);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: error.status,
    error: error.message,
  });
});

module.exports = app;