import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function CompanyDashboard() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    requirements: '',
    jobType: 'full-time'
  })
  const [message, setMessage] = useState('')

  const fetchCompanyJobs = async () => {
    const response = await fetch('/api/jobs/company', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    setJobs(data)
  }

  useEffect(() => {
    fetchCompanyJobs()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePostJob = async () => {
    try {
      const response = await fetch('/api/jobs/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split(',').map(r => r.trim())
        })
      })
      const data = await response.json()
      setMessage(data.message)
      fetchCompanyJobs()
    } catch (error) {
      setMessage('Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchCompanyJobs()
  }

  return (
    <div>
      <h2>Company Dashboard</h2>

      <h3>Post a Job</h3>
      {message && <p>{message}</p>}
      <input name="title" placeholder="Job Title" onChange={handleChange} />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="salary" placeholder="Salary" onChange={handleChange} />
      <input name="requirements" placeholder="Requirements (comma separated)" onChange={handleChange} />
      <select name="jobType" onChange={handleChange}>
        <option value="full-time">Full Time</option>
        <option value="part-time">Part Time</option>
        <option value="internship">Internship</option>
      </select>
      <button onClick={handlePostJob}>Post Job</button>

      <h3>Your Posted Jobs</h3>
      {jobs.length === 0 ? (
        <p>No jobs posted yet</p>
      ) : (
        jobs.map(job => (
          <div key={job._id}>
            <h4>{job.title}</h4>
            <p>{job.location} — {job.salary}</p>
            <p>{job.jobType}</p>
            <button onClick={() => handleDelete(job._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  )
}

export default CompanyDashboard