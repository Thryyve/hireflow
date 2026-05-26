import API_URL from '../api'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const STATUS_OPTIONS = ['applied', 'reviewed', 'shortlisted', 'rejected']

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
  const [isError, setIsError] = useState(false)
  const [expandedJobId, setExpandedJobId] = useState(null)
  const [applications, setApplications] = useState([])

  const fetchCompanyJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/jobs/company`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message || 'Failed to load jobs')
        setIsError(true)
        setJobs([])
        return
      }
      if (!Array.isArray(data)) {
        setJobs([])
        return
      }
      setJobs(data)
    } catch (error) {
      setMessage('Something went wrong loading jobs')
      setIsError(true)
      setJobs([])
    }
  }

  const fetchApplications = async (jobId) => {
    try {
      const response = await fetch(`${API_URL}/api/applications/job/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message || 'Failed to load applications')
        setIsError(true)
        setApplications([])
        return
      }
      if (!Array.isArray(data)) {
        setApplications([])
        return
      }
      setApplications(data)
      setIsError(false)
    } catch (error) {
      setMessage('Something went wrong loading applications')
      setIsError(true)
      setApplications([])
    }
  }

  useEffect(() => {
    fetchCompanyJobs()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePostJob = async () => {
    try {
      const response = await fetch(`${API_URL}/api/jobs/post`, {
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
      if (!response.ok) {
        setMessage(data.message || 'Failed to post job')
        setIsError(true)
        return
      }
      setMessage(data.message)
      setIsError(false)
      fetchCompanyJobs()
    } catch (error) {
      setMessage('Something went wrong')
      setIsError(true)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message || 'Failed to delete job')
        setIsError(true)
        return
      }
      if (expandedJobId === id) {
        setExpandedJobId(null)
        setApplications([])
      }
      fetchCompanyJobs()
    } catch (error) {
      setMessage('Something went wrong')
      setIsError(true)
    }
  }

  const handleViewApplications = async (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null)
      setApplications([])
      return
    }
    setExpandedJobId(jobId)
    await fetchApplications(jobId)
  }

  const handleStatusChange = async (applicationId, status) => {
    try {
      const response = await fetch(`${API_URL}/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message || 'Failed to update status')
        setIsError(true)
        return
      }
      setMessage(data.message)
      setIsError(false)
      if (expandedJobId) {
        await fetchApplications(expandedJobId)
      }
    } catch (error) {
      setMessage('Something went wrong')
      setIsError(true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Dashboard</h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Post a New Job</h3>
        {message && (
          <p className={`text-sm mb-4 ${isError ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Job Title" onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="location" placeholder="Location" onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="salary" placeholder="Salary (e.g. 6-8 LPA)" onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select name="jobType" onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <textarea name="description" placeholder="Job Description" onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" />
        <input name="requirements" placeholder="Requirements (comma separated: React, Node.js, MongoDB)" onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={handlePostJob}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Post Job
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Posted Jobs ({jobs.length})</h3>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{job.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{job.location} — {job.salary}</p>
                  <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{job.jobType}</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.requirements?.map((req, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{req}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button onClick={() => handleViewApplications(job._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    {expandedJobId === job._id ? 'Hide Applications' : 'View Applications'}
                  </button>
                  <button onClick={() => handleDelete(job._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              </div>

              {expandedJobId === job._id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Applications ({applications.length})
                  </h5>
                  {applications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No applications yet</p>
                  ) : (
                    <div className="grid gap-3">
                      {applications.map(app => (
                        <div key={app._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-gray-50 rounded-lg p-4">
                          <div>
                            <p className="font-medium text-gray-800">{app.candidate?.name}</p>
                            <p className="text-gray-500 text-sm">{app.candidate?.email}</p>
                          </div>
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CompanyDashboard
