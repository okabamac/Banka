const asyncMiddleware = require('../utilities/asyncMiddleware');

const transactions = require('../models/transactionModel');

const TransactionControl = {
  getAll: asyncMiddleware(async (req, res, next) => {
    res.json({
      status: 200,
      data: transactions,
    });
  }),
  getOne: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  debit: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
  credit: async (req, res, next) => {
    console.log('zzzzzzzzzzzzzzzz');
  },
};

module.exports = TransactionControl;
