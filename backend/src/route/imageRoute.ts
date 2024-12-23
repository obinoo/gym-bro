import express from 'express';
import upload from '../middleware/upload';
import { uploadImage } from '../controller/imageUpload';

const router = express.Router();

// Route for updating user profile image
router.post('/user/image', upload.single('image'), uploadImage);

export default router;
