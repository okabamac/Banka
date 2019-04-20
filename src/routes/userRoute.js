import express from 'express';

import checkToken from '../utilities/jwt';

import userControl from '../controllers/userController';

const router = express.Router();

router.get('/', checkToken, userControl.getAll);
router.get('/:userId', checkToken, userControl.getOne);

export default router;
