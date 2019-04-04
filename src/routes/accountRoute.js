const express = require('express');

const router = express.Router();

const accountControl = require('../controllers/accountController');

router.get('/', accountControl.getAll);
router.get('/:accountNumber', accountControl.getOne);
router.post('/', accountControl.createAccount);
router.patch('/:accountNumber', accountControl.modifyAccount);
router.delete('/:accountNumber', accountControl.deleteAccount);

module.exports = router;
