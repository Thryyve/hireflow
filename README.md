# HireFlow

> A modern job portal with a full ATS workflow — built for companies that hire and candidates who hustle.

HireFlow lets companies post jobs, review applicants, and move them through a clear ATS pipeline. Candidates discover roles, submit applications in one click, and track their status in real time. Authentication is role-based (company vs. candidate) using JWT, so every action is properly protected. The UI is fast, clean, and built around real hiring flows.

[![License: ISC](https://img.shields.io/badge/license-ISC-blue?style=flat-square)](./server/package.json)
[![React](https://img.shields.io/badge/React-19.2.6-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Stars](https://img.shields.io/github/stars/Thryyve/hireflow?style=flat-square)](https://github.com/Thryyve/hireflow/stargazers)
[![Forks](https://img.shields.io/github/forks/Thryyve/hireflow?style=flat-square)](https://github.com/Thryyve/hireflow/network/members)

---

<!-- Add a screenshot or demo GIF here — recommended size: 1280×720 -->
<!-- ![HireFlow Demo](./docs/demo.gif) -->

🌐 **Live Demo:** [job-portal-six-opal.vercel.app](https://job-portal-six-opal.vercel.app)  
🔌 **Backend API:** [job-portal-backend-iewu.onrender.com](https://job-portal-backend-iewu.onrender.com)

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#️-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

- [x] Role-based JWT authentication for companies and candidates — right actions, always protected
- [x] Company dashboard to post, list, and delete job listings
- [x] Candidate job feed with search by title and location
- [x] One-click job application with duplicate-application prevention
- [x] Full ATS status pipeline: `applied` → `reviewed` → `shortlisted` → `rejected`
- [x] Candidate-side application tracking with live status display
- [x] Company-side application review with secure status updates
- [x] MongoDB-backed persistence with Mongoose schemas and population for rich API responses

---

## 🛠️ Tech Stack

| Area | Technologies |
|---|---|
| **Frontend** | React 19.2.6, React Scripts 5.0.1, Tailwind CSS 3.4.19 |
| **Backend** | Node.js, Express 4.18.2, Mongoose 9.6.2 |
| **Auth** | JSON Web Tokens (jsonwebtoken 9.0.3), bcryptjs 3.0.3 |
| **Database** | MongoDB (Atlas) via Mongoose models |
| **DevOps** | Vercel (frontend), Render (backend), dotenv config |
| **Testing** | Jest + React Testing Library (via CRA `react-scripts test`) |

---

## 🚀 Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) **v20+**
- [MongoDB](https://www.mongodb.com/) — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A JWT secret string for token signing

### Installation

**1. Clone the repository**

```bash
git clone git@github.com:Thryyve/hireflow.git
cd hireflow
```

**2. Install backend dependencies**

```bash
cd server
npm install
```

**3. Configure backend environment**

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hireflow
JWT_SECRET=your_super_secret_string_here
PORT=8000
CLIENT_URL=http://localhost:3000
```

**4. Install frontend dependencies**

```bash
cd ../client
npm install
```

**5. Configure frontend environment**

```bash
cp .env.example .env
# Set REACT_APP_API_URL if your backend URL differs from http://localhost:8000
```

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/hireflow` |
| `JWT_SECRET` | Secret used to sign JWT tokens | `your_super_secret_string` |
| `PORT` | Backend server port | `8000` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:3000` |
| `REACT_APP_API_URL` | Frontend API base URL | `http://localhost:8000` |

### Running the Project

Run the backend and frontend in separate terminals:

**Terminal 1 — Backend (dev mode)**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd client
npm start
```

**Production build**

```bash
# Frontend
cd client && npm run build

# Backend
cd server && npm start
```

---

## 📁 Project Structure

```
hireflow/
├── client/                         # React frontend
│   └── src/
│       ├── api.js                  # API base URL config (REACT_APP_API_URL)
│       ├── context/
│       │   └── AuthContext.js      # JWT session handling (httpOnly cookies in production)
│       └── pages/
│           ├── CompanyDashboard.js # Job posting + application status management
│           └── CandidateDashboard.js # Job browsing + application tracking
└── server/                         # Express API
    ├── index.js                    # App entry — CORS, route mounting
    ├── routes/                     # REST route definitions (auth, jobs, applications)
    ├── controllers/                # Business logic per domain
    └── models/                     # Mongoose schemas — User, Job, Application
```

---

## 🌐 API Documentation

All requests use JSON bodies. Protected routes require the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register as `company` or `candidate` | — |
| `POST` | `/api/auth/login` | Login and receive a signed JWT | — |
| `GET` | `/api/auth/me` | Get authenticated user profile | ✅ Any |
| `GET` | `/api/jobs` | List all jobs (includes company name & email) | — |
| `POST` | `/api/jobs/post` | Post a new job listing | ✅ Company |
| `GET` | `/api/jobs/company` | List jobs posted by the authenticated company | ✅ Company |
| `DELETE` | `/api/jobs/:id` | Delete a job posted by the authenticated company | ✅ Company |
| `POST` | `/api/applications/:id/apply` | Apply to a job (prevents duplicates) | ✅ Candidate |
| `GET` | `/api/applications/my-applications` | List applications by the authenticated candidate | ✅ Candidate |
| `GET` | `/api/applications/job/:id` | List all applications for a specific job | ✅ Company |
| `PUT` | `/api/applications/:id/status` | Update ATS status for an application | ✅ Company |

**Supported ATS statuses:** `applied` · `reviewed` · `shortlisted` · `rejected`

---

## 🧪 Testing

Frontend tests use **Jest** and **React Testing Library** via Create React App.

```bash
# Run tests in watch mode
cd client && npm test

# Run once (CI mode)
cd client && npm test -- --watchAll=false

# With coverage report
cd client && npm test -- --watchAll=false --coverage
```
---

## 🚢 Deployment

**Frontend → Vercel**

1. Connect the `client/` directory to a new Vercel project.
2. Add environment variable:
   - `REACT_APP_API_URL` → your backend URL (e.g. `https://job-portal-backend-iewu.onrender.com`)

**Backend → Render**

1. Connect the `server/` directory to a new Render Web Service.
2. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (default `8000`)
   - `CLIENT_URL` → your frontend URL (e.g. `https://job-portal-six-opal.vercel.app`)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `feat/<short-description>`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add job search filters
   fix: prevent duplicate applications
   docs: improve API documentation
   ```
4. Push your branch and open a Pull Request

**Code style:** ESLint is configured via CRA defaults (`react-app` + `react-app/jest`) in `client/package.json`.

---

## 📄 License

Distributed under the **ISC License**. See [`server/package.json`](./server/package.json) for details.

---

## 👤 Author

Made by **[Aayam Sinha]**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0a66c2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/aayam-sinha/)
[![Email](https://img.shields.io/badge/Email-Say%20Hi-ea4335?style=flat-square&logo=gmail)](mailto:sinhaaayam12@email.com)
