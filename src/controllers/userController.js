const bcrypt = require('bcrypt');
const asyncMiddleware = require('../utilities/asyncMiddleware');
const {
  userSignupSchema
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
    const validatedCedentials = await userSignupSchema.validate(req.body, {
      abortEarly: false,
    });
    const {
      firstName,
      lastName,
      email,
      password,
      type,
      admin,
    } = validatedCedentials;
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
        return next();
      }
      user.password = hash;
      users.push(user);
      res.json({
        status: 200,
        data: user,
      });
    });
  }),
  signin: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
};

module.exports = UserControl;