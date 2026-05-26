// Set REACT_APP_API_URL in .env (local) or Vercel env vars (production).
// Local dev fallback only — production builds require the env var.
const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '')

export default API_URL