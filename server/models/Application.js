const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'reviewed', 'shortlisted', 'rejected'],
    default: 'applied'
  },
  coverLetter: {
    type: String
  }
}, { timestamps: true })

const Application = mongoose.model('Application', applicationSchema)

module.exports = Application