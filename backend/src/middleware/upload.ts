import multer from 'multer';

// Configure multer for in-memory storage
const storage = multer.memoryStorage();

// Middleware for single file upload
const upload = multer({ storage });

export default upload;
