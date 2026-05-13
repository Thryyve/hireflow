const express = require('express')
const router = express.Router()
const { applyToJob, getCandidateApplications, getJobApplications, updateApplicationStatus } = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/:id/apply', protect, applyToJob)
router.get('/my-applications', protect, getCandidateApplications)
router.get('/job/:id', protect, getJobApplications)
router.put('/:id/status', protect, updateApplicationStatus)

module.exports = router