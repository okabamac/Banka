const asyncMiddleware = require('../utilities/asyncMiddleware');

let users = require('../models/userModel');

const UserControl = {
  getAll: asyncMiddleware(async (req, res, next) => {
    res.json({
      status: 200,
      data: users,
    });
  }),

  getOne: asyncMiddleware(async (req, res, next) => {
    const {userId} = req.params;
    let user = await users.filter(user => user.id == userId);
    if (user[0] == undefined) {
      return next();
    }
    res.json({
      status: 200,
      data: user[0],
    });
  }),

  signup: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  signin: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
};

module.exports = UserControl;