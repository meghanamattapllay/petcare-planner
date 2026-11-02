# 💾 Task Instructions: Backend — Database & APIs
**Assigned Member:** BODASU NITHIN  
**Roll Number:** `2303A51803`  
**Branch:** CSE  
**Role:** Backend: Database & APIs  
**Deliverable:** Pet and CareRecord MongoDB models, CRUD APIs with database integration.

---

## 🎯 Your Assigned Scope
You are responsible for database models and core CRUD API endpoints for pets and care records:
1. Designing and refining the `Pet` and `CareRecord` MongoDB Mongoose models.
2. Implementing complete CRUD APIs for **Pets** (Create, Read, Update, Delete).
3. Implementing complete CRUD APIs for **Care Records** (Create, Read, Update, Delete).
4. Ensuring each pet and care record is correctly associated with its `owner` (relational referencing).
5. Validating incoming request data and conducting API tests using Postman.

---

## 📂 Your Target Files in the Project
You will be working directly in these files:
- 📄 `server/src/models/Pet.js` *(Pet Mongoose Schema)*
- 📄 `server/src/models/CareRecord.js` *(CareRecord Mongoose Schema)*
- 📄 `server/src/controllers/petController.js` *(Pet CRUD controllers)*
- 📄 `server/src/controllers/recordController.js` *(CareRecord CRUD controllers)*
- 📄 `server/src/routes/petRoutes.js` *(Express router for /api/pets)*
- 📄 `server/src/routes/recordRoutes.js` *(Express router for /api/records)*

---

## 📋 Step-by-Step Task Checklist

### Step 1: Pet MongoDB Model (`Pet.js`)
- [ ] Open `server/src/models/Pet.js`.
- [ ] Ensure schema attributes:
  - `name`: String, required.
  - `species`: String, required (`Dog`, `Cat`, etc.).
  - `breed`: String.
  - `age`: Number (min: 0).
  - `gender`: Enum `['Male', 'Female', 'Unknown']`.
  - `weight`: Number (in kg).
  - `allergies`: Array of Strings.
  - `photoUrl`: String (default avatar URL provided).
  - `owner`: ObjectId referencing `'User'`, required.
  - `timestamps: true`.

### Step 2: CareRecord MongoDB Model (`CareRecord.js`)
- [ ] Open `server/src/models/CareRecord.js`.
- [ ] Ensure schema attributes:
  - `pet`: ObjectId referencing `'Pet'`, required.
  - `owner`: ObjectId referencing `'User'`, required.
  - `careType`: Enum `['Vaccination', 'Medication', 'Grooming', 'Vet Visit', 'Deworming', 'Nutrition', 'Other']`, required.
  - `title`: String, required.
  - `dateAdministered`: Date, default `Date.now`.
  - `nextDueDate`: Date, required.
  - `status`: Enum `['Completed', 'Upcoming', 'Overdue']`, default `'Upcoming'`.
  - `notes`: String.
  - `cost`: Number, default 0.
  - `veterinarian`: String.
  - `timestamps: true`.

### Step 3: Pet CRUD Controller (`petController.js`)
- [ ] **`GET /api/pets`**: Query MongoDB for pets. If authenticated user exists, filter by `owner: req.user.id`. Return list and count.
- [ ] **`GET /api/pets/:id`**: Find pet by `_id`. Return `404` if not found.
- [ ] **`POST /api/pets`**: Create a new pet with incoming payload and bind to `owner`. Return `201 Created`.
- [ ] **`PUT /api/pets/:id`**: Update existing pet with `Pet.findByIdAndUpdate(id, req.body, { new: true })`.
- [ ] **`DELETE /api/pets/:id`**: Delete pet with `Pet.findByIdAndDelete(id)`. Optional: also delete associated care records.

### Step 4: CareRecord CRUD Controller (`recordController.js`)
- [ ] **`GET /api/records`**: Find care records. Support query parameters:
  - `?petId=...` -> filter by pet
  - `?careType=...` -> filter by care type
  - `?status=...` -> filter by status
  - Populate pet details using `.populate('pet', 'name species photoUrl')`.
- [ ] **`POST /api/records`**: Create new care record with `pet`, `careType`, `title`, `nextDueDate`. Bind `owner`.
- [ ] **`DELETE /api/records/:id`**: Delete care record by `_id`.

### Step 5: Data Validation & Error Handling
- [ ] Enforce required fields. Return `400 Bad Request` with descriptive JSON messages if fields are missing.
- [ ] Wrap database calls in `try/catch` passing errors to `next(error)`.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets` | List all pets |
| `GET` | `/api/pets/:id` | Get details of a single pet |
| `POST` | `/api/pets` | Create new pet profile |
| `PUT` | `/api/pets/:id` | Update pet profile |
| `DELETE` | `/api/pets/:id` | Delete pet profile |
| `GET` | `/api/records` | List care records (supports filters) |
| `POST` | `/api/records` | Create care record |
| `DELETE` | `/api/records/:id` | Delete care record |

---

## 🧪 How to Run & Verify Your Work
1. Make sure MongoDB is running locally (`mongodb://127.0.0.1:27017/petcare_planner`).
2. Run backend:
   ```bash
   cd server
   npm run dev
   ```
3. Run the automated integration test script provided by the team:
   ```bash
   node server/test-integration.js
   ```
4. Verify that Pet Count and Record Count return live data from MongoDB.
