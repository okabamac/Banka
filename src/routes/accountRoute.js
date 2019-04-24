import express from 'express';

import checkToken from '../utilities/jwt';

import accountControl from '../controllers/accountController';

const router = express.Router();

router.get('/', checkToken, accountControl.getAll);
router.get('/:accountNumber', checkToken, accountControl.getOne);
router.get('/:accountNumber/transactions', checkToken, accountControl.getAccountTransactions);
router.post('/', checkToken, accountControl.createAccount);
router.patch('/:accountNumber', checkToken, accountControl.modifyAccount);
router.delete('/:accountNumber', checkToken, accountControl.deleteAccount);

export default router;
