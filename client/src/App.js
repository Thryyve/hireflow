import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import CompanyDashboard from './pages/CompanyDashboard'
import CandidateDashboard from './pages/CandidateDashboard'

function App() {
  const { user, logout, isLoading } = useAuth()
  const [page, setPage] = useState('login')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-xl font-bold text-blue-600">HireFlow</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-gray-600 text-sm">Welcome, {user.name}</span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{user.role}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </nav>
        <div className="p-6">
          {user.role === 'company' && <CompanyDashboard />}
          {user.role === 'candidate' && <CandidateDashboard />}
        </div>
      </div>
    )
  }

  return (
    <div>
      <nav className="bg-white shadow-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl font-bold text-blue-600">HireFlow</h1>
        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => setPage('login')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === 'login' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Login
          </button>
          <button
            onClick={() => setPage('register')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === 'register' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Register
          </button>
        </div>
      </nav>
      {page === 'login' ? <Login /> : <Register />}
    </div>
  )
}

export default App