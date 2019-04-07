const asyncMiddleware = require('../utilities/asyncMiddleware');

const transactions = require('../models/transactionModel');

const accounts = require('../models/accountModel');

const joiHelper = require('../utilities/joiHelper');

const {
  creditAccountSchema,
} = require('../utilities/validations');

const TransactionControl = {
  getAll: asyncMiddleware(async (req, res, next) => {
    res.json({
      status: 200,
      data: transactions,
    });
  }),

  getOne: asyncMiddleware(async (req, res, next) => {
    const {
      transactionId,
    } = req.params;
    const transaction = await transactions.filter(transaction => transaction.id == transactionId)[0];
    if (!transaction) return next();
    res.json({
      status: 200,
      data: transaction,
    });
  }),

  debit: asyncMiddleware(async (req, res, next) => {
    const {
      accountNumber,
    } = req.params;

    const account = await accounts.filter(account => account.accountNumber == accountNumber)[0];
    if (!account) {
      return next();
    }

    const validCreditAccount = await joiHelper(req, res, creditAccountSchema);
    if (validCreditAccount.statusCode === 422) return;

    const {
      amount,
      transactionType,
    } = validCreditAccount;

    const transaction = {
      transactionId: Math.floor(100000 + Math.random() * 900000),
      createdOn: new Date(Date.now()),
      transactionType,
      accountNumber,
      cashier: 15663,
      amount,
      currency: account.currency,
      oldBalance: account.balance,
      newBalance: account.balance - amount,
    };

    transactions.unshift(transaction);
    account.balance = transaction.newBalance;
    return res.json({
      status: 200,
      data: transaction,
    });
  }),
  credit: asyncMiddleware(async (req, res, next) => {
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) return next();
    
    const validCreditAccount = await joiHelper(req, res, creditAccountSchema);
    if (validCreditAccount.statusCode === 422) return;

    const {
      amount,
      transactionType,
    } = validCreditAccount;

    const transaction = {
      transactionId: Math.floor(100000 + Math.random() * 900000),
      createdOn: new Date(Date.now()),
      transactionType,
      accountNumber,
      cashier: 15663,
      amount,
      currency: account.currency,
      oldBalance: account.balance,
      newBalance: account.balance + amount,
    };

    transactions.unshift(transaction);
    account.balance = transaction.newBalance;
    return res.json({
      status: 200,
      data: transaction,
    });
  }),

};

module.exports = TransactionControl;
