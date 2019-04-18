
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
});

class TransactionControl {
  static async getAll (req, res, next) {
    res.json({
      status: 200,
      data: transactions,
    });
  }

  static async getOne (req, res, next) {
    const {
      transactionId,
    } = req.params;
      if (typeof transactionId != 'number') {
        res.status(400);
        return next(new Error('ID must be an integer'));
      }
    const transaction = await transactions.filter(transaction => transaction.id == transactionId)[0];
    if (!transaction) return next();
    res.json({
      status: 200,
      data: transaction,
    });
  }

  static async debit (req, res, next) {
    const { accountNumber } = req.params;
  if (typeof accountNumber != 'number') {
    res.status(400);
    return next(new Error('Account Number must be an integer'));
  }
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) return next();

    const validCreditAccount = await joiHelper(req, res, creditAccountSchema);
    if (validCreditAccount.statusCode === 422) return;

    const {
      amount,
      transactionType,
    } = validCreditAccount;

    const transaction = createTransaction(account, transactionType, accountNumber, amount);
    transaction.newBalance = account.balance - amount;

    transactions.unshift(transaction);
    account.balance = transaction.newBalance;
    return res.json({
      status: 200,
      data: transaction,
    });
  }

  static async credit (req, res, next) {
    const {
      accountNumber,
    } = req.params;
      if (typeof accountNumber != 'number') {
        res.status(400);
        return next(new Error('Account Number must be an integer'));
      }
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) return next();

    const validCreditAccount = joiHelper(req, res, creditAccountSchema);
    if (validCreditAccount.statusCode === 422) return;

    const {
      amount,
      transactionType,
    } = validCreditAccount;

    const transaction = await createTransaction(account, transactionType, accountNumber, amount);
    transaction.newBalance = account.balance + amount;
    transactions.unshift(transaction);
    account.balance = transaction.newBalance;
    return res.json({
      status: 200,
      data: transaction,
    });
  }
}
export default TransactionControl;
