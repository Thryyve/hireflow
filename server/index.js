const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const mongoose = require('mongoose')

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err))

const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Job Portal API is running')
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})