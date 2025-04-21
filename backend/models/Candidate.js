const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  resumeText: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  matchScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true
  },
  resumeFile: {
    data: Buffer,
    contentType: String,
    filename: String
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

CandidateSchema.index({ job: 1, matchScore: -1 });

module.exports = mongoose.model('Candidate', CandidateSchema);