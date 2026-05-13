import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import CompanyDashboard from './pages/CompanyDashboard'
import CandidateDashboard from './pages/CandidateDashboard'

function App() {
  const { user, logout } = useAuth()
  const [page, setPage] = useState('login')

  if (user) {
    return (
      <div>
        <h2>Welcome, {user.name}</h2>
        <p>Role: {user.role}</p>
        <button onClick={logout}>Logout</button>
        {user.role === 'company' && <CompanyDashboard />}
        {user.role === 'candidate' && <CandidateDashboard />}
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => setPage('login')}>Login</button>
      <button onClick={() => setPage('register')}>Register</button>
      {page === 'login' ? <Login /> : <Register />}
    </div>
  )
}

export default App