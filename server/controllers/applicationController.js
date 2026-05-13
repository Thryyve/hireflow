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

const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

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

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    res.status(200).json({ message: 'Status updated', application })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { applyToJob, getCandidateApplications, getJobApplications, updateApplicationStatus }
