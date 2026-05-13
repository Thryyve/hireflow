const express = require('express')
const router = express.Router()
const { postJob, getAllJobs, getCompanyJobs, deleteJob } = require('../controllers/jobController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getAllJobs)
router.post('/post', protect, postJob)
router.get('/company', protect, getCompanyJobs)
router.delete('/:id', protect, deleteJob)

module.exports = router