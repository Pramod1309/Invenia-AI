import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createApplication,
  getApplicationById,
  getApplicationsByJobId,
  updateApplicationStage,
  submitTest,
  submitInterview,
  uploadResume,
  getAllApplications
} from '../controllers/applicationController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// Application CRUD routes
router.post('/', createApplication);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.get('/job/:jobId', getApplicationsByJobId);

// Stage progression routes
router.put('/:id/stage/:stage', updateApplicationStage);
router.post('/:id/test', submitTest);
router.post('/:id/interview', submitInterview);

// File upload route
router.post('/upload/resume', upload.single('resume'), uploadResume);

export default router;
