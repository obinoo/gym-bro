import express from 'express';
import { getReport } from '../controller/report';
import { auth } from '../middleware/checkAuthToken';

const router = express.Router();


router.get('/getreport', auth, getReport);

export default router;
