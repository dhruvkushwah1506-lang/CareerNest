# 💼 CareerNest — Modern Full-Stack Recruitment Platform

CareerNest is a high-performance **MERN** application designed to streamline the connection between top-tier talent and recruiters. Built with a focus on modern aesthetics (glassmorphism/minimalism) and technical efficiency, it offers a dual-role experience for Students and Recruiters.

---

## 🚀 Key Modules & Functionality

### 👤 User & Authentication
- **Secure Auth**: Implements JWT-based authentication stored in HttpOnly cookies to prevent XSS.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Student` and `Recruiter` across the entire application.
- **Dynamic Profiles**: Students can update their bio, skills, and upload resumes, with real-time feedback via **Sonner** toasts.

### 🏢 Recruiter Workflow
- **Company Branding**: Register organizations and upload hi-res logos directly to **Cloudinary**.
- **Job Orchestration**: Full CRUD for job postings with detailed metadata (salary, location, type, experience level).
- **Candidate Pipeline**: A dedicated dashboard for every job listing to view applicants, download resumes, and update hiring statuses (**Pending**, **Accepted**, **Rejected**).

### 🔍 Student & Candidate Experience
- **Advanced Job Search**: Instant filtering by title, company, or location on the Home and Jobs pages.
- **Company Directory**: A public "Browse" tab to explore all registered organizations and their mission.
- **Application Status**: Track all your submissions in one place with color-coded status badges.
- **Smart Logic**: Prevents duplicate applications and provides instant loading states during the submission process.

---

## 🛠️ Technical Implementation

| Layer | Technologies | Highlights |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS 4 | Glassmorphic UI via **Shadcn UI**, specialized hooks for data fetching. |
| **Backend** | Node.js, Express 5 | Robust MVC architecture, request validation, and cookie-based sessions. |
| **Storage** | Cloudinary, Multer | On-the-fly image processing and secure document uploads. |
| **State** | Redux Toolkit, Redux Persist | Persistent user sessions and cross-component search query synchronization. |
| **Database** | MongoDB Atlas | Complex aggregations and `.populate()` for deep relational data. |

---

## 📂 Project Structure

```bash
JOB-management/
├── backend/
│   ├── controllers/      # Business logic (User, Job, Company, Application)
│   ├── models/           # Mongoose schemas with validation
│   ├── routes/           # RESTful API endpoints
│   ├── middlewares/      # JWT auth & Multer file handling
│   └── index.js          # Entry point with Express & DB connection
└── frontend/
    ├── src/
    │   ├── components/   # Atomic UI components, Admin views, Auth flows
    │   ├── hooks/        # Custom data fetchers (useGetAllJobs, useGetAllCompanies)
    │   ├── redux/        # Global state (auth, job, company, application)
    │   └── lib/          # Axios instance & shared utilities
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🔌 Core API Documentation

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/user/profile/update` | POST | Yes | Update bio, skills, and professional profile. |
| `/api/job/get` | GET | Yes | Fetch and filter all jobs via query params. |
| `/api/company/register` | POST | Yes | Initialize a new organization profile. |
| `/api/application/apply/:id`| POST | Yes | Secure job submission with duplication checks. |
| `/api/application/update/:id`| POST | Yes | Recruiter status update for a candidate. |

---

## 🛠️ Local Development & Setup

### 1. Prerequisites
- **Node.js** v20+
- **npm** v10+
- **MongoDB Atlas** Cluster

### 2. Environment Setup
Create a `.env` in the `backend` folder:
```env
PORT=3000
MONGO_URI=your_atlas_connection_string
SECRET_KEY=your_secure_jwt_secret
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret
```

### 3. Execution
```bash
# Clone & Install
git clone https://github.com/your-username/JOB-management.git
npm install # in both root and /frontend

# Run Servers
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

## 📄 License
Licensed under the ISC License. Portions of the UI leverage open-source Shadcn components.