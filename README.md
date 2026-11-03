# 🐾 PetCare Planner — Pet Care Records & Reminder Board

[![Node.js Version](https://img.shields.io/badge/Node.js-v24+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**Team Name:** PawTech Innovators  
**Course/Project:** Full-Stack MERN Capstone Project  

---

## 📌 Project Overview
**PetCare Planner** is an all-in-one pet health and routine management web application built on the MERN stack. It empowers pet owners to maintain comprehensive medical records, track vaccination schedules, organize grooming appointments, and receive timely overdue/upcoming reminders through an interactive care dashboard.

---

## 👥 Team Work Distribution & Progress Tracker

| # | Member Name | Roll Number | Branch | Assigned Role & Deliverable | Member Task Guide | Status |
|---|---|---|---|---|---|---|
| **1** | **SIDDARTHA RAJ** | `2303A51917` | CSE | **Frontend: Pet Profiles**<br>• React application structure & navigation<br>• Home page & dashboard layouts<br>• Pet profile forms (Add/Edit/View/Delete)<br>• Pet cards & responsive CSS | [📖 View Task Guide](tasks/01-siddartha-raj-frontend-pet-profiles/README.md) | 🔄 **In Progress**<br>*(Contract Ready)* |
| **2** | **CHIPPA VASU** | `2303A51618` | CSE | **Backend: Authentication**<br>• Node.js & Express auth setup<br>• User registration & login APIs<br>• User Mongoose model<br>• Password hashing (bcrypt) & JWT auth<br>• Protect middleware & authorization | [📖 View Task Guide](tasks/02-chippa-vasu-backend-auth/README.md) | 🔄 **In Progress**<br>*(Contract Ready)* |
| **3** | **BODASU NITHIN** | `2303A51803` | CSE | **Backend: Database & APIs**<br>• Pet and CareRecord MongoDB models<br>• Pet CRUD APIs<br>• Care record CRUD APIs<br>• Owner-data relational linking<br>• Request validation & Postman testing | [📖 View Task Guide](tasks/03-bodasu-nithin-backend-database-apis/README.md) | **✅ COMPLETED & LIVE** |
| **4** | **MATAPALLY MEGHANA** | `2303A52505` | CSE (AIML) | **Reminders & Timeline**<br>• Care history timeline per pet<br>• Upcoming & overdue date calculations<br>• Search & filters by pet, care type, date<br>• Upcoming reminders dashboard<br>• Date validation & edge cases | [📖 View Task Guide](tasks/04-matapally-meghana-reminders-timeline/README.md) | 🔄 **In Progress**<br>*(Contract Ready)* |
| **5** | **GODISHALA KRUTHIK ROSHAN** | `2303A52339` | **CSE (AIML)** | **Frontend & Backend Integration**<br>• Project structure & repository definition<br>• Coordinate frontend & backend integration<br>• Connect React pages to backend APIs<br>• Automated healthchecks & error handling<br>• Full API documentation & submission package | [📖 View Task Guide](tasks/05-godishala-kruthik-roshan-integration/README.md) | **✅ COMPLETED & LIVE** |

> Detailed task breakdown and next steps for all members are documented in [docs/TASKS_ROADMAP.md](docs/TASKS_ROADMAP.md).

---

## 🏗️ System Architecture & Folder Layout

```text
petcare-planner/
├── package.json              # Root build & coordination scripts
├── .gitignore                # Production ignore rules
├── .env.example              # Master environment configuration
├── README.md                 # Master documentation (this file)
├── docs/
│   ├── API_DOCUMENTATION.md  # Complete REST API reference
│   ├── ARCHITECTURE.md       # Integration guide & data flow
│   └── TASKS_ROADMAP.md      # Remaining member task roadmaps
├── tasks/
│   ├── 01-siddartha-raj-frontend-pet-profiles/README.md
│   ├── 02-chippa-vasu-backend-auth/README.md
│   ├── 03-bodasu-nithin-backend-database-apis/README.md
│   ├── 04-matapally-meghana-reminders-timeline/README.md
│   └── 05-godishala-kruthik-roshan-integration/README.md
├── server/
│   ├── package.json          # Express, Mongoose, JWT, bcryptjs dependencies
│   ├── .env.example          # Server environment settings
│   ├── test-integration.js   # Automated integration handshake test script
│   └── src/
│       ├── server.js         # Master Express server & router mounting
│       ├── config/db.js      # MongoDB Mongoose connection handler
│       ├── middleware/       # Auth guard & centralized error handler
│       ├── models/           # Mongoose schemas (User, Pet, CareRecord)
│       ├── controllers/      # Modular business logic controllers
│       └── routes/           # REST endpoints (/auth, /pets, /records, /reminders)
└── client/
    ├── package.json          # React 18, React Router, Axios, Vite
    ├── vite.config.js        # Vite dev server + /api proxy to port 5000
    ├── .env.example          # Client environment variables
    └── src/
        ├── main.jsx          # React DOM entry
        ├── App.jsx           # App layout & client routing
        ├── index.css         # Modern, responsive mobile-first UI styling
        ├── api/              # Centralized Axios client & modular services
        ├── context/          # React AuthContext
        ├── components/       # Reusable components (Navbar, Footer, ApiStatusBadge)
        └── pages/            # Dashboard, PetProfiles, Reminders, Auth, Team
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on v24.14.1)
- **npm** v9+ (tested on v11.11.0)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Installation
Install all dependencies for root, backend server, and frontend client:
```bash
# From the project root:
npm run install:all
```
*(Or install individually: `cd server && npm install` then `cd ../client && npm install`)*

### 3. Environment Setup
Copy the template files:
```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env
```

**`server/.env` defaults:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/petcare_planner
JWT_SECRET=supersecret_jwt_key_pawtech_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**`client/.env` defaults:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Running the Application

Open two terminal windows:

**Terminal 1 — Backend API Server:**
```bash
cd server
npm run dev
# Server starts at http://localhost:5000
# Live health check available at http://localhost:5000/api/health
```

**Terminal 2 — Frontend React App:**
```bash
cd client
npm run dev
# Vite dev server starts at http://localhost:5173
```

Now open **http://localhost:5173** in your browser.

---

## 🧪 Integration Verification & Testing

Member 5 has provided an automated end-to-end integration test verifying all backend routes, MongoDB connectivity, and HTTP status codes:

```bash
# Run integration check:
node server/test-integration.js
```

**Expected output:**
```text
[Integration Test] Test server running on 127.0.0.1:5005
[Integration Test] Verifying GET /api/health ...
  -> Status: 200 | Project: PetCare Planner — Pet Care Records & Reminder Board
[Integration Test] Verifying GET /api/pets ...
  -> Status: 200 | Pet Count: 13
[Integration Test] Verifying GET /api/records ...
  -> Status: 200 | Record Count: 42
[Integration Test] Verifying GET /api/reminders ...
  -> Status: 200 | Summary: {"total":42,"upcomingCount":24,"overdueCount":14}
[Integration Test] ✅ ALL ROUTES AND INTEGRATION CHECKS PASSED!
```

To test client production build:
```bash
npm --prefix client run build
```

---

## 📡 Key API Endpoints Summary

| Method | Endpoint | Description | Assigned Member |
|---|---|---|---|
| `GET` | `/api/health` | Service status, DB connectivity, route dictionary | Godishala Kruthik Roshan |
| `POST` | `/api/auth/register` | Register new pet owner | Chippa Vasu |
| `POST` | `/api/auth/login` | Authenticate owner & return JWT | Chippa Vasu |
| `GET` | `/api/auth/me` | Fetch authenticated owner profile | Chippa Vasu |
| `GET` | `/api/pets` | Retrieve all registered pet profiles | Bodasu Nithin & Siddartha Raj |
| `POST` | `/api/pets` | Create a new pet profile | Bodasu Nithin & Siddartha Raj |
| `PUT` | `/api/pets/:id` | Update pet details | Bodasu Nithin & Siddartha Raj |
| `DELETE`| `/api/pets/:id` | Remove pet profile | Bodasu Nithin & Siddartha Raj |
| `GET` | `/api/records` | List care records (filters: petId, careType) | Bodasu Nithin |
| `POST` | `/api/records` | Add medical / routine care entry | Bodasu Nithin |
| `GET` | `/api/reminders` | Calculated upcoming, overdue, due-today care | Matapally Meghana |

*For complete request payloads, parameters, and status codes, see [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).*

---

## 🔒 Security & Best Practices Implemented
- **CORS Protection:** Configured with strict origin allowlists (`CLIENT_URL`).
- **Token Security:** Bearer JWT tokens attached through centralized Axios request interceptors.
- **Graceful Fault Tolerance:** Backend handles database connection lag without application crash.
- **Centralized Error Handling:** Uniform JSON responses across all controllers (`success`, `message`, `timestamp`).
- **Clean Git Hygiene:** Strictly ignores environment secrets, node dependencies, and build artifacts.

---

## 🎯 Submission Package Checklist
- [x] Full Git repository organized with clean directory hierarchy
- [x] Complete MERN stack foundation configured and operational
- [x] Frontend-backend integration active with live status telemetry
- [x] Comprehensive `.env.example` templates created
- [x] REST API endpoints documented with full JSON schemas
- [x] End-to-end integration test suite implemented & passing
- [x] Team work distribution and updated remaining member tasks published
