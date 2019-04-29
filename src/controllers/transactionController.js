import moment from 'moment';

import db from '../models/index';

const text = `INSERT INTO transactions(createdOn, type, accountNumber, amount, cashier, oldBalance, newBalance) VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

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
      return res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      return next(e);
    }
  }

  static async getOne(req, res, next) {
    const { id, type } = req.decoded;
    try {
      const transaction = await db.query('SELECT * FROM transactions WHERE id=$1', [req.params.id]);
      const account = await db.query('SELECT * FROM accounts WHERE accountNumber=$1', [transaction.rows[0].accountNumber]);
      if ((account.rows[0].ownerid === id && type === 'client') || type === 'staff') {
        return res.status(200).json({
          status: 200,
          data: transaction.rows,
        });
      }
      return res.status(401).json({
        status: 401,
        message: 'Access denied',
      });
    } catch (e) {
      return next(e);
    }
  }

  static async debit(req, res, next) {
    if (req.decoded.isadmin || req.decoded.isAdmin || req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff can debit'));
    }
    const {
      accountNumber,
    } = req.params;
    const {
      amount,
    } = req.body;
    try {
      const account = await db.query('SELECT * FROM accounts WHERE accountNumber=$1', [accountNumber]);
      if (account.rows[0].status === 'dormant') {
        return res.status(400).json({
          status: 400,
          error: 'You can\'t debit this account because it is dormant',
        });
      }

      if (!account.rows[0]) {
        res.status(404);
        return next(new Error('Account not found'));
      }
      if (account.rows[0].balance <= amount) {
        res.status(400);
        return next(new Error('Insufficient fund'));
      }
      const sub = parseFloat(account.rows[0].balance) - parseFloat(amount);
      const bal = parseFloat(account.rows[0].balance);
      await db.query('UPDATE accounts SET balance=$1 WHERE accountNumber=$2', [sub, accountNumber]);
      const {
        rows,
      } = await db.query(text, [
        moment(new Date()),
        'debit',
        account.rows[0].accountnumber,
        amount,
        req.decoded.id,
        bal,
        sub,
      ]);
      return res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      return next(e);
    }
  }

  static async credit(req, res, next) {
    if (req.decoded.isadmin || req.decoded.isAdmin || req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff can credit'));
    }
    const {
      accountNumber,
    } = req.params;
    const {
      amount,
    } = req.body;
    try {
      const account = await db.query('SELECT * FROM accounts WHERE accountNumber=$1', [accountNumber]);
      if (!account.rows[0]) {
        res.status(404);
        return next(new Error('Account not found'));
      }
      if (account.rows[0].status === 'dormant') {
        return res.status(400).json({
          status: 400,
          error: 'You can\'t credit this account because it is dormant',
        });
      }
      const add = parseFloat(account.rows[0].balance) + parseFloat(amount);
      const bal = parseFloat(account.rows[0].balance);
      await db.query('UPDATE accounts SET balance=$1 WHERE accountNumber=$2', [add, accountNumber]);
      const {
        rows,
      } = await db.query(text, [
        moment(new Date()),
        'credit',
        account.rows[0].accountnumber,
        amount,
        req.decoded.id,
        bal,
        add,
      ]);
      return res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      return next(e);
    }
  }
}
export default TransactionControl;
