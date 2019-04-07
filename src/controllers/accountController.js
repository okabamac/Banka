const asyncMiddleware = require('../utilities/asyncMiddleware');

const joiHelper = require('../utilities/joiHelper');

const accounts = require('../models/accountModel');

const {
  createAccountSchema, patchAccountSchema,
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
    const account = await accounts.filter(account => account.accountNumber == accountNumber)[0];
    if (!account) {
      return next();
    }
    res.json({
      status: 200,
      data: account,
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
    accounts.unshift(account);
    res.json({
      status: 200,
      data: account,
    });
  }),
  modifyAccount: asyncMiddleware(async (req, res, next) => {
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(account => account.accountNumber == accountNumber)[0];
    if (!account) {
      return next();
    }
    const validPatch = await joiHelper(req, res, patchAccountSchema);
    if (validPatch.statusCode === 422) return;
    const {
      status,
    } = validPatch;
    account.status = validPatch.status;
    return res.json({
      status: 200,
      data: {
        accountNumber,
        status,
      },
    });
  }),
  deleteAccount: asyncMiddleware(async (req, res, next) => {
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(account => account.accountNumber == accountNumber)[0];
    if (!account) {
      return next();
    }
    const index = accounts.indexOf(account);
    accounts.splice(index, 1);
    res.json({
      status: 200,
      message: 'Account successfully deleted',
    });
  }),
};

module.exports = AccountControl;
