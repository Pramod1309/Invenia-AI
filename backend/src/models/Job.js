import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
  },
  remote: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site',
  },
  salary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  skills: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['open', 'screening', 'interview', 'closed'],
    default: 'open',
  },
  aiStatus: {
    type: String,
    enum: ['ready', 'processing', 'needs_review', 'completed'],
    default: 'ready',
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  resumeCount: {
    type: Number,
    default: 0,
  },
  pendingActions: {
    type: Number,
    default: 0,
  },
  biasRisk: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  confidence: {
    type: Number,
    default: 0,
  },
  aiMatchScore: {
    type: Number,
    default: 0,
  },
  diversityScore: {
    type: Number,
    default: 0,
  },
  timeToFill: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  applications: {
    type: Number,
    default: 0,
  },
  shortlisted: {
    type: Number,
    default: 0,
  },
  interviewed: {
    type: Number,
    default: 0,
  },
  aiInsights: {
    recommendedSkills: [String],
    marketDemand: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Very High'],
      default: 'Medium',
    },
    salaryCompetitiveness: {
      type: String,
      enum: ['Below Average', 'Competitive', 'Above Average'],
      default: 'Competitive',
    },
    diversityPotential: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Very High'],
      default: 'Medium',
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
