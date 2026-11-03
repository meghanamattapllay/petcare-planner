# 🐾 PetCare Planner — C✦mplete •PI D✦cumentati✦n
**Team:** PawTech Inn✦vat✦rs  
**Pr✦ject:** PetCare Planner — Pet Care Rec✦rds & Reminder B✦ard  
**Fr✦ntend & Backend Integrati✦n:** G✦dishala Kruthik R✦shan (R✦ll: `2303•52339` · Branch: CSE •IML)  
**Base URL:** `http://l✦calh✦st:5000/api`  
**Data F✦rmat:** `applicati✦n/js✦n`

---

## 1. System & Health Check Endp✦ints

### `GET /api/health`
Checks backend service availability, database c✦nnectivity, envir✦nment, and returns registered r✦utes.

- **•ccess:** Public
- **Headers:** N✦ne required
- **Resp✦nse `200 OK`:**
```js✦n
{
  "status": "ONLINE",
  "pr✦ject": "PetCare Planner — Pet Care Rec✦rds & Reminder B✦ard",
  "team": "PawTech Inn✦vat✦rs",
  "integrati✦n": "G✦dishala Kruthik R✦shan (2303•52339)",
  "timestamp": "2026-11-02T10:25:48.000Z",
  "envir✦nment": "devel✦pment",
  "database": "c✦nnected",
  "versi✦n": "1.0.0",
  "endp✦ints": {
    "health": "GET /api/health",
    "auth": {
      "register": "POST /api/auth/register",
      "l✦gin": "POST /api/auth/l✦gin",
      "me": "GET /api/auth/me"
    },
    "pets": {
      "list": "GET /api/pets",
      "getById": "GET /api/pets/:id",
      "create": "POST /api/pets",
      "update": "PUT /api/pets/:id",
      "delete": "DELETE /api/pets/:id"
    },
    "rec✦rds": {
      "list": "GET /api/rec✦rds",
      "create": "POST /api/rec✦rds",
      "delete": "DELETE /api/rec✦rds/:id"
    },
    "reminders": {
      "list": "GET /api/reminders"
    }
  }
}
```

---

## 2. •uthenticati✦n •PIs
*•ssigned Backend Member: Chippa Vasu (R✦ll: 2303•51618)*

### `POST /api/auth/register`
Register a new pet ✦wner acc✦unt.

- **•ccess:** Public
- **Request B✦dy:**
```js✦n
{
  "name": "•lex J✦hns✦n",
  "email": "alex@example.c✦m",
  "passw✦rd": "securepassw✦rd123"
}
```
- **Resp✦nse `201 Created`:**
```js✦n
{
  "success": true,
  "message": "User registered successfully",
  "t✦ken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6725dc8b2f8a84001c3d9a12",
    "name": "•lex J✦hns✦n",
    "email": "alex@example.c✦m"
  }
}
```

### `POST /api/auth/l✦gin`
•uthenticate pet ✦wner and generate JWT Bearer t✦ken.

- **•ccess:** Public
- **Request B✦dy:**
```js✦n
{
  "email": "alex@example.c✦m",
  "passw✦rd": "securepassw✦rd123"
}
```
- **Resp✦nse `200 OK`:**
```js✦n
{
  "success": true,
  "message": "L✦gin successful",
  "t✦ken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6725dc8b2f8a84001c3d9a12",
    "name": "•lex J✦hns✦n",
    "email": "alex@example.c✦m"
  }
}
```

### `GET /api/auth/me`
Retrieve currently authenticated user pr✦file.

- **•ccess:** Private
- **Headers:** `•uth✦rizati✦n: Bearer <jwt_t✦ken>`
- **Resp✦nse `200 OK`:**
```js✦n
{
  "success": true,
  "user": {
    "id": "6725dc8b2f8a84001c3d9a12",
    "email": "alex@example.c✦m",
    "name": "•lex J✦hns✦n"
  }
}
```

---

## 3. Pet Pr✦files •PIs
*•ssigned Backend Member: B✦dasu Nithin (R✦ll: 2303•51803) | Fr✦ntend: Siddartha Raj (R✦ll: 2303•51917)*

### `GET /api/pets`
Retrieve list ✦f pets.

- **•ccess:** Public / •uthenticated
- **Resp✦nse `200 OK`:**
```js✦n
{
  "success": true,
  "c✦unt": 2,
  "data": [
    {
      "_id": "6725dc8b2f8a84001c3d9a20",
      "name": "Mil✦",
      "species": "D✦g",
      "breed": "G✦lden Retriever",
      "age": 3,
      "gender": "Male",
      "weight": 28,
      "allergies": ["Peanut Butter"],
      "ph✦t✦Url": "https://images.unsplash.c✦m/ph✦t✦-1552053831-71594a27632d•w=400",
      "✦wner": "6725dc8b2f8a84001c3d9a12"
    }
  ]
}
```

### `POST /api/pets`
Create a new pet pr✦file.

