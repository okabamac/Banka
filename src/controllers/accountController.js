
import moment from 'moment';

import db from '../models/index';

class AccountControl {
  static async getAll(req, res, next) {
    if (req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can view all accounts'));
    }

    if (req.query) {
      const { status } = req.query;
      try {
        const {
          rows,
        } = await db.query('SELECT * FROM accounts WHERE status=$1', [status]);
        res.json({
          status: 200,
          data: rows[0],
        });
      } catch (e) {
        next('Something went wrong! Please try again later');
      }
    } else {
      try {
        const {
          rows,
        } = await db.query('SELECT * from accounts');
        res.json({
          status: 200,
          data: rows,
        });
      } catch (e) {
        res.status(500);
        next(new Error('Something went wrong, please try again'));
      }
    }
  }

  static async getOne(req, res, next) {
    if (req.decoded.type == 'client') {
      res.status(401);
      return next(new Error('Only staff and admin can access this route'));
    }
    const {
      accountNumber,
    } = req.params;
    try {
      const {
        rows,
      } = await db.query('SELECT * FROM accounts WHERE accountNumber=$1', [accountNumber]);
      res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      res.status(404);
      next(new Error('Invalid Account Number'));
    }
  }

  static async getAccountTransactions(req, res, next) {
    if (req.decoded.type !== 'client') {
      res.status(401);
      return next(new Error('Only clients can access this route'));
    }
    const {
      accountNumber,
    } = req.params;
    try {
      const { rows } = await db.query('SELECT * FROM transactions WHERE accountNumber=$1', [accountNumber]);
      if (!res[0]) return next();
      res.json({
        status: 200,
        data: rows,
      });
    } catch (e) {
      next();
    }
  }

  static async createAccount(req, res, next) {
    if (req.decoded.type !== 'client') {
      res.status(401);
      return next(new Error('Only clients can create bank accounts'));
    }
    const {
      type, openingBalance,
    } = req.body;

    const text = `INSERT INTO
      accounts(accountNumber, createdOn, ownerId, type, balance, status)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [
      Math.floor(100000 + Math.random() * 9000000000),
      moment(new Date()),
      req.decoded.id,
      type,
      openingBalance,
      'active',
    ];
    try {
      const {
        rows,
      } = await db.query(text, values);
      res.json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      res.status(400);
      console.log(error);
      next(error);
    }
  }

  static async modifyAccount(req, res, next) {
    if (req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can modify accounts'));
    }
    const {
      accountNumber,
    } = req.params;
    try {
      const validPatch = await joiHelper(req, res, patchAccountSchema);
      if (validPatch.statusCode === 400) return;
      const {
        status,
      } = validPatch;
      const result = await db.query('UPDATE accounts SET status=$1 WHERE accountNumber=$2 RETURNING *', [status, accountNumber]);
      res.json({
        status: 200,
        data: {
          accountNumber,
          status: result.rows[0].status,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async deleteAccount(req, res, next) {
    if (req.decoded.type === 'client') {
      res.status(401);
      return next(new Error('Only staff and admins can delete accounts'));
    }
    const {
      accountNumber,
    } = req.params;
    try {
      const { rows } = await db.query('DELETE FROM accounts WHERE accountNumber=$1 RETURNING *', [accountNumber]);
      if (!rows[0]) return next();
      res.json({
        status: 200,
        data: {
          status: 200,
          message: 'Account successfully deleted!',
        },
      });
    } catch (e) {
      next(e);
    }
  }
}

export default AccountControl;
