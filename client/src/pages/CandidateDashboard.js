import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function CandidateDashboard() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  const fetchJobs = async () => {
    const response = await fetch(`${API_URL}/api/jobs`)
    const data = await response.json()
    setJobs(data)
  }

  const fetchApplications = async () => {
    const response = await fetch(`${API_URL}/api/applications/my-applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    setApplications(data)
  }

  useEffect(() => {
    fetchJobs()
    fetchApplications()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleApply = async (jobId) => {
    try {
      const response = await fetch(`${API_URL}/api/applications/${jobId}/apply`, {
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

  const statusColors = {
    applied: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    shortlisted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Jobs</h2>

      <input
        placeholder="Search by title or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}

      <div className="grid gap-4 mb-10">
        {filteredJobs.map(job => (
          <div key={job._id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{job.title}</h4>
              <p className="text-gray-500 text-sm mt-1">{job.location} — {job.salary}</p>
              <p className="text-gray-500 text-sm">{job.company?.name}</p>
              <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{job.jobType}</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {job.requirements.map((req, i) => (
                  <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{req}</span>
                ))}
              </div>
            </div>
            {appliedJobIds.includes(job._id) ? (
              <button disabled
                className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed">
                Applied
              </button>
            ) : (
              <button onClick={() => handleApply(job._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                Apply
              </button>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-4">My Applications ({applications.length})</h3>
      {applications.length === 0 ? (
        <p className="text-gray-500">No applications yet</p>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => (
            <div key={app._id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{app.job.title}</h4>
                <p className="text-gray-500 text-sm mt-1">{app.job.location} — {app.job.salary}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[app.status]}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CandidateDashboard