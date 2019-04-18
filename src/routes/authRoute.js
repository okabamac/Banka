import express from 'express';

import authControl from '../controllers/authController';

const router = express.Router();

router.post('/signup', authControl.signup);
router.post('/signin', authControl.signin);

export default router;
