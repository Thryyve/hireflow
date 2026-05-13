import API_URL from '../api'
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
    const response = await fetch(`${API_URL}/api/jobs/company`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    setJobs(data)
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
      setMessage(data.message)
      fetchCompanyJobs()
    } catch (error) {
      setMessage('Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/jobs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchCompanyJobs()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Dashboard</h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Post a New Job</h3>
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        <div className="grid grid-cols-2 gap-4">
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
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{job.title}</h4>
                <p className="text-gray-500 text-sm mt-1">{job.location} — {job.salary}</p>
                <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{job.jobType}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.requirements.map((req, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{req}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => handleDelete(job._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CompanyDashboard