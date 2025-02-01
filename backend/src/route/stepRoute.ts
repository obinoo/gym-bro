import express from "express";
import {auth} from "../middleware/checkAuthToken";
import { addStep, deleteSteps, getStepByLimit, getStepsByDate, getUserStep } from "../controller/stepTracker";
const router = express.Router();

router.post('/add',   auth, addStep);
router.get('/date',   auth, getStepsByDate);
router.get('/limit',  auth, getStepByLimit);
router.delete('/:id', auth, deleteSteps);
router.get('/goal',   auth, getUserStep);

export default router;