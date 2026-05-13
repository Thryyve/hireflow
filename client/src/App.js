import { useState } from 'react'

function App() {
  const [message, setMessage] = useState('')

  const testBackend = async () => {
    const response = await fetch('/api/auth/me')
    const data = await response.json()
    setMessage(data.message)
  }

  return (
    <div>
      <h1>Job Portal</h1>
      <button onClick={testBackend}>Test Backend</button>
      <p>{message}</p>
    </div>
  )
}

export default App