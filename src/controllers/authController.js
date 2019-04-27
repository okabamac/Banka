/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import db from '../models/index';

import {
  jwt_secret,
} from '../../config';

const doToken = (user) => {
  const token = jwt.sign({
    id: user.id,
    type: user.type,
    isAdmin: user.isadmin,
  },
  jwt_secret, {
    expiresIn: '24h', // expires in 24 hours
  });
  const data = Object.assign({ user, token });
  // return the JWT token for the future API calls
  return data;
};

const trimCheck = (data) => {
  Object.keys(data).forEach((a) => {
    // eslint-disable-next-line no-param-reassign
    data[a] = data[a].trim().replace(/\s/g, '');
  });
  return data;
};

const text = `INSERT INTO
      users(email, firstName, lastName, type, isAdmin, password)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;


class AuthControl {
  static async signup(req, res, next) {
    const {
      firstName, lastName, email, password,
    } = await trimCheck(req.body);
    try {
      bcrypt.hash(password, 10, async (err, hash) => {
        const addNewUser = await db.query(text, [email,
          firstName,
          lastName,
          'client',
          false,
          hash,
        ]);
        const tokenized = await doToken(addNewUser.rows[0]);
        const {
          id, type, isadmin,
        } = tokenized;
        return res.json({
          status: 200,
          data: {
            token: tokenized.token,
            id,
            email,
            firstName,
            lastName,
            type,
            isadmin,
          },
        });
      });
    } catch (e) {
      next(e);
    }
  }

  static async addUser(req, res, next) {
    if (req.decoded.isAdmin === false) { 
      return res.status(401).json({
        status: 401,
        error: 'Access denied',
      });
    }
    const {
      firstName,
      lastName,
      email,
      password,
      type,
      admin,
    } = trimCheck(req.body);
    try {
      bcrypt.hash(password, 10, async (err, hash) => {
        const addNewUser = await db.query(text, [email,
          firstName,
          lastName,
          type, admin,
          hash,
        ]);
        const tokenized = await doToken(addNewUser.rows[0]);
        const {
          id, isadmin,
        } = tokenized.user;
        return res.json({
          status: 200,
          data: {
            token: tokenized.token,
            id,
            email,
            firstName,
            lastName,
            type,
            isadmin,
          },
        });
      });
    } catch (e) {
      next(e);
    }
  }

  static async signin(req, res, next) {
    const { email, password } = req.body;
    try {
      const result = await db.query('SELECT * FROM users WHERE email=$1', [email]);
      if (!result.rows[0]) {
        res.status(400);
        return next(new Error('Invalid credentials'));
      }
      bcrypt.compare(password, result.rows[0].password, async (err, data) => {
        if (data) {
          const tokenized = await doToken(result.rows[0]);
          const {
            id, firstname, lastname, type, isadmin,
          } = tokenized.user;
          return res.json({
            status: 200,
            data: {
              token: tokenized.token, id, email, firstname, lastname, type, isadmin,
            },
          });
        }
        res.status(400);
        return next(new Error('Invalid credentials'));
      });
    } catch (e) {
      next(e);
    }
  }
}

export default AuthControl;
