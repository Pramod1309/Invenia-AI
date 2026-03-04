import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
  getJobsByStatus,
} from '../controllers/jobController.js';

const router = express.Router();

// Create a new job
router.post('/', createJob);

// Get all jobs
router.get('/', getAllJobs);

// Get job statistics
router.get('/stats', getJobStats);

// Get jobs by status
router.get('/filter', getJobsByStatus);

// Get a single job
router.get('/:id', getJobById);

// Update a job
router.put('/:id', updateJob);

// Delete a job
router.delete('/:id', deleteJob);

export default router;
