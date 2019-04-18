import express from 'express';

import transactionControl from '../controllers/transactionController';

const router = express.Router();

router.get('/', transactionControl.getAll);
router.get('/:transactionId', transactionControl.getOne);
router.post('/:accountNumber/debit', transactionControl.debit);
router.post('/:accountNumber/credit', transactionControl.credit);

export default router;
