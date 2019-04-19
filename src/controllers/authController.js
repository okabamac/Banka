
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import joiHelper from '../utilities/joiHelper';

import { jwt_secret } from '../../config';

import {
  userSignupSchema,
  userSigninSchema,
} from '../utilities/validations';

import users from '../models/userModel';


const doToken = (user) => {
  const token = jwt.sign({
    username: user.email,
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
    const checkExist = await users.filter(theUser => theUser.email == email);
    if (checkExist.length != 0) {
      res.status(400);
      next(new Error('Email is already in use'));
      return;
    }
    const user = {
      id: Math.floor(100000 + Math.random() * 900000), firstName, lastName, email, type, admin,
    };
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return next(new Error('Oops something went wrong!'));
      user.password = hash;
      users.unshift(user);
      // return the JWT token for the future API calls
      const tokenized = doToken(user);
      return res.json({
        status: 200,
        data: tokenized,
      });
    });
  }

  static async signin(req, res, next) {
    const validSignin = await joiHelper(req, res, userSigninSchema);
    if (validSignin.statusCode === 422) return;
    const { email, password } = validSignin;
    const user = users.find(theUser => theUser.email === email);
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const tokenized = doToken(user);
          return res.json({
            status: 200,
            data: tokenized,
          });
        }
        res.status(400);
        return next(new Error('Invalid credentials'));
      });
    } else {
      res.status(400);
      next(new Error('Invalid credentials'));
    }
  }
}

export default AuthControl;
