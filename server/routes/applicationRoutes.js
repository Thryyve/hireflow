const express = require('express')
const router = express.Router()
const { applyToJob, getCandidateApplications, getJobApplications, updateApplicationStatus } = require('../controllers/applicationController')
const { protect, requireRole } = require('../middleware/authMiddleware')

router.post('/:id/apply', protect, requireRole('candidate'), applyToJob)
router.get('/my-applications', protect, requireRole('candidate'), getCandidateApplications)
router.get('/job/:id', protect, requireRole('company'), getJobApplications)
router.put('/:id/status', protect, requireRole('company'), updateApplicationStatus)

module.exports = router