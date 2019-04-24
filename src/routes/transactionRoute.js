import express from 'express';

import checkToken from '../utilities/jwt';

import transactionControl from '../controllers/transactionController';

const router = express.Router();

router.get('/', checkToken, transactionControl.getAll);
router.get('/:transactionId', checkToken, transactionControl.getOne);
router.get('/client/:accountNumber', checkToken, transactionControl.getAllByClient);
router.post('/:accountNumber/debit', checkToken, transactionControl.debit);
router.post('/:accountNumber/credit', checkToken, transactionControl.credit);

export default router;
 