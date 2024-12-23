import express from "express";
import { auth } from "../middleware/checkAuthToken";
import { addWorkout, deleteWorkout, getWorkoutByDate, getWorkoutTrackByLimit, usergoalWorkout } from "../controller/workoutTrack";

const router = express.Router();

router.post('/add', auth, addWorkout)
router.get('/date', auth, getWorkoutByDate)
router.get('limit', auth, getWorkoutTrackByLimit)
router.delete('/:id', auth, deleteWorkout)
router.get('/goal', auth, usergoalWorkout)

export default router;