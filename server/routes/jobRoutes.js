const express = require('express')
const router = express.Router()
const { postJob, getAllJobs, getCompanyJobs, deleteJob } = require('../controllers/jobController')
const { protect, requireRole } = require('../middleware/authMiddleware')

router.get('/', getAllJobs)
router.post('/post', protect, requireRole('company'), postJob)
router.get('/company', protect, requireRole('company'), getCompanyJobs)
router.delete('/:id', protect, requireRole('company'), deleteJob)

module.exports = router