import { createContext, useState, useContext, useEffect } from 'react'
import API_URL from '../api'

const AuthContext = createContext()
const STORAGE_KEY = 'hireflow_auth'

const loadAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { user: null, token: null }

    const { user, token } = JSON.parse(stored)
    if (!user || !token) return { user: null, token: null }

    return { user, token }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return { user: null, token: null }
  }
}

const saveAuth = (user, token) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
}

const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const AuthProvider = ({ children }) => {
  const storedAuth = loadAuth()
  const [auth, setAuth] = useState(storedAuth)
  const [isLoading, setIsLoading] = useState(!!storedAuth.token)

  const logout = () => {
    setAuth({ user: null, token: null })
    clearStoredAuth()
  }

  const login = (userData, userToken) => {
    setAuth({ user: userData, token: userToken })
    saveAuth(userData, userToken)
    setIsLoading(false)
  }

  useEffect(() => {
    const validateToken = async () => {
      const { token } = loadAuth()
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.status === 401) {
          logout()
          return
        }

        if (!response.ok) {
          return
        }

        const data = await response.json()
        setAuth({ user: data.user, token })
        saveAuth(data.user, token)
      } catch {
        // Network error — keep cached session, don't force logout
      } finally {
        setIsLoading(false)
      }
    }

    validateToken()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user: auth.user, token: auth.token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
