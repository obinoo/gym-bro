import express from 'express';
import { getProfile, updateProfile} from '../controller/profile';
import { auth } from '../middleware/checkAuthToken';

const router = express.Router();

router.put('/update', auth, updateProfile);
router.get('/user', auth, getProfile);

export default router;