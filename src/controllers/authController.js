import moment from 'moment';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import db from '../models/index';

import joiHelper from '../utilities/joiHelper';

import { jwt_secret } from '../../config';

import {
  userSignupSchema,
  userSigninSchema,
} from '../utilities/validations';


const doToken = (user) => {
  const token = jwt.sign({
    email: user.email,
    id: user.id,
    type: user.type,
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
    const validSignup = await joiHelper(req, res, userSignupSchema);
    if (validSignup.statusCode === 422) return;
    const {
      firstName, lastName, email, password, type, admin,
    } = validSignup;
    const checkExist = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    if (checkExist.rows.length != 0) {
      res.status(400);
      next(new Error('Email is already in use'));
      return;
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) return next(new Error('Oops something went wrong!'));
      const text = `INSERT INTO
      users(id, email, firstName, lastName, type, isAdmin, password)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
      const values = [
        22,
        email,
        firstName,
        lastName,
        type,
        admin,
        hash,
      ];
      try {
        const {
          rows,
        } = await db.query(text, values);
        const tokenized = await doToken(rows[0]);
        return res.json({
          status: 200,
          data: tokenized,
        });
      } catch (error) {
        return res.status(400).json({
          status: 400,
          error,
        });
      }
    });
  }

  static async signin(req, res, next) {
    const validSignin = await joiHelper(req, res, userSigninSchema);
    if (validSignin.statusCode === 422) return;
    const { email, password } = validSignin;
    try {
      const user = await db.query('SELECT * FROM users WHERE email=$1', [email]);
      bcrypt.compare(password, user.rows[0].password, async (err, result) => {
        if (result) {
          const tokenized = await doToken(user.rows[0]);
          return res.json({
            status: 200,
            data: tokenized,
          });
        }
        res.status(400);
        return next(new Error('Invalid credentials'));
      });
    } catch (e) {
      res.status(400);
      next(new Error('Invalid credentials'));
    }
  }
}

export default AuthControl;
