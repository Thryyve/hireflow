import { render, screen } from '@testing-library/react'
import App from './App'
import { AuthProvider } from './context/AuthContext'

test('renders login page when not authenticated', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  )
  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  expect(screen.getByText('HireFlow')).toBeInTheDocument()
})
