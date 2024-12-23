import express from 'express';
import { getReport } from '../controller/report';

const router = express.Router();


router.get('/getreport', getReport);

export default router;
