import db from '../database/database.js';
// import Job from '../models/Job.js'; // No longer needed
// import User from '../models/User.js'; // No longer needed

// Create a new job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      remote,
      salary,
      description,
      requirements,
      skills,
    } = req.body;

    // Validate required fields
    if (!title || !department || !location || !salary || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Get user ID from request (assuming authentication middleware sets this)
    const userId = req.user?.id || 1; // Default to user ID 1 for demo

    const newJob = await db.createJob({
      title,
      department,
      location,
      employmentType: employmentType || 'Full-time',
      remote: remote || 'On-site',
      salary,
      description,
      requirements: requirements || [],
      skills: skills || [],
      createdBy: userId,
      aiInsights: {
        recommendedSkills: skills || [],
        marketDemand: 'High',
        salaryCompetitiveness: 'Competitive',
        diversityPotential: 'Medium',
      },
      aiMatchScore: 85,
      diversityScore: 75,
      biasRisk: 'low',
      confidence: 85,
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: newJob,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message,
    });
  }
};

// Get all jobs for a user
export const getAllJobs = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Default to user ID 1 for demo
    
    const jobs = await db.getAllJobs(userId);

    res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      data: jobs,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message,
    });
  }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1; // Default to user ID 1 for demo

    const job = await db.getJobById(parseInt(id));

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if job belongs to user (optional, based on your requirements)
    if (job.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Increment views
    await db.incrementJobViews(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Job retrieved successfully',
      data: job,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message,
    });
  }
};

// Update a job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1; // Default to user ID 1 for demo

    const {
      title,
      department,
      location,
      employmentType,
      remote,
      salary,
      description,
      requirements,
      skills,
      status,
    } = req.body;

    // Check if job exists and belongs to user
    const existingJob = await db.getJobById(parseInt(id));
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (existingJob.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const updateData = {
      title,
      department,
      location,
      employmentType,
      remote,
      salary,
      description,
      requirements,
      skills,
      status,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedJob = await db.updateJob(parseInt(id), updateData);

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message,
    });
  }
};

// Delete a job
export const deleteJob = async (req, res) => {
  try {
    console.log('🗑️ Backend: Delete request received for job ID:', req.params.id);
    const { id } = req.params;
    const userId = req.user?.id || 1; // Default to user ID 1 for demo

    console.log('🔍 Backend: Checking if job exists for ID:', parseInt(id));
    // Check if job exists and belongs to user
    const existingJob = await db.getJobById(parseInt(id));
    if (!existingJob) {
      console.log('❌ Backend: Job not found');
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (existingJob.createdBy !== userId) {
      console.log('❌ Backend: Access denied for user:', userId, 'Job createdBy:', existingJob.createdBy);
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    console.log('✅ Backend: Deleting job with ID:', parseInt(id));
    await db.deleteJob(parseInt(id));
    console.log('✅ Backend: Job deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: { id: parseInt(id), deleted: true },
    });
  } catch (error) {
    console.error('❌ Backend: Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message,
    });
  }
};

// Get job statistics
export const getJobStats = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // Default to user ID 1 for demo

    const stats = await db.getJobStats(userId);

    // Ensure all fields have default values
    const result = {
      totalJobs: stats.totalJobs || 0,
      openJobs: stats.openJobs || 0,
      closedJobs: stats.closedJobs || 0,
      totalApplications: stats.totalApplications || 0,
      totalViews: stats.totalViews || 0,
      avgTimeToFill: Math.round(stats.avgTimeToFill || 0),
    };

    res.status(200).json({
      success: true,
      message: 'Job statistics retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job statistics',
      error: error.message,
    });
  }
};

// Filter jobs by status
export const getJobsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user?.id || 1; // Default to user ID 1 for demo

    const jobs = await db.getJobsByStatus(status, userId);

    res.status(200).json({
      success: true,
      message: 'Jobs filtered successfully',
      data: jobs,
    });
  } catch (error) {
    console.error('Error filtering jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering jobs',
      error: error.message,
    });
  }
};
