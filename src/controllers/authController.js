const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const asyncMiddleware = require('../utilities/asyncMiddleWare');

const joiHelper = require('../utilities/joiHelper');

const config = require('../utilities/config');

const {
  userSignupSchema,
  userSigninSchema,
} = require('../utilities/validations');

const users = require('../models/userModel');


const doToken = (user) => {
  const token = jwt.sign({
    username: user.email,
  },
  config.secret, {
    expiresIn: '24h', // expires in 24 hours
  });
  const data = {
    token,
    ...user,
  };
    // return the JWT token for the future API calls
  return data;
};

const AuthControl = {
 
  signup: asyncMiddleware(async (req, res, next) => {
    const validSignup = await joiHelper(req, res, userSignupSchema);
    if (validSignup.statusCode === 422) return;
    const { firstName, lastName, email, password, type, admin } = validSignup;
    const user = {
      id: Math.floor(100000 + Math.random() * 900000), firstName, lastName, email, type, admin };
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return next(new Error('Oops something went wrong!'));
      user.password = hash;
      users.unshift(user);
      // return the JWT token for the future API calls
      const tokenized = doToken(user);
      return res.json({
        status: 200,
        data: tokenized,
      });
    });
  }),
  signin: asyncMiddleware(async (req, res, next) => {
    const validSignin = await joiHelper(req, res, userSigninSchema);
    if (validSignin.statusCode === 422) return;
    const { email, password } = validSignin;
    const user = await users.find(theUser => theUser.email === email);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const tokenized = doToken(user);
          return res.json({
            status: 200,
            data: tokenized,
          });
        }
        res.status(400);
        return next(new Error('Invalid Password'));
      });
    } else {
      res.status(400);
      next(new Error('User does not exist'));
    }
  }),
};

module.exports = AuthControl;
