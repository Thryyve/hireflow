const Job = require('../models/Job')

const postJob = async (req, res) => {
  try {
    const { title, description, location, salary, requirements, jobType } = req.body

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      requirements,
      jobType,
      company: req.user.userId
    })

    res.status(201).json({ message: 'Job posted successfully', job })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', 'name email')
    res.status(200).json(jobs)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.userId })
    res.status(200).json(jobs)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (job.company.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this job' })
    }

    await job.deleteOne()
    res.status(200).json({ message: 'Job deleted successfully' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { postJob, getAllJobs, getCompanyJobs, deleteJob }