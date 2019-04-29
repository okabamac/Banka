
import moment from 'moment';

import db from '../models/index';

const text = `INSERT INTO
      accounts(accountNumber, createdOn, ownerId, type, balance, status)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *`;

class AccountControl {
  static async getAll(req, res, next) {
    if (req.decoded.type === 'client') {
      return res.status(401).json({
        status: 401,
        error: 'Access denied',
      });
    }
    try {
      const result = await db.query('SELECT * FROM accounts');
      return res.status(200).json({
        status: 200,
        data: result.rows,
      });
    } catch (e) {
      return next(e);
    }
  }

  static async getOne(req, res, next) {
    const {
      accountNumber,
    } = req.params;
    try {
      const result = await db.query('SELECT * FROM accounts WHERE accountNumber=$1', [accountNumber]);
      if (req.decoded.type === 'client' && req.decoded.id !== result.rows[0].ownerid) {
        return res.status(401).json({
          status: 401,
          error: 'Access denied',
        });
      }
      return res.status(200).json({
        status: 200,
        data: result.rows,
      });
    } catch (e) {
      return next(e);
    }
  }

  static async getAccountTransactions(req, res, next) {
    const {
      accountNumber,
    } = req.params;
    try {
      const account = await db.query('SELECT * FROM accounts WHERE accountNumber=$1', [accountNumber]);
      const result = await db.query('SELECT * FROM transactions WHERE accountNumber=$1', [accountNumber]);
      if (req.decoded.id === account.rows[0].ownerid || req.decoded.type === 'staff') {
        return res.json({
          status: 200,
          data: result.rows,
        });
      }
      return res.status(401).json({
        status: 401,
        error: 'Access denied',
      });
    } catch (e) {
      return next(e);
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
    try {
      const {
        rows,
      } = await db.query(text, [
        Math.floor(100000 + Math.random() * 9000000000),
        moment(new Date()),
        req.decoded.id,
        type,
        openingBalance,
        'active',
      ]);
      return res.json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      res.status(400);
      return next(error);
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
    const {
      status,
    } = req.body;
    try {
      const result = await db.query('UPDATE accounts SET status=$1 WHERE accountNumber=$2 RETURNING *', [status, accountNumber]);
      return res.json({
        status: 200,
        data: {
          accountNumber,
          status: result.rows[0].status,
        },
      });
    } catch (e) {
      return next(e);
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
      return res.json({
        status: 200,
        message: 'Account successfully deleted!',
      });
    } catch (e) {
      return next(e);
    }
  }
}

export default AccountControl;
