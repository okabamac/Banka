const express = require('express');

const router = express.Router();

const transactionControl = require('../controllers/transactionController');

router.get('/', transactionControl.getAll);
router.get('/:transactionId', transactionControl.getOne);
router.post('/:accountNumber/debit', transactionControl.debit);
router.post('/:accountNumber/credit', transactionControl.credit);

module.exports = router;
