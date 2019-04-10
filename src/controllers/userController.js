const asyncMiddleware = require('../utilities/asyncMiddleWare');

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
    const user = await users.filter(theUser => theUser.id == userId)[0];
    if (!user) return next();
    return res.json({
      status: 200,
      data: user,
    });
  }),
};

module.exports = UserControl;