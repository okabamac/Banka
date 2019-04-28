import express from 'express';

import checkToken from '../utilities/jwt';


import authControl from '../controllers/authController';

import joiHelper from '../utilities/joiHelper';

import checkExist from '../utilities/checkExist';

import trimCheck from '../utilities/trimCheck';

import {
  userSignupSchema,
  userSigninSchema,
  addUserSchema,
} from '../utilities/validations';

const router = express.Router();

router.post('/signup', joiHelper(undefined, userSignupSchema), trimCheck, checkExist, authControl.signup);
router.post('/signin', joiHelper(undefined, userSigninSchema), authControl.signin);
router.post('/addUser', checkToken, joiHelper(undefined, addUserSchema), trimCheck, checkExist, authControl.addUser);

export default router;
