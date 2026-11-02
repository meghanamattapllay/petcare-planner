# 🐾 Task Instructions: Frontend — Pet Profiles
**Assigned Member:** SIDDARTHA RAJ  
**Roll Number:** `2303A51917`  
**Branch:** CSE  
**Role:** Frontend: Pet Profiles  
**Deliverable:** Pet profile pages, forms, and reusable UI components.

---

## 🎯 Your Assigned Scope
You are responsible for the entire user experience around **Pet Profiles** in the React application:
1. Building and refining the Pet Profiles UI pages and navigation.
2. Developing forms to **Add**, **Edit**, **View**, and **Delete** pets.
3. Implementing responsive, card-based pet profile displays.
4. Making the UI responsive across mobile, tablet, and desktop using CSS.

---

## 📂 Your Target Files in the Project
You will be working directly in these files:
- 📄 `client/src/pages/PetProfiles.jsx` *(Main pet directory & modals)*
- 📄 `client/src/api/petService.js` *(Pre-configured API service calling the backend)*
- 📄 `client/src/index.css` *(Pet card, grid, and modal styling)*
- 📁 `client/src/components/` *(Create reusable components like `PetCard.jsx`, `PetFormModal.jsx` if you wish)*

---

## 📋 Step-by-Step Task Checklist

### Step 1: Pet Card Display
- [ ] Open `client/src/pages/PetProfiles.jsx`.
- [ ] Ensure pet cards display:
  - Pet image with fallback URL if image fails.
  - Name, species badge (Dog, Cat, Bird, etc.), and gender symbol.
  - Breed, age in years, and weight in kg.
  - Known allergies as individual visual tags/chips.
  - Action buttons: "Delete", "Edit", and "View Details".

### Step 2: Add New Pet Modal & Form
- [ ] Verify the "Add New Pet" modal form inputs:
  - Pet Name *(required)*
  - Species dropdown: `Dog`, `Cat`, `Bird`, `Rabbit`, `Other` *(required)*
  - Breed *(text)*
  - Age *(number, positive)*
  - Gender dropdown: `Male`, `Female`, `Unknown`
  - Weight in kg *(number/decimal)*
  - Known Allergies *(comma-separated string)*
  - Photo URL *(valid URL)*
- [ ] Connect the form submission to `petService.createPet(payload)`.
- [ ] On successful creation, refresh the pet list and close the modal.

### Step 3: Implement "Edit Pet" Feature
- [ ] Add an "Edit" button to each pet card.
- [ ] When clicked, open the modal pre-filled with the selected pet's current details.
- [ ] On submit, call `petService.updatePet(selectedPet._id, updatedPayload)`.
- [ ] Update state and show a confirmation message.

### Step 4: Implement Individual Pet Details View
- [ ] Create a "View Details" view or modal showing:
  - Large pet photo and header.
  - Pet profile attributes.
  - Associated care records and medical notes.

### Step 5: Client-Side Input Validation
- [ ] Enforce name length (at least 2 characters).
- [ ] Ensure age cannot be negative.
- [ ] Ensure weight cannot be zero or negative.
- [ ] Display friendly error banners if required fields are missing.

### Step 6: Responsive Mobile Styling
- [ ] Check `client/src/index.css` under `.pet-grid` and `.pet-card`.
- [ ] Verify grid displays 3 columns on desktop, 2 on tablet, and 1 full-width column on mobile screens (`@media (max-width: 768px)`).

---

## 🔌 API Service Contract Reference
The API service is already built and imported for you from `../api/petService`:

```javascript
import petService from '../api/petService';

// 1. Fetch all pets
const res = await petService.getAllPets();
// res.data is an array of pets

// 2. Fetch single pet
const pet = await petService.getPetById(id);

// 3. Create new pet
const newPet = await petService.createPet({
  name: 'Milo',
  species: 'Dog',
  breed: 'Golden Retriever',
  age: 3,
  gender: 'Male',
  weight: 28,
  allergies: ['Peanut Butter'],
  photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400'
});

// 4. Update existing pet
await petService.updatePet(id, { weight: 29.5 });

// 5. Delete pet
await petService.deletePet(id);
```

---

## 🧪 How to Run & Verify Your Work
1. Start the React development server:
   ```bash
   cd client
   npm run dev
   ```
2. Open your browser to: **`http://localhost:5173/pets`**
3. Ensure backend is also running in another terminal (`cd server && npm run dev`) so your API requests connect live!
4. Test adding a pet, editing, and deleting.
