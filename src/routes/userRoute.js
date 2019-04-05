const express = require('express');

const router = express.Router();

const userControl = require('../controllers/userController');

router.get('/', userControl.getAll);
router.get('/:userId', userControl.getOne);

router.post('/signup', userControl.signup);
router.post('/signin', userControl.signin);

module.exports = router;
