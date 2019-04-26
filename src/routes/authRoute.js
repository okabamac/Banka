import express from 'express';

import authControl from '../controllers/authController';

import joiHelper from '../utilities/joiHelper';

import {
  userSignupSchema,
  userSigninSchema,
} from '../utilities/validations';

const router = express.Router();

router.post('/signup', joiHelper(undefined, userSignupSchema), authControl.signup);
router.post('/signin', joiHelper(undefined, userSigninSchema), authControl.signin);

export default router;
