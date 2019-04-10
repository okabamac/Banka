const express = require('express');

const router = express.Router();

const authControl = require('../controllers/authController');

router.post('/signup', authControl.signup);
router.post('/signin', authControl.signin);

module.exports = router;