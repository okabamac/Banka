const asyncMiddleware = require('../utilities/asyncMiddleware');

const accounts = require('../models/accountModel');


const AccountControl = {
  getAll: asyncMiddleware(async (req, res, next) => {
    res.json({
      status: 200,
      data: accounts,
    });
  }),

  getOne: asyncMiddleware(async (req, res, next) => {
    const {accountNumber} = req.params;
    const account = await accounts.filter(account => account.accountNumber == accountNumber);
    if (account[0] == undefined) {
      return next();
    }
    res.json({
      status: 200,
      data: account[0],
    });
  }),
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