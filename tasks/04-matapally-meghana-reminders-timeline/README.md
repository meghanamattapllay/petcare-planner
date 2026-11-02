# ⏰ Task Instructions: Reminders & Timeline
**Assigned Member:** MATAPALLY MEGHANA  
**Roll Number:** `2303A52505`  
**Branch:** CSE (AIML)  
**Role:** Reminders & Timeline  
**Deliverable:** Care history timeline, upcoming & overdue care date calculations, search & filters, reminders dashboard.

---

## 🎯 Your Assigned Scope
You are responsible for the intelligent scheduling, timeline calculation, and filtering features across backend and frontend:
1. Developing the care history timeline for each pet.
2. Implementing upcoming, due today, and overdue care date calculations.
3. Building search and filter interfaces (by pet name, care type, and status).
4. Developing the interactive upcoming reminders dashboard.
5. Testing date validation, empty states, and scheduling edge cases.

---

## 📂 Your Target Files in the Project
You will be working directly in these files:
- 📄 `server/src/controllers/reminderController.js` *(Date calculation & reminder aggregation)*
- 📄 `server/src/routes/reminderRoutes.js` *(Express router for /api/reminders)*
- 📄 `client/src/pages/RemindersPage.jsx` *(Frontend Reminders Dashboard & Timeline View)*
- 📄 `client/src/api/reminderService.js` *(Frontend API service)*

---

## 📋 Step-by-Step Task Checklist

### Step 1: Date Calculation Engine (`reminderController.js`)
- [x] Open `server/src/controllers/reminderController.js`.
- [x] Review how `nextDueDate` is compared against `now`:
  ```javascript
  const now = new Date();
  const due = new Date(item.nextDueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  ```
- [x] Categorize the care status:
  - `diffDays < 0`: **Overdue** (e.g. "Overdue by 5 days")
  - `diffDays === 0`: **Due Today**
  - `diffDays > 0`: **Upcoming** (e.g. "In 14 days")
- [x] Calculate and return summary metadata:
  ```json
  "summary": {
    "total": 3,
    "upcomingCount": 2,
    "overdueCount": 1
  }
  ```

### Step 2: Reminders & Timeline Page (`RemindersPage.jsx`)
- [x] Open `client/src/pages/RemindersPage.jsx`.
- [x] Verify that reminders display:
  - Care type badge (`Vaccination`, `Medication`, `Grooming`, etc.).
  - Color-coded urgency status:
    - 🔴 Red border & pill for **Overdue**
    - 🟡 Yellow border & pill for **Due Today**
    - 🔵 Blue border & pill for **Upcoming**
  - Target Pet Name and Species.
  - Next Due Date formatted nicely (`e.g., Nov 16, 2026`).
  - Veterinarian notes and dosage instructions.

### Step 3: Search & Dynamic Filters
- [x] Search input: Real-time filtering matching pet name, care type, or reminder title.
- [x] Filter tab buttons:
  - `All Records`
  - `Upcoming`
  - `⚠️ Overdue`
- [x] Ensure count numbers on the filter buttons update dynamically based on the filtered results.

### Step 4: Schedule Care / Add Reminder Modal
- [x] Form to schedule an upcoming pet care event:
  - Pet selector dropdown.
  - Care type selector dropdown (`Vaccination`, `Medication`, `Grooming`, `Vet Visit`, etc.).
  - Title / Description.
  - Date Administered (defaults to today).
  - Next Due Date *(required)*.
  - Veterinarian / Clinic Name.
  - Notes / Dosage Instructions.
- [x] Connect submission to `recordService.createRecord(formData)` and refresh the timeline.

### Step 5: Edge Cases & Empty States
- [x] Handle empty states gracefully (e.g., when a user has no upcoming reminders or search matches 0 results).
- [x] Validate date inputs: Ensure `nextDueDate` is provided and formatted as a valid date.

---

## 🔌 API Endpoints Reference

### Get Reminders
- **URL:** `GET /api/reminders`
- **Response `200 OK`:**
```json
{
  "success": true,
  "summary": {
    "total": 3,
    "upcomingCount": 2,
    "overdueCount": 1,
    "dueTodayCount": 0
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
      }
    ],
    "upcoming": [ ... ],
    "overdue": [ ... ],
    "dueToday": [ ... ]
  }
}
```

### Pet Care Timeline
- **URL:** `GET /api/reminders/pet/:petId`
- **Response `200 OK`:** Returns chronological timeline events and summary for the specified pet.

---

## 🧪 How to Run & Verify Your Work
1. Start backend and client:
   ```bash
   cd server && npm run dev
   cd client && npm run dev
   ```
2. Open **`http://localhost:5173/reminders`** in your browser.
3. Check the filter tabs ("All", "Upcoming", "Overdue") and verify that overdue items are highlighted in red.
4. Test scheduling a reminder with a date in the past to see it trigger an overdue status, and a date in the future to see it listed as upcoming.
