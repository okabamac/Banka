import express from 'express';

import userControl from '../controllers/userController';

const router = express.Router();

router.get('/', userControl.getAll);
router.get('/:userId', userControl.getOne);

export default router;
