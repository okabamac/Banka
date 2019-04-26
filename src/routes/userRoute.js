import express from 'express';

import checkToken from '../utilities/jwt';

import userControl from '../controllers/userController';

import joiHelper from '../utilities/joiHelper';

import {
  emailSchema,
  idSchema,
} from '../utilities/validations';

const router = express.Router();

router.get('/', checkToken, userControl.getAll);
router.get('/:id', checkToken, joiHelper(idSchema, undefined), userControl.getOne);
router.get('/:email/accounts', checkToken, joiHelper(emailSchema, undefined), userControl.getAllByEmail);
router.delete('/:id', checkToken, joiHelper(idSchema, undefined), userControl.deleteUser);

export default router;
