const asyncMiddleware = require('../utilities/asyncMiddleware');

let users = require('../models/userModel');

const UserControl = {
  getAll: asyncMiddleware(async (req, res, next) => {
    res.json({
      status: 200,
      data: users,
    });
  }),

  getOne: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  signup: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  signin: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
};

module.exports = UserControl;