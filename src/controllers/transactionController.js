import transactions from '../models/transactionModel';

import accounts from '../models/accountModel';

import joiHelper from '../utilities/joiHelper';

import {
  creditAccountSchema,
} from '../utilities/validations';


const createTransaction = (account, transactionType, accountNumber, amount) => ({
  transactionId: Math.floor(100000 + Math.random() * 900000),
  createdOn: new Date(Date.now()),
  transactionType,
  accountNumber,
  cashier: 15663,
  amount,
  currency: account.currency,
  oldBalance: account.balance,
  newBalance: transactionType === 'credit' ? account.balance + amount : account.balance - amount,
});

class TransactionControl {
  static async getAll(req, res, next) {
    if (req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can view all transactions'));
    }
    res.json({
      status: 200,
      data: transactions,
    });
  }

  static async getAllByClient(req, res, next) {
    if (req.decoded.type !== 'client') {
      res.status(401);
      return next(new Error('Only clients can access this route'));
    }
    try {
      const {
        accountNumber,
      } = req.params;
      const allTransactionsByClient = await transactions.filter(all => all.accountNumber == accountNumber);
      if (allTransactionsByClient.length == 0) return next();
      res.json({
        status: 200,
        data: allTransactionsByClient,
      });
    } catch (e) {
      next();
    }
  }

  static async getOne(req, res, next) {
    const {
      transactionId,
    } = req.params;
    const transaction = await transactions.filter(theTransaction => theTransaction.id == transactionId)[0];
    if (!transaction) return next();
    res.json({
      status: 200,
      data: transaction,
    });
  }

  static async debit(req, res, next) {
    if (req.decoded.type !== 'staff') {
      res.status(401);
      return next(new Error('Only staff cand debit'));
    }
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) return next();

    const validCreditAccount = await joiHelper(req, res, creditAccountSchema);
    if (validCreditAccount.statusCode === 422) return;

    const type = 'debit';
    const {
      amount,
    } = validCreditAccount;
    if (account.balance <= amount) {
      res.status(400);
      return next(new Error('Insufficient fund'));
    }
    const transaction = createTransaction(account, type, accountNumber, amount);
    transactions.unshift(transaction);
    account.balance = transaction.newBalance;
    return res.json({
      status: 200,
      data: transaction,
    });
  }

  static async credit(req, res, next) {
    if (req.decoded.type !== 'staff') {
      res.status(401);
      return next(new Error('Only staff can credit'));
    }
   const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) return next();

    const validCreditAccount = await joiHelper(req, res, creditAccountSchema);
    if (validCreditAccount.statusCode === 422) return;
    const type = 'credit';
    const {
      amount,
    } = validCreditAccount;
    const transaction = createTransaction(account, type, accountNumber, amount);
    transactions.unshift(transaction);
    account.balance = transaction.newBalance;
    return res.json({
      status: 200,
      data: transaction,
    });
  }
}
export default TransactionControl;
