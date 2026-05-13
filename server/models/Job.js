const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship'],
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

const Job = mongoose.model('Job', jobSchema)

module.exports = Job