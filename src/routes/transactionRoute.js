import express from 'express';

import checkToken from '../utilities/jwt';

import transactionControl from '../controllers/transactionController';

import joiHelper from '../utilities/joiHelper';

import {
  creditAccountSchema,
  accountNumberSchema,
  idSchema,
} from '../utilities/validations';

const router = express.Router();

router.get('/', checkToken, transactionControl.getAll);
router.get('/:id', checkToken, joiHelper(idSchema, undefined), transactionControl.getOne);
router.get('/client/:accountNumber', checkToken, joiHelper(accountNumberSchema, undefined), transactionControl.getAllByClient);
router.post('/:accountNumber/debit', checkToken, joiHelper(accountNumberSchema, creditAccountSchema), transactionControl.debit);
router.post('/:accountNumber/credit', checkToken, joiHelper(accountNumberSchema, creditAccountSchema), transactionControl.credit);

export default router;

