# QuickHire – Modern Career & Placement Management Portal
> **ICT Academy of Kerala (ICTAK) – Summer Internship Capstone Project**  
> **Course:** Full Stack Application Development with ReactJS (MERN Stack)  
> **Developer:** Aradhana Rose  

---

##  Overview
**QuickHire** is a modern, responsive full-stack career and placement management web platform built using the **MERN Stack** (MongoDB, Express.js, React.js, and Node.js). 

It connects ambitious job seekers (candidates) with hiring organizations (recruiters) through an intuitive single-page interface, robust REST APIs, and role-based access control.

---

##  Key Features

### For Candidates (Job Seekers)
-  **Dynamic Discovery:** Real-time keyword search (title, company, description) and faceted category filters.
-  **Filter by Type:** Filter opportunities across Full-Time, Part-Time, Remote, and Internship roles.
-  **Single-Click Application:** Submit applications with phone, resume/portfolio link, and cover note.
-  **Duplicate Prevention:** Database-enforced compound index prevents duplicate submissions for the same opening.
-  **"My Applications" Tracker:** Real-time visibility into hiring statuses (*Pending*, *Reviewing*, *Shortlisted*, *Rejected*) and employer notes.

### For Recruiters & Placement Officers
-  **Vacancy Authoring:** Create, update, or remove job listings with customizable requirements, experience, and salary packages.
-  **Recruiter Dashboard:** Live metrics tracking total vacancies, incoming candidate applications, shortlisted talent, and pending reviews.
-  **Candidate Roster:** Inspect submitted applications, review candidate resume links, and update candidate hiring stages (*Shortlist*, *Review*, *Reject*) with private notes.

### System & Engineering Highlights
-  **Stateless Authentication:** JSON Web Tokens (JWT) and salted password hashing with `bcryptjs`.
-  **Role Guards:** Strictly isolated recruiter and candidate permissions on both server middleware and React route guards.
-  **4 Core Screen States:** Seamless handling of *Loading*, *Success*, *Empty*, and *Error* states with contextual retry triggers.
-  **Mobile-First Responsive Design:** Clean layout tested across mobile viewports, tablets, and wide screens.

---

##  Quick Demo Credentials for Evaluators

For easy evaluation without manual sign-up:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Recruiter / Admin** | `recruiter@quickhire.com` | `password123` | Post jobs, edit/delete listings, review applicants, update hiring status. |
| **Candidate (User)** | `candidate@quickhire.com` | `password123` | Browse jobs, submit applications, track application status. |

*(Both accounts are pre-seeded in the database).*

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 (Vite), React Router DOM v7, Lucide Icons, Modern CSS3 |
| **Backend** | Node.js, Express.js (REST API, MVC Architecture) |
| **Database** | MongoDB Atlas (Cloud Cluster) with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **Deployment** | Vercel (Frontend), Render (Backend API), MongoDB Atlas (Database) |

---

##  Project Directory Structure

```text
quickhire-capstone/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, JobCard, ApplyModal, 4-State UI
│   │   ├── context/            # AuthContext (JWT & session state)
│   │   ├── pages/              # Home, JobDetails, Login, Register, Dashboards
│   │   ├── services/           # Centralized API client (fetch wrapper)
│   │   ├── App.jsx             # Router and layout
│   │   └── index.css           # Responsive design system
│   ├── .env.example
│   └── package.json
├── server/                     # Express.js & Node.js Backend API
│   ├── src/
│   │   ├── config/             # MongoDB connection (with Atlas & local fallback)
│   │   ├── controllers/        # Auth, Job, and Application controllers
│   │   ├── middleware/         # JWT verification, Role authorization, Error handler
│   │   ├── models/             # User, Job, Application schemas
│   │   ├── routes/             # RESTful API route declarations
│   │   ├── seed.js             # Initial database seed script
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   └── package.json
├── SRS_DOCUMENT.md             # Complete Software Requirements Specification
├── PROJECT_REPORT.md           # Formal ICTAK Summer Internship Report
├── .gitignore
└── README.md
```

---

##  Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Git

### 1. Clone or Open the Repository
```bash
git clone <your-repository-url>
cd quickhire-capstone
```

### 2. Configure Backend (`server/`)
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.avnewsh.mongodb.net/QuickHireDB?retryWrites=true&w=majority
JWT_SECRET=quickhire_jwt_secret_key_ictak_capstone_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Seed the initial demo data into MongoDB Atlas:
```bash
npm run seed
```

Start the backend API server:
```bash
npm run dev
# Server runs on: http://localhost:5000
```

### 3. Configure Frontend (`client/`)
In a second terminal window:
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
# Client runs on: http://localhost:5173
```

Open **`http://localhost:5173`** in your browser!

---

## 📡 REST API Contract

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new candidate or recruiter |
| `POST` | `/api/auth/login` | Public | Authenticate user & retrieve JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in profile data |
| `GET` | `/api/jobs` | Public | List active jobs (with search, category, type) |
| `GET` | `/api/jobs/:id` | Public | Retrieve single job specifications |
| `POST` | `/api/jobs` | Recruiter | Post new job opening |
| `PUT` | `/api/jobs/:id` | Recruiter | Update existing job |
| `DELETE`| `/api/jobs/:id` | Recruiter | Delete job posting & related applications |
| `GET` | `/api/jobs/my-jobs` | Recruiter | Retrieve jobs posted by logged-in recruiter |
| `POST` | `/api/applications/:jobId` | Candidate | Submit job application |
| `GET` | `/api/applications/my-applications`| Candidate | View user's applied jobs & status tracker |
| `GET` | `/api/applications/job/:jobId` | Recruiter | View candidate submissions for a job |
| `PUT` | `/api/applications/:id/status` | Recruiter | Update candidate status (Shortlist/Reject/Review) |
| `GET` | `/api/applications/recruiter-stats` | Recruiter | Overview statistics for recruiter dashboard |

---

##  Free Cloud Deployment Instructions

### 1. MongoDB Database
- Use [MongoDB Atlas](https://www.mongodb.com/atlas).
- Under **Network Access**, ensure `0.0.0.0/0` is added to allow access from cloud providers.

### 2. Backend Deployment on Render
1. Create a free account on [Render.com](https://render.com).
2. Click **New +** > **Web Service** and connect your GitHub repo.
3. Configure settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<Your secret key>`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `<Your Vercel frontend URL>`

### 3. Frontend Deployment on Vercel
1. Create a free account on [Vercel.com](https://vercel.com).
2. Import your GitHub repository.
3. Configure settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
4. Add Environment Variable:
   - `VITE_API_URL`: `<Your Render Backend URL>/api`
5. Click **Deploy**.

---

## 📑 Included Capstone Deliverables
- [x] **[SRS Document](SRS_DOCUMENT.md)** – Comprehensive Software Requirements Specification.
- [x] **[Final Project Report](PROJECT_REPORT.md)** – Formal Internship Report formatted to ICTAK standards.
- [x] **Clean Modular Codebase** – Separated `client` & `server` with no committed secrets.
- [x] **Pre-seeded Demo Accounts** – Immediate evaluation testing out-of-the-box.
