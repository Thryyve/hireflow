# HireFlow

A full stack Job Portal with ATS (Applicant Tracking System) built with the MERN stack.

## Live Demo
- Frontend: https://job-portal-six-opal.vercel.app
- Backend: https://job-portal-backend-iewu.onrender.com

## Features

### For Companies
- Register and login as a company
- Post, view and delete job listings
- View applications received for each job
- Update application status (reviewed, shortlisted, rejected)

### For Candidates
- Register and login as a candidate
- Browse and search all job listings
- Apply to jobs with one click
- Track application status in real time

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT, bcryptjs
- **Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites
- Node.js v20+
- MongoDB Atlas account

### Installation

1. Clone the repository
```bash
   git clone git@github.com:Thryyve/hireflow.git
   cd hireflow
```

2. Install backend dependencies
```bash
   cd server
   npm install
```

3. Create server env file from the template
```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
```

4. Install frontend dependencies
```bash
   cd ../client
   npm install
```

5. Create client env file from the template
```bash
   cd client
   cp .env.example .env
```

6. Run the app
```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm start
```

## Deployment

### Vercel (frontend)
Set this environment variable in **Project → Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `REACT_APP_API_URL` | Your Render backend URL (e.g. `https://job-portal-backend-iewu.onrender.com`) |

Do not commit `.env` or `.env.production` — use Vercel env vars instead. See `client/.env.example` for local setup.

### Render (backend)
Set `MONGO_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URL` (your Vercel frontend URL, e.g. `https://job-portal-six-opal.vercel.app`).

## API Reference

### Auth
| Method | URL | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged in user |

### Jobs
| Method | URL | Description |
|---|---|---|
| GET | `/api/jobs` | Get all jobs |
| POST | `/api/jobs/post` | Post a job |
| GET | `/api/jobs/company` | Get company jobs |
| DELETE | `/api/jobs/:id` | Delete a job |

### Applications
| Method | URL | Description |
|---|---|---|
| POST | `/api/applications/:id/apply` | Apply to job |
| GET | `/api/applications/my-applications` | Get my applications |
| GET | `/api/applications/job/:id` | Get job applications |
| PUT | `/api/applications/:id/status` | Update status |

## Project Structure
hireflow/
├── client/                 → React frontend
│   ├── src/
│   │   ├── context/        → Auth context
│   │   ├── pages/          → Login, Register, Dashboards
│   │   └── api.js          → API URL helper
└── server/                 → Node.js backend
├── config/             → Database connection
├── controllers/        → Business logic
├── middleware/         → Auth middleware
├── models/             → MongoDB schemas
└── routes/             → API routes