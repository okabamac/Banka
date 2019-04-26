import express from 'express';

import checkToken from '../utilities/jwt';

import accountControl from '../controllers/accountController';

import joiHelper from '../utilities/joiHelper';

import {
  createAccountSchema,
  patchAccountSchema,
  accountNumberSchema,
} from '../utilities/validations';

const router = express.Router();

router.get('/', checkToken, accountControl.getAll);
router.get('/:accountNumber', checkToken, joiHelper(accountNumberSchema, undefined), accountControl.getOne);
router.get('/:accountNumber/transactions', checkToken, joiHelper(accountNumberSchema, undefined), accountControl.getAccountTransactions);
router.post('/', checkToken, joiHelper(undefined, createAccountSchema), accountControl.createAccount);
router.patch('/:accountNumber', checkToken, joiHelper(accountNumberSchema, patchAccountSchema), accountControl.modifyAccount);
router.delete('/:accountNumber', checkToken, joiHelper(accountNumberSchema, undefined), accountControl.deleteAccount);

export default router;
