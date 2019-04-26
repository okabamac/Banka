/* eslint-disable consistent-return */

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import db from '../models/index';

import { jwt_secret } from '../../config';


const doToken = (user) => {
  const token = jwt.sign({
    id: user.id,
    type: user.type,
    isAdmin: user.isAdmin,
  },
  jwt_secret, {
    expiresIn: '24h', // expires in 24 hours
  });
  const data = {
    token,
    ...user,
  };
    // return the JWT token for the future API calls
  return data;
};

class AuthControl {
  static async signup(req, res, next) {
    const {
      firstName, lastName, email, password,
    } = req.body;
    const checkExist = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    if (checkExist.rows.length != 0) {
      res.status(400);
      next(new Error('Email is already in use'));
      return;
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) return next(new Error('Oops something went wrong!'));
      const text = `INSERT INTO
      users(email, firstName, lastName, type, isAdmin, password)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;
      const values = [
        email,
        firstName,
        lastName,
        'client',
        false,
        hash,
      ];
      try {
        const {
          rows,
        } = await db.query(text, values);
        const tokenized = await doToken(rows[0]);
        const {
          token, id, email, firstname, lastname, type, isadmin,
        } = tokenized;
        return res.json({
          status: 200,
          data: {
            token, id, email, firstname, lastname, type, isadmin,
          },
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          error: 'Oops, something went wrong! Try again',
        });
      }
    });
  }

  static async signin(req, res, next) {

    const { email, password } = req.body;
    try {
      const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [email]);
      if (!rows[0]) {
        return res.status(400).json({
          status: 400,
          error: 'Invalid credentials',
        });
      }
      bcrypt.compare(password, rows[0].password, async (err, result) => {
        if (result) {
          const tokenized = await doToken(rows[0]);
          const {
            token, id, email, firstname, lastname, type, isadmin,
          } = tokenized;
          return res.json({
            status: 200,
            data: {
              token, id, email, firstname, lastname, type, isadmin,
            },
          });
        }
        res.status(400);
        return next(new Error('Invalid credentials'));
      });
    } catch (e) {
      res.status(500);
      next(new Error('Something went wrong! Please, try again later'));
    }
  }
}

export default AuthControl;
