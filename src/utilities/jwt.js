//Credit to https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4

import jwt from 'jsonwebtoken';

import config from '../../config';

const checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
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
  } else {
    return res.json({
      status: 400,
      error: 'Auth token is not supplied',
    });
  }
};

export default {
  checkToken,
};
