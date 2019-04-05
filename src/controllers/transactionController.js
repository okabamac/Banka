const asyncMiddleware = require('../utilities/asyncMiddleware');

const transactions = require('../models/transactionModel');

const TransactionControl = {
  getAll: asyncMiddleware(async (req, res, next) => {
    res.json({
      status: 200,
      data: transactions,
    });
  }),

  getOne: asyncMiddleware(async (req, res, next) => {
    const {transactionId} = req.params;
    let transaction = await transactions.filter(transaction => transaction.id == transactionId);
    if (transaction[0] == undefined) {
      return next();
    }
    res.json({
      status: 200,
      data: transaction[0],
    });
  }),

  debit: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  credit: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
};

module.exports = TransactionControl;
