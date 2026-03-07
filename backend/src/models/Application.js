import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicantInfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
    },
    education: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
  },
  stages: {
    resumeUploaded: {
      type: Boolean,
      default: false,
    },
    testCompleted: {
      type: Boolean,
      default: false,
    },
    interviewCompleted: {
      type: Boolean,
      default: false,
    },
  },
  testData: {
    q1: {
      type: String, // Multiple choice answer
    },
    q2: {
      type: String, // Years experience
    },
    q3: {
      type: String, // Project description
    },
  },
  interviewData: [{
    question: {
      type: String,
    },
    audioUrl: {
      type: String,
    },
    transcript: {
      type: String,
    },
    analysis: {
      confidence: Number,
      keywords: [String],
      sentiment: String,
      score: Number,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['pending_stages', 'resume_uploaded', 'test_completed', 'interview_completed', 'rejected', 'accepted'],
    default: 'pending_stages',
  },
  overallScore: {
    type: Number,
    default: 0,
  },
  aiEvaluation: {
    resumeScore: Number,
    testScore: Number,
    interviewScore: Number,
    recommendation: {
      type: String,
      enum: ['strong_reject', 'reject', 'consider', 'recommend', 'strong_recommend'],
    },
    feedback: String,
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

applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ 'applicantInfo.email': 1 });
applicationSchema.index({ createdAt: -1 });

export default mongoose.model("Application", applicationSchema);
