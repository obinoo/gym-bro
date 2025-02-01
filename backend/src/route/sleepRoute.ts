import express from "express";
import { auth } from '../middleware/checkAuthToken';
import { addSleep, deleteSleep, getSleepByDate, getSleepByLimit, getUserSleep } from "../controller/sleepTrack";

const router = express.Router();

router.post('/add',   auth, addSleep);
router.get('/date',   auth, getSleepByDate);
router.get('/limit',  auth, getSleepByLimit);
router.delete('/:id', auth, deleteSleep);
router.get('/goal',   auth, getUserSleep);

export default router;