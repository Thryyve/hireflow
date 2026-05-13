const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')

const jobRoutes = require('./routes/jobRoutes')

const applicationRoutes = require('./routes/applicationRoutes')

dotenv.config()

connectDB()

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)

app.get('/', (req, res) => {
  res.send('Job Portal API is running')
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})