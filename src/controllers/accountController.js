const asyncMiddleware = require('../utilities/asyncMiddleware');

const joiHelper = require('../utilities/joiHelper');

const accounts = require('../models/accountModel');

const {
  createAccountSchema,
} = require('../utilities/validations');

const AccountControl = {
  getAll: asyncMiddleware(async (req, res, next) => {
    res.json({
      status: 200,
      data: accounts,
    });
  }),

  getOne: asyncMiddleware(async (req, res, next) => {
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(account => account.accountNumber == accountNumber);
    if (account[0] == undefined) {
      return next();
    }
    res.json({
      status: 200,
      data: account[0],
    });
  }),
  createAccount: asyncMiddleware(async (req, res, next) => {
    const validCreateAccount = await joiHelper(req, res, createAccountSchema);
    if (validCreateAccount.statusCode === 422) return;
    const {
      firstName,
      lastName,
      sex,
      dob,
      email,
      phone,
      type,
      currency,
    } = validCreateAccount;
    const account = {
      accountNumber: Math.floor(100000 + Math.random() * 9000000000),
      firstName,
      lastName,
      sex,
      dob,
      email,
      phone,
      type,
      currency,
    };
    account.openingBalance = 0.00;
    account.status = 'active';
    accounts.push(account);
    res.json({
      status: 200,
      data: account,
    });
  }),
  modifyAccount: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  deleteAccount: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
};

module.exports = AccountControl;
