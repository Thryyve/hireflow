import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function CandidateDashboard() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  const fetchJobs = async () => {
    const response = await fetch('/api/jobs')
    const data = await response.json()
    setJobs(data)
  }

  const fetchApplications = async () => {
    const response = await fetch('/api/applications/my-applications', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    setApplications(data)
  }

  useEffect(() => {
    fetchJobs()
    fetchApplications()
  }, [])

  const handleApply = async (jobId) => {
    try {
      const response = await fetch(`/api/applications/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ coverLetter: '' })
      })
      const data = await response.json()
      setMessage(data.message)
      fetchApplications()
    } catch (error) {
      setMessage('Something went wrong')
    }
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  )

  const appliedJobIds = applications.map(app => app.job._id)

  return (
    <div>
      <h2>Candidate Dashboard</h2>

      <h3>Browse Jobs</h3>
      <input
        placeholder="Search by title or location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {message && <p>{message}</p>}

      {filteredJobs.map(job => (
        <div key={job._id}>
          <h4>{job.title}</h4>
          <p>{job.location} — {job.salary}</p>
          <p>{job.jobType}</p>
          <p>Requirements: {job.requirements.join(', ')}</p>
          {appliedJobIds.includes(job._id) ? (
            <button disabled>Already Applied</button>
          ) : (
            <button onClick={() => handleApply(job._id)}>Apply</button>
          )}
        </div>
      ))}

      <h3>My Applications</h3>
      {applications.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        applications.map(app => (
          <div key={app._id}>
            <h4>{app.job.title}</h4>
            <p>{app.job.location} — {app.job.salary}</p>
            <p>Status: {app.status}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default CandidateDashboard