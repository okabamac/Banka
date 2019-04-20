// Credit to https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4

import jwt from 'jsonwebtoken';

import {
  jwt_secret,
} from '../../config';

const checkToken = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
   return next();
  }
  let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
  if (!token) {
    return res.json({
      status: 401,
      error: 'Auth token is not supplied',
    });
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, jwt_secret, (err, decoded) => {
      if (err) {
        res.status(422);
        return res.json({
          status: 422,
          error: 'Token is not valid',
        });
      }
      req.decoded = decoded;
      next();

    });
  }
};
module.exports = checkToken;
