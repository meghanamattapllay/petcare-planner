# 📋 PetCare Planner — Team Task Distribution & Progress Roadmap

**Team:** PawTech Innovators  
**Project:** PetCare Planner — Pet Care Records & Reminder Board  
**Integration & Project Lead:** Godishala Kruthik Roshan (Roll: `2303A52339` · Branch: CSE AIML)

---

## Team Overview & Roles

| # | Member Name | Roll Number | Branch | Assigned Role | Integration Status |
|---|---|---|---|---|---|
| 5 | **GODISHALA KRUTHIK ROSHAN** | `2303A52339` | CSE (AIML) | **Integration & Project Lead** | **COMPLETED & VERIFIED** |
| 1 | **SIDDARTHA RAJ** | `2303A51917` | CSE | Frontend: Pet Profiles | Active / Contract Ready |
| 2 | **CHIPPA VASU** | `2303A51618` | CSE | Backend: Authentication | Active / Contract Ready |
| 3 | **BODASU NITHIN** | `2303A51803` | CSE | Backend: Database & APIs | Active / Contract Ready |
| 4 | **MATAPALLY MEGHANA** | `2303A52505` | CSE (AIML) | Reminders & Timeline | Active / Contract Ready |

---

## Detailed Task Breakdown

### 5. GODISHALA KRUTHIK ROSHAN — Integration & Project Lead (COMPLETED)
- [x] **Project Structure & Git Organization:**
  - Defined clean MERN stack structure with separated `client/`, `server/`, and `docs/` directories.
  - Initialized root `package.json`, `.gitignore`, and unified dependency management.
- [x] **Frontend-Backend Integration Bridge:**
  - Configured CORS, Express body parsing, URL encoding, and request tracing middleware.
  - Implemented Vite proxy routing (`/api` -> `localhost:5000`) for frictionless dev flow.
  - Built centralized Axios client (`client/src/api/apiClient.js`) with automatic JWT interceptors and error recovery.
  - Added real-time healthcheck endpoint (`GET /api/health`) with database status detection.
  - Built `ApiStatusBadge.jsx` component displaying live API connectivity status in the navbar.
- [x] **Modular API Routing & Interfaces:**
  - Structured Express route handlers for Auth, Pets, CareRecords, and Reminders with clear contract signatures.
  - Integrated React Router 6 navigation across Dashboard, Profiles, Reminders, Auth, and Team pages.
- [x] **Verification & Quality Assurance:**
  - Built and tested `server/test-integration.js` verifying 100% pass on all API endpoints.
  - Tested production client bundle with Vite (`npm run build:client`) building cleanly in <1s.
- [x] **Security & Documentation:**
  - Created `.env.example` templates in root, server, and client.
  - Authored comprehensive `README.md`, `docs/API_DOCUMENTATION.md`, and `docs/ARCHITECTURE.md`.

---

### 1. SIDDARTHA RAJ — Frontend: Pet Profiles (Remaining Tasks)
**Primary Files:** `client/src/pages/PetProfiles.jsx`, `client/src/components/`, `client/src/index.css`
- [ ] **Pet Details Modal/Page:** Build dedicated detail view displaying full medical history, weight logs, and veterinarian notes for an individual pet.
- [ ] **Image Upload & Avatar Preview:** Integrate local image preview or file upload selector for pet profile pictures.
- [ ] **Form Validation:** Add client-side validation rules for pet age (positive numbers), weight, and required species.
- [ ] **Edit Pet Feature:** Wire up `petService.updatePet(id, data)` to open an edit form pre-populated with existing pet details.
- [ ] **CSS Animations:** Enhance hover transitions on pet cards and empty state graphics for responsive mobile display.

---

### 2. CHIPPA VASU — Backend: Authentication (Remaining Tasks)
**Primary Files:** `server/src/controllers/authController.js`, `server/src/routes/authRoutes.js`, `server/src/middleware/authMiddleware.js`, `server/src/models/User.js`
- [ ] **Password Security:** Verify bcryptjs salting rounds (10 rounds) and ensure passwords are never returned in JSON responses (`select: false`).
- [ ] **Token Expiration & Refresh:** Ensure JWT token lifespan (`7d`) is properly handled and returns a clear `401 Unauthorized` message upon expiration.
- [ ] **User Profile Update API:** Add `PUT /api/auth/profile` allowing users to update their name, email, or reset their password.
- [ ] **Owner Authorization Check:** Verify that users can only access and modify pets and records that match their `req.user.id`.
- [ ] **Input Sanitization:** Add validation for email format and password strength (minimum 6 characters with special characters).

---

### 3. BODASU NITHIN — Backend: Database & APIs (Remaining Tasks)
**Primary Files:** `server/src/controllers/petController.js`, `server/src/controllers/recordController.js`, `server/src/models/Pet.js`, `server/src/models/CareRecord.js`
- [ ] **Mongoose Schema Optimization:** Add index on `{ owner: 1 }` and `{ pet: 1, nextDueDate: 1 }` for high-performance query execution.
- [ ] **CareRecord Update API:** Implement `PUT /api/records/:id` to allow pet owners to edit dosage, dates, or notes of an existing care record.
- [ ] **Strict Owner Association:** Enforce `owner: req.user.id` on all database create, update, and delete operations.
- [ ] **Postman Collection:** Export and document complete Postman test suite covering positive, negative, and unauthorized scenarios for all CRUD endpoints.
- [ ] **Database Seed Script:** Optional script to populate sample pets and care history for new developer onboarding.

---

### 4. MATAPALLY MEGHANA — Reminders & Timeline (Remaining Tasks)
**Primary Files:** `server/src/controllers/reminderController.js`, `client/src/pages/RemindersPage.jsx`, `client/src/api/reminderService.js`
- [ ] **Care History Timeline View:** Build an interactive vertical or chronological timeline showing past treatments, vaccinations, and grooming dates for each pet.
- [ ] **Dynamic Date Calculation Engine:** Refine day difference formula to account for user timezones, today's due events, and overdue alerts.
- [ ] **Advanced Filtering & Search:** Build multi-faceted filters allowing owners to filter by pet name, care category (`Vaccination`, `Medication`, `Grooming`), and custom date ranges.
- [ ] **Urgent Alert Highlighting:** Implement visual urgency indicators (color-coded badges: Red for overdue, Yellow for due within 3 days, Green for upcoming).
- [ ] **Edge Cases Testing:** Verify leap-year calculations, past date validations, and graceful empty states when no reminders are scheduled.
