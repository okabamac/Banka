const bcrypt = require('bcrypt');
const asyncMiddleware = require('../utilities/asyncMiddleware');
const {
  userSignupSchema,
  userSigninSchema,
} = require('../utilities/validations');

const users = require('../models/userModel');

const UserControl = {
  getAll: asyncMiddleware(async (req, res, next) => {
    res.json({
      status: 200,
      data: users,
    });
  }),

  getOne: asyncMiddleware(async (req, res, next) => {
    const {
      userId,
    } = req.params;
    const user = await users.filter(user => user.id == userId);
    if (user[0] == undefined) {
      return next();
    }
    res.json({
      status: 200,
      data: user[0],
    });
  }),

  signup: asyncMiddleware(async (req, res, next) => {
    const validSignup = await userSignupSchema.validate(req.body, {
      abortEarly: false,
    });
    const {
      firstName,
      lastName,
      email,
      password,
      type,
      admin,
    } = validSignup;
    const user = {
      id: Math.floor(100000 + Math.random() * 900000),
      firstName,
      lastName,
      email,
      type,
      admin,
    };
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return next(new Error('Oops something went wrong!'));
      }
      user.password = hash;
      users.push(user);
      res.json({
        status: 200,
        data: user,
      });
    });
  }),
  signin: asyncMiddleware(async (req, res, next) => {
    const validSignin = await userSigninSchema.validate(req.body, {
      abortEarly: false,
    });
    const {
      email,
      password,
    } = validSignin;
    const user = await users.find(user => user.email === email);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          return res.json({
            status: 200,
            data: user,
          });
        }
        res.status(400);
        next(new Error('Invalid Password'));
      });
    } else {
      res.status(400);
      next(new Error('User does not exist'));
    }
  }),
};

module.exports = UserControl;
