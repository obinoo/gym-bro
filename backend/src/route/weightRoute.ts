import express from "express";
import {auth} from "../middleware/checkAuthToken";
import { addWeight, deleteWeight, getUserWeight, getWeightByDate, getWeightByLimit} from "../controller/weightTracker";
const router = express.Router();

router.post('/add',   auth, addWeight);
router.get('/date',   auth, getWeightByDate);
router.get('/limit',  auth, getWeightByLimit);
router.delete('/:id', auth, deleteWeight);
router.get('/goal',   auth, getUserWeight);

export default router;