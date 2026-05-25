const Application = require('../models/Application')
const Job = require('../models/Job')

const applyToJob = async (req, res) => {
  try {
    const { coverLetter } = req.body
    const jobId = req.params.id

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.userId
    })

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' })
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.userId,
      coverLetter
    })

    res.status(201).json({ message: 'Applied successfully', application })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.userId })
      .populate('job', 'title location salary company jobType')
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const VALID_STATUSES = ['applied', 'reviewed', 'shortlisted', 'rejected']

const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (job.company.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const applications = await Application.find({ job: req.params.id })
      .populate('candidate', 'name email')

    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const application = await Application.findById(req.params.id).populate('job')

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    if (application.job.company.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    application.status = status
    await application.save()

    res.status(200).json({ message: 'Status updated', application })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { applyToJob, getCandidateApplications, getJobApplications, updateApplicationStatus }
