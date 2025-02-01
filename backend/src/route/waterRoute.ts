import express from "express";
import { addWater, deleteWater, getUserWaterIntake, getWaterByDate, getWaterByLimit } from "../controller/waterTracker";
import { auth } from "../middleware/checkAuthToken";

const router = express.Router();

router.post('/add',   auth, addWater);
router.get('/date',   auth, getWaterByDate);
router.get('/limit',  auth, getWaterByLimit);
router.delete('/:id', auth, deleteWater);
router.get('/goal',   auth, getUserWaterIntake);

export default router;