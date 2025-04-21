const Candidate = require("../models/Candidate");
const Job = require("../models/Job");
const ErrorResponse = require("../utils/errorResponse");
const NLPProcessor = require("../utils/nlpProcessor");
const ScoringEngine = require("../utils/scoring");

// Helper function to validate job ownership
const validateJobOwnership = async (jobId, userId) => {
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) throw new ErrorResponse('Job not found or not authorized', 404);
  return job;
};

exports.getCandidates = async (req, res, next) => {
  try {
    await validateJobOwnership(req.params.jobId, req.user.id);
    const candidates = await Candidate.find({ job: req.params.jobId }).sort('-matchScore');
    res.status(200).json({ success: true, data: candidates });
  } catch (err) {
    next(err);
  }
};

exports.getCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(new ErrorResponse(`Candidate not found with id ${req.params.id}`, 404));
    }

    await validateJobOwnership(candidate.job, req.user.id);
    res.status(200).json({ success: true, data: candidate });
  } catch (err) {
    next(err);
  }
};

exports.getAllCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find().sort('-matchScore');
    res.status(200).json({ success: true, data: candidates });
  } catch (err) {
    next(new ErrorResponse(err.message, 500));
  }
};

exports.processResume = async (req, res, next) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return next(new ErrorResponse("No file uploaded", 400));
    }

    console.log("Resume file received:", {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.buffer.length
    });

    // Validate job ownership
    const job = await validateJobOwnership(req.body.jobId, req.user.id);
    console.log("Job found:", job.title);

    // Extract text from resume
    const resumeText = await NLPProcessor.extractTextFromFile(req.file.buffer, req.file.mimetype);
    if (!resumeText || resumeText.trim().length < 10) {
      return next(new ErrorResponse("Failed to extract text from resume or text too short", 400));
    }

    console.log("Extracted resume text preview:", resumeText.slice(0, 300));

    // Extract skills and match score
    const skills = NLPProcessor.extractSkills(resumeText, job.skills);
    const matchScore = ScoringEngine.calculateAdvancedMatch(resumeText, job.description, job.skills);

    console.log("Extracted skills:", skills);
    console.log("Match score:", matchScore);

    // Extract name and email
    const name = req.body.name?.trim() || NLPProcessor.extractName(resumeText);
    const email = req.body.email?.trim() || NLPProcessor.extractEmail(resumeText);

    if (!name || !email) {
      return next(new ErrorResponse("Failed to extract name or email from resume", 400));
    }

    // Prepare candidate data
    const candidateData = {
      name,
      email,
      resumeText,
      skills,
      matchScore,
      job: job._id,
      uploadedBy: req.user.id,
      resumeFile: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      },
    };

    // Save candidate to DB
    const candidate = await Candidate.create(candidateData);
    console.log("Candidate created successfully:", candidate.name);

    res.status(201).json({ success: true, data: candidate });

  } catch (err) {
    console.error("Error in processResume:", err.message);
    next(err);
  }
};


exports.deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(new ErrorResponse(`Candidate not found with id ${req.params.id}`, 404));
    }

    await validateJobOwnership(candidate.job, req.user.id);
    await Candidate.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};