import moment from 'moment';

import db from '../models/index';

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
      id,
    } = req.params;
    try {
      const {
        rows,
      } = await db.query('SELECT * FROM transactions WHERE id=$1', [id]);
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
      if (account.rows[0].status === 'dormant') {
        return res.status.json({
          status: 400,
          data: 'You can\'t debit this account because it is dormant',
        });
      }
      const {
        amount,
      } = req.body;
      if (account.rows[0].balance <= amount) {
        res.status(400);
        return next(new Error('Insufficient fund'));
      }
      const text = `INSERT INTO transactions(createdOn, type, accountNumber, amount, cashier, oldBalance, newBalance) VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
      const values = [
        moment(new Date()),
        'debit',
        account.rows[0].accountnumber,
        amount,
        req.decoded.id,
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

  static async credit (req, res, next) {
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
      if (account.rows[0].status === 'dormant') {
        return res.status.json({
          status: 400,
          data: 'You can\'t credit this account because it is dormant',
        });
      }
      const {
        amount,
      } = req.body;
      const text = `INSERT INTO transactions(createdOn, type, accountNumber, amount, cashier, oldBalance, newBalance) VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
      const values = [
        moment(new Date()),
        'debit',
        account.rows[0].accountnumber,
        amount,
        req.decoded.id,
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
