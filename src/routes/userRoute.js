const express = require('express');

const router = express.Router();

const userControl = require('../controllers/userController');

router.get('/', userControl.getAll);
router.get('/:userId', userControl.getOne);

module.exports = router;