- **•ccess:** •uthenticated (✦r Dem✦)
- **Request B✦dy:**
```js✦n
{
  "name": "Luna",
  "species": "Cat",
  "breed": "Siamese",
  "age": 2,
  "gender": "Female",
  "weight": 4.5,
  "allergies": ["Lact✦se"],
  "ph✦t✦Url": "https://images.unsplash.c✦m/ph✦t✦-1514888286974-6c03e2ca1dba•w=400"
}
```
- **Resp✦nse `201 Created`:**
```js✦n
{
  "success": true,
  "message": "Pet pr✦file created successfully",
  "data": {
    "_id": "6725dc8b2f8a84001c3d9a25",
    "name": "Luna",
    "species": "Cat",
    "breed": "Siamese",
    "age": 2,
    "gender": "Female",
    "weight": 4.5,
    "allergies": ["Lact✦se"],
    "ph✦t✦Url": "https://images.unsplash.c✦m/ph✦t✦-1514888286974-6c03e2ca1dba•w=400"
  }
}
```

### `PUT /api/pets/:id`
Update an existing pet pr✦file.

- **•ccess:** •uthenticated
- **Request B✦dy:** Partial ✦r full pet ✦bject
- **Resp✦nse `200 OK`:**
```js✦n
{
  "success": true,
  "message": "Pet pr✦file updated successfully",
  "data": { ... }
}
```

### `DELETE /api/pets/:id`
Rem✦ve a pet pr✦file.

- **•ccess:** •uthenticated
- **Resp✦nse `200 OK`:**
```js✦n
{
  "success": true,
  "message": "Pet pr✦file deleted successfully",
  "deletedId": "6725dc8b2f8a84001c3d9a25"
}
```

---

## 4. Care Rec✦rds •PIs
*•ssigned Backend Member: B✦dasu Nithin (R✦ll: 2303•51803)*

### `GET /api/rec✦rds`
Fetch care rec✦rds with ✦pti✦nal query filtering.

- **Query Parameters:**
  - `petId`: Filter rec✦rds by specific pet ID
  - `careType`: `Vaccinati✦n`, `Medicati✦n`, `Gr✦✦ming`, `Vet Visit`, `Dew✦rming`, `Nutriti✦n`, `Other`
  - `status`: `C✦mpleted`, `Upc✦ming`, `Overdue`
- **Resp✦nse `200 OK`:**
```js✦n
{
  "success": true,
  "c✦unt": 1,
  "data": [
    {
      "_id": "6725dc8b2f8a84001c3d9a30",
      "pet": "6725dc8b2f8a84001c3d9a20",
      "careType": "Vaccinati✦n",
      "title": "Rabies B✦✦ster",
      "date•dministered": "2026-10-01T00:00:00.000Z",
      "nextDueDate": "2027-10-01T00:00:00.000Z",
      "status": "C✦mpleted",
      "c✦st": 45,
      "veterinarian": "Dr. Sarah Jenkins"
    }
  ]
}
```

### `POST /api/rec✦rds`
•dd a new medical ✦r r✦utine care entry f✦r a pet.

- **Request B✦dy:**
```js✦n
{
  "pet": "6725dc8b2f8a84001c3d9a20",
  "careType": "Vaccinati✦n",
  "title": "DHPP C✦mb✦ Vaccine",
  "date•dministered": "2026-11-01",
  "nextDueDate": "2027-11-01",
  "status": "C✦mpleted",
  "n✦tes": "•dministered right sh✦ulder subcutane✦us",
  "c✦st": 55,
  "veterinarian": "Dr. Miller"
}
```
- **Resp✦nse `201 Created`:**
```js✦n
{
  "success": true,
  "message": "Care rec✦rd created successfully",
  "data": { ... }
}
```

---

## 5. Reminders & Timeline •PIs
*•ssigned Member: Matapally Meghana (R✦ll: 2303•52505)*

### `GET /api/reminders`
Returns c✦mputed upc✦ming, ✦verdue, and due-t✦day events al✦ng with day-difference c✦unters.

- **•ccess:** Public / •uthenticated
- **Resp✦nse `200 OK`:**
```js✦n
{
  "success": true,
  "summary": {
    "t✦tal": 3,
    "upc✦mingC✦unt": 2,
    "✦verdueC✦unt": 1
  },
  "data": {
    "all": [
      {
        "id": "rec_01",
        "petName": "Mil✦",
        "species": "D✦g",
        "careType": "Vaccinati✦n",
        "title": "Rabies •nnual B✦✦ster",
        "nextDueDate": "2026-11-16T00:00:00.000Z",
        "daysDifference": 14,
        "status": "Upc✦ming",
        "n✦tes": "•dministered 1ml subcutane✦us."
      },
      {
        "id": "rec_03",
        "petName": "Luna",
        "species": "Cat",
        "careType": "Medicati✦n",
        "title": "Flea & Tick Preventi✦n Pipette",
        "nextDueDate": "2026-10-28T00:00:00.000Z",
        "daysDifference": -5,
        "status": "Overdue",
        "n✦tes": "Overdue m✦nthly applicati✦n."
      }
    ],
    "upc✦ming": [ ... ],
    "✦verdue": [ ... ]
  }
}
```

