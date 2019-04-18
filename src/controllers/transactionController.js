import transactions from '../models/transactionModel';

import accounts from '../models/accountModel';

import joiHelper from '../utilities/joiHelper';

import {
  creditAccountSchema,
} from '../utilities/validations';


const createTransaction = (account, type, accountNumber, amount) => ({
  transactionId: Math.floor(100000 + Math.random() * 900000),
  createdOn: new Date(Date.now()),
  transactionType: type,
  accountNumber,
  cashier: 15663,
  amount,
  currency: account.currency,
  oldBalance: account.balance,
});

class TransactionControl {
  static async getAll(req, res, next) {
    res.json({
      status: 200,
      data: transactions,
    });
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
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) return next();

    const validCreditAccount = await joiHelper(req, res, creditAccountSchema);
    if (validCreditAccount.statusCode === 422) return;

    const {
      amount,
    } = validCreditAccount;
    const type = 'debit';
    const transaction = createTransaction(account, type, accountNumber, amount);
    transaction.newBalance = account.balance - amount;

    transactions.unshift(transaction);
    account.balance = transaction.newBalance;
    return res.json({
      status: 200,
      data: transaction,
    });
  }

  static async credit(req, res, next) {
    const {
      accountNumber,
    } = req.params;
    const account = await accounts.filter(theAccount => theAccount.accountNumber == accountNumber)[0];
    if (!account) return next();

    const validCreditAccount = joiHelper(req, res, creditAccountSchema);
    if (validCreditAccount.statusCode === 422) return;
    const type = 'credit';
    const {
      amount,
    } = validCreditAccount;
    const transaction = createTransaction(account, type, accountNumber, amount);
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
