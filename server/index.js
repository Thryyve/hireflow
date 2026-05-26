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

// Set CLIENT_URL in .env (local) or Render env vars (production).
const clientOrigin =
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : undefined)

if (!clientOrigin) {
  console.error('CLIENT_URL must be set in production')
  process.exit(1)
}

app.use(cors({
  origin: clientOrigin,
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