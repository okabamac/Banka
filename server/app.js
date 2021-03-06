import express from 'express';

import morgan from 'morgan';

import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import userRoute from '../src/routes/userRoute';

import authRoute from '../src/routes/authRoute';

import accountRoute from '../src/routes/accountRoute';

import transactionRoute from '../src/routes/transactionRoute';


import swaggerDocument from './swagger.json';

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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
