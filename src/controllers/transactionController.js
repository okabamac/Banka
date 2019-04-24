import moment from 'moment';

import db from '../models/index';

import joiHelper from '../utilities/joiHelper';

import {
  creditAccountSchema,
} from '../utilities/validations';

class TransactionControl {
  static async getAll(req, res, next) {
    if (req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can view all transactions'));
    }
    try {
      const {
        rows,
      } = await db.query('SELECT * FROM transactions');
      res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      res.status(500);
      next(new Error('Something went wrong, please try again later'));
    }
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
      const {
        rows,
      } = await db.query('SELECT * FROM transactions WHERE id=$1', [accountNumber]);
      if (!rows[0]) return next();
      res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      next();
    }
  }

  static async getOne(req, res, next) {
    const {
      transactionId,
    } = req.params;
    try {
      const {
        rows,
      } = await db.query('SELECT * FROM transactions WHERE id=$1', [transactionId]);
      if (!rows[0]) return next();
      res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      res.status(404);
      next(new Error('Invalid ID'));
    }
  }

  static async debit(req, res, next) {
    if (req.decoded.type !== 'staff') {
      res.status(401);
      return next(new Error('Only staff cand debit'));
    }
    const {
      accountNumber,
    } = req.params;

    try {
      const account = await db.query('SELECT * FROM accounts WHERE accountNumber=$1', [accountNumber]);
      if (!account.rows[0]) return next();
      const validCreditAccount = await joiHelper(req, res, creditAccountSchema);
      if (validCreditAccount.statusCode === 422) return;
      const {
        amount,
      } = validCreditAccount;
      if (account.rows[0].balance <= amount) {
        res.status(400);
        return next(new Error('Insufficient fund'));
      }
      const text = `INSERT INTO transactions(id, createdOn, type, accountNumber, amount, cashier, oldBalance, newBalance) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`;
      const values = [
        5,
        moment(new Date()),
        'debit',
        account.rows[0].accountnumber,
        amount,
        27,
        account.rows[0].balance,
        account.rows[0].balance - amount,
      ];
      try {
        await db.query('UPDATE accounts SET balance=$1 WHERE accountNumber=$2', [account.rows[0].balance - amount, accountNumber]);
        const {
          rows,
        } = await db.query(text, values);
        res.json({
          status: 200,
          data: rows,
        });
      } catch (e) {
        res.status(500);
        next(e);
      }
    } catch (e) {
      next(e);
    }
  }

  static async credit(req, res, next) {
    if (req.decoded.type !== 'staff') {
      res.status(401);
      return next(new Error('Only staff cand debit'));
    }
    const {
      accountNumber,
    } = req.params;
    try {
      const account = await db.query('SELECT * FROM accounts WHERE accountNumber=$1', [accountNumber]);
      if (!account.rows[0]) return next();
      const validCreditAccount = await joiHelper(req, res, creditAccountSchema);
      if (validCreditAccount.statusCode === 422) return;
      const {
        amount,
      } = validCreditAccount;
      const text = `INSERT INTO transactions(id, createdOn, type, accountNumber, amount, cashier, oldBalance, newBalance) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`;
      const values = [
        5,
        moment(new Date()),
        'debit',
        account.rows[0].accountnumber,
        amount,
        27,
        account.rows[0].balance,
        account.rows[0].balance - amount,
      ];
      try {
        await db.query('UPDATE accounts SET balance=$1 WHERE accountNumber=$2', [account.rows[0].balance + amount, accountNumber]);
        const {
          rows,
        } = await db.query(text, values);
        res.json({
          status: 200,
          data: rows,
        });
      } catch (e) {
        res.status(500);
        next(e);
      }
    } catch (e) {
      next(e);
    }
  }
}
export default TransactionControl;
