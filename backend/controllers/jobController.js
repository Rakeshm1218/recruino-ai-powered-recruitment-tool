const Job = require('../models/Job');
const ErrorResponse = require('../utils/errorResponse');

exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id });
    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('candidates');

    if (!job) {
      return next(new ErrorResponse(`Job not found with id ${req.params.id}`, 404));
    }

    if (job.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to access this job', 401));
    }

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse(`Job not found with id ${req.params.id}`, 404));
    }

    if (job.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this job', 401));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse(`Job not found with id ${req.params.id}`, 404));
    }

    if (job.createdBy.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this job', 401));
    }

    await job.deleteOne({_id: req.params.id});
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};