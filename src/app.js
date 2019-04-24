import express from 'express';

import morgan from 'morgan';

import cors from 'cors';

import userRoute from './routes/userRoute';

import authRoute from './routes/authRoute';

import accountRoute from './routes/accountRoute';

import transactionRoute from './routes/transactionRoute';

const app = express();

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


export default app;
