const asyncMiddleware = require('../utilities/asyncMiddleware');

const accounts = require('../models/accountModel');


const AccountControl = {
  getAll: asyncMiddleware(async (req, res, next) => {
    res.json({
      status: 200,
      data: accounts,
    });
  }),
  getOne: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  createAccount: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  modifyAccount: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  deleteAccount: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
};

module.exports = AccountControl;
