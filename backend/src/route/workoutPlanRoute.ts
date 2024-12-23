import express from "express";
import { auth } from "../middleware/checkAuthToken";
import { addWorkout, deleteWorkout, getWorkoutById, getWorkouts, updateWorkout } from "../controller/workoutPlan";

const router = express.Router();

router.post('/add', auth, addWorkout)
router.get('/workouts', auth, getWorkouts)
router.get('/:id', auth, getWorkoutById)
router.delete('/:id', auth, deleteWorkout)
router.put('/update', auth, updateWorkout)

export default router;