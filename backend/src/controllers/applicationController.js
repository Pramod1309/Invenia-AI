import db from '../database/database.js';

// Create new application
export const createApplication = async (req, res) => {
  try {
    const { jobId, applicantInfo } = req.body;

    // Validate job exists
    const job = await db.getJobById(parseInt(jobId));
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Create application
    const application = await db.createApplication({
      jobId: parseInt(jobId),
      applicantInfo,
      status: 'pending_stages'
    });

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application created successfully'
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create application'
    });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await db.getApplicationById(parseInt(req.params.id));

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error getting application:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get application'
    });
  }
};

// Get all applications for a job
export const getApplicationsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.query;

    const applications = await db.getApplicationsByJobId(parseInt(jobId));

    // Filter by status if provided
    const filteredApplications = status 
      ? applications.filter(app => app.status === status)
      : applications;

    res.status(200).json({
      success: true,
      data: filteredApplications
    });
  } catch (error) {
    console.error('Error getting applications by job:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get applications'
    });
  }
};

// Update application stage
export const updateApplicationStage = async (req, res) => {
  try {
    const { id, stage } = req.params;
    const updateData = req.body;

    const application = await db.updateApplicationStage(parseInt(id), stage, updateData);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application,
      message: `Application stage updated to ${stage}`
    });
  } catch (error) {
    console.error('Error updating application stage:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update application stage'
    });
  }
};

// Submit test answers
export const submitTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { testData } = req.body;

    const application = await db.submitTest(parseInt(id), { testData });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application,
      message: 'Test submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit test'
    });
  }
};

// Submit interview responses
export const submitInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewData } = req.body;

    const application = await db.submitInterview(parseInt(id), { interviewData });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application,
      message: 'Interview submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting interview:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit interview'
    });
  }
};

// Upload resume file
export const uploadResume = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    console.log('req.headers:', req.headers);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl
      },
      message: 'Resume uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload resume'
    });
  }
};

// Get all applications (admin)
export const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const result = await db.getAllApplications(status, parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      data: result.applications,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting all applications:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get applications'
    });
  }
};

export default {
  createApplication,
  getApplicationById,
  getApplicationsByJobId,
  updateApplicationStage,
  submitTest,
  submitInterview,
  uploadResume,
  getAllApplications,
};
