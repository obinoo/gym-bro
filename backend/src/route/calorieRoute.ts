import express from 'express';
import { 
    addCalories, 
    getCalorieByDate, 
    getCalorieIntakeByLimit, 
    deleteCalorie, 
    getGoalCalorie 
} from '../controller/calorieIntake'; 
import { auth } from '../middleware/checkAuthToken';

const router = express.Router();

router.post('/add',   auth, addCalories);
router.get('/date',   auth, getCalorieByDate);
router.get('/limit',  auth, getCalorieIntakeByLimit);
router.delete('/:id', auth, deleteCalorie);
router.get('/goal',   auth, getGoalCalorie);

export default router;
