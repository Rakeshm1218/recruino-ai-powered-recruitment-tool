const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  skills: {
    type: [String],
    required: [true, 'Please add at least one required skill'],
    validate: {
      validator: function(skills) {
        return skills.length > 0;
      },
      message: 'Please add at least one required skill'
    }
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'draft'],
    default: 'open'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
JobSchema.virtual('candidates', {
  ref: 'Candidate',
  localField: '_id',
  foreignField: 'job',
  justOne: false
});

// Cascade delete candidates when a job is deleted
JobSchema.pre('remove', async function(next) {
  await this.model('Candidate').deleteMany({ job: this._id });
  next();
});

module.exports = mongoose.model('Job', JobSchema);