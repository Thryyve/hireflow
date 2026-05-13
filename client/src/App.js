import { useAuth } from './context/AuthContext'
import Login from './pages/Login'

function App() {
  const { user } = useAuth()

  return (
    <div>
      {user ? (
        <h1>Welcome, {user.name}</h1>
      ) : (
        <Login />
      )}
    </div>
  )
}

export default App