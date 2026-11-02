# 🐾 PetCare Planner — Complete API Documentation
**Team:** PawTech Innovators  
**Project:** PetCare Planner — Pet Care Records & Reminder Board  
**Frontend & Backend Integration:** Godishala Kruthik Roshan (Roll: `2303A52339` · Branch: CSE AIML)  
**Base URL:** `http://localhost:5000/api`  
**Data Format:** `application/json`

---

## 1. System & Health Check Endpoints

### `GET /api/health`
Checks backend service availability, database connectivity, environment, and returns registered routes.

- **Access:** Public
- **Headers:** None required
- **Response `200 OK`:**
```json
{
  "status": "ONLINE",
  "project": "PetCare Planner — Pet Care Records & Reminder Board",
  "team": "PawTech Innovators",
  "integration": "Godishala Kruthik Roshan (2303A52339)",
  "timestamp": "2026-11-02T10:25:48.000Z",
  "environment": "development",
  "database": "connected",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /api/health",
    "auth": {
      "register": "POST /api/auth/register",
      "login": "POST /api/auth/login",
      "me": "GET /api/auth/me"
    },
    "pets": {
      "list": "GET /api/pets",
      "getById": "GET /api/pets/:id",
      "create": "POST /api/pets",
      "update": "PUT /api/pets/:id",
      "delete": "DELETE /api/pets/:id"
    },
    "records": {
      "list": "GET /api/records",
      "create": "POST /api/records",
      "delete": "DELETE /api/records/:id"
    },
    "reminders": {
      "list": "GET /api/reminders"
    }
  }
}
```

---

## 2. Authentication APIs
*Assigned Backend Member: Chippa Vasu (Roll: 2303A51618)*

### `POST /api/auth/register`
Register a new pet owner account.

- **Access:** Public
- **Request Body:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "password": "securepassword123"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6725dc8b2f8a84001c3d9a12",
    "name": "Alex Johnson",
    "email": "alex@example.com"
  }
}
```

### `POST /api/auth/login`
Authenticate pet owner and generate JWT Bearer token.

- **Access:** Public
- **Request Body:**
```json
{
  "email": "alex@example.com",
  "password": "securepassword123"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6725dc8b2f8a84001c3d9a12",
    "name": "Alex Johnson",
    "email": "alex@example.com"
  }
}
```

### `GET /api/auth/me`
Retrieve currently authenticated user profile.

- **Access:** Private
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Response `200 OK`:**
```json
{
  "success": true,
  "user": {
    "id": "6725dc8b2f8a84001c3d9a12",
    "email": "alex@example.com",
    "name": "Alex Johnson"
  }
}
```

---

## 3. Pet Profiles APIs
*Assigned Backend Member: Bodasu Nithin (Roll: 2303A51803) | Frontend: Siddartha Raj (Roll: 2303A51917)*

### `GET /api/pets`
Retrieve list of pets.

- **Access:** Public / Authenticated
- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6725dc8b2f8a84001c3d9a20",
      "name": "Milo",
      "species": "Dog",
      "breed": "Golden Retriever",
      "age": 3,
      "gender": "Male",
      "weight": 28,
      "allergies": ["Peanut Butter"],
      "photoUrl": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
      "owner": "6725dc8b2f8a84001c3d9a12"
    }
  ]
}
```

### `POST /api/pets`
Create a new pet profile.

- **Access:** Authenticated (or Demo)
- **Request Body:**
```json
{
  "name": "Luna",
  "species": "Cat",
  "breed": "Siamese",
  "age": 2,
  "gender": "Female",
  "weight": 4.5,
  "allergies": ["Lactose"],
  "photoUrl": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Pet profile created successfully",
  "data": {
    "_id": "6725dc8b2f8a84001c3d9a25",
    "name": "Luna",
    "species": "Cat",
    "breed": "Siamese",
    "age": 2,
    "gender": "Female",
    "weight": 4.5,
    "allergies": ["Lactose"],
    "photoUrl": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"
  }
}
```

### `PUT /api/pets/:id`
Update an existing pet profile.

- **Access:** Authenticated
- **Request Body:** Partial or full pet object
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Pet profile updated successfully",
  "data": { ... }
}
```

### `DELETE /api/pets/:id`
Remove a pet profile.

- **Access:** Authenticated
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Pet profile deleted successfully",
  "deletedId": "6725dc8b2f8a84001c3d9a25"
}
```

---

## 4. Care Records APIs
*Assigned Backend Member: Bodasu Nithin (Roll: 2303A51803)*

### `GET /api/records`
Fetch care records with optional query filtering.

- **Query Parameters:**
  - `petId`: Filter records by specific pet ID
  - `careType`: `Vaccination`, `Medication`, `Grooming`, `Vet Visit`, `Deworming`, `Nutrition`, `Other`
  - `status`: `Completed`, `Upcoming`, `Overdue`
- **Response `200 OK`:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6725dc8b2f8a84001c3d9a30",
      "pet": "6725dc8b2f8a84001c3d9a20",
      "careType": "Vaccination",
      "title": "Rabies Booster",
      "dateAdministered": "2026-10-01T00:00:00.000Z",
      "nextDueDate": "2027-10-01T00:00:00.000Z",
      "status": "Completed",
      "cost": 45,
      "veterinarian": "Dr. Sarah Jenkins"
    }
  ]
}
```

### `POST /api/records`
Add a new medical or routine care entry for a pet.

- **Request Body:**
```json
{
  "pet": "6725dc8b2f8a84001c3d9a20",
  "careType": "Vaccination",
  "title": "DHPP Combo Vaccine",
  "dateAdministered": "2026-11-01",
  "nextDueDate": "2027-11-01",
  "status": "Completed",
  "notes": "Administered right shoulder subcutaneous",
  "cost": 55,
  "veterinarian": "Dr. Miller"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Care record created successfully",
  "data": { ... }
}
```

---

## 5. Reminders & Timeline APIs
*Assigned Member: Matapally Meghana (Roll: 2303A52505)*

### `GET /api/reminders`
Returns computed upcoming, overdue, and due-today events along with day-difference counters.

- **Access:** Public / Authenticated
- **Response `200 OK`:**
```json
{
  "success": true,
  "summary": {
    "total": 3,
    "upcomingCount": 2,
    "overdueCount": 1
  },
  "data": {
    "all": [
      {
        "id": "rec_01",
        "petName": "Milo",
        "species": "Dog",
        "careType": "Vaccination",
        "title": "Rabies Annual Booster",
        "nextDueDate": "2026-11-16T00:00:00.000Z",
        "daysDifference": 14,
        "status": "Upcoming",
        "notes": "Administered 1ml subcutaneous."
      },
      {
        "id": "rec_03",
        "petName": "Luna",
        "species": "Cat",
        "careType": "Medication",
        "title": "Flea & Tick Prevention Pipette",
        "nextDueDate": "2026-10-28T00:00:00.000Z",
        "daysDifference": -5,
        "status": "Overdue",
        "notes": "Overdue monthly application."
      }
    ],
    "upcoming": [ ... ],
    "overdue": [ ... ]
  }
}
```

