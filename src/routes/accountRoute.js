import express from 'express';

import accountControl from '../controllers/accountController';

const router = express.Router();

router.get('/', accountControl.getAll);
router.get('/:accountNumber', accountControl.getOne);
router.get('/:accountNumber/transactions', accountControl.getAllTransactions);
router.post('/', accountControl.createAccount);
router.patch('/:accountNumber', accountControl.modifyAccount);
router.delete('/:accountNumber', accountControl.deleteAccount);

export default router;
