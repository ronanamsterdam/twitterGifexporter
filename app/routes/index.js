import express from 'express';
const router =  express.Router();

import tst      from './tst';
import processRouter  from './process';

router.use('/tst', tst);
router.use('/process', processRouter);

export default router;