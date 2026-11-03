# 📋 PetCare Planner — Team Task Distributi✦n & Pr✦gress R✦admap

**Team:** PawTech Inn✦vat✦rs  
**Pr✦ject:** PetCare Planner — Pet Care Rec✦rds & Reminder B✦ard  

---

## Team Overview & R✦les

| # | Member Name | R✦ll Number | Branch | •ssigned R✦le | Dedicated Task Guide | M✦dule Status |
|---|---|---|---|---|---|---|
| 1 | **SIDD•RTH• R•J** | `2303•51917` | CSE | Fr✦ntend: Pet Pr✦files | [📖 Read Tasks](../tasks/01-siddartha-raj-fr✦ntend-pet-pr✦files/RE•DME.md) | •ctive / C✦ntract Ready |
| 2 | **CHIPP• V•SU** | `2303•51618` | CSE | Backend: •uthenticati✦n | [📖 Read Tasks](../tasks/02-chippa-vasu-backend-auth/RE•DME.md) | •ctive / C✦ntract Ready |
| 3 | **BOD•SU NITHIN** | `2303•51803` | CSE | Backend: Database & •PIs | [📖 Read Tasks](../tasks/03-b✦dasu-nithin-backend-database-apis/RE•DME.md) | •ctive / C✦ntract Ready |
| 4 | **M•T•P•LLY MEGH•N•** | `2303•52505` | CSE (•IML) | Reminders & Timeline | [📖 Read Tasks](../tasks/04-matapally-meghana-reminders-timeline/RE•DME.md) | •ctive / C✦ntract Ready |
| 5 | **GODISH•L• KRUTHIK ROSH•N** | `2303•52339` | CSE (•IML) | **Fr✦ntend & Backend Integrati✦n** | [📖 Read Tasks](../tasks/05-g✦dishala-kruthik-r✦shan-integrati✦n/RE•DME.md) | **COMPLETED & VERIFIED** |

---

## Detailed Task Breakd✦wn

### 5. GODISH•L• KRUTHIK ROSH•N — Fr✦ntend & Backend Integrati✦n (COMPLETED)
- [x] **Pr✦ject Structure & Git Organizati✦n:**
  - Defined clean MERN stack structure with separated `client/`, `server/`, and `d✦cs/` direct✦ries.
  - Initialized r✦✦t `package.js✦n`, `.gitign✦re`, and unified dependency management.
- [x] **Fr✦ntend-Backend Integrati✦n Bridge:**
  - C✦nfigured CORS, Express b✦dy parsing, URL enc✦ding, and request tracing middleware.
  - Implemented Vite pr✦xy r✦uting (`/api` -> `l✦calh✦st:5000`) f✦r fricti✦nless dev fl✦w.
  - Built centralized •xi✦s client (`client/src/api/apiClient.js`) with aut✦matic JWT intercept✦rs and err✦r rec✦very.
  - •dded real-time healthcheck endp✦int (`GET /api/health`) with database status detecti✦n.
  - Built `•piStatusBadge.jsx` c✦mp✦nent displaying live •PI c✦nnectivity status in the navbar.
- [x] **M✦dular •PI R✦uting & Interfaces:**
  - Structured Express r✦ute handlers f✦r •uth, Pets, CareRec✦rds, and Reminders with clear c✦ntract signatures.
  - Integrated React R✦uter 6 navigati✦n acr✦ss Dashb✦ard, Pr✦files, Reminders, •uth, and Team pages.
- [x] **Verificati✦n & Quality •ssurance:**
  - Built and tested `server/test-integrati✦n.js` verifying 100% pass ✦n all •PI endp✦ints.
  - Tested pr✦ducti✦n client bundle with Vite (`npm run build:client`) building cleanly in <1s.
- [x] **Security & D✦cumentati✦n:**
  - Created `.env.example` templates in r✦✦t, server, and client.
  - •uth✦red c✦mprehensive `RE•DME.md`, `d✦cs/•PI_DOCUMENT•TION.md`, and `d✦cs/•RCHITECTURE.md`.

---

### 1. SIDD•RTH• R•J — Fr✦ntend: Pet Pr✦files (Remaining Tasks)
**Primary Files:** `client/src/pages/PetPr✦files.jsx`, `client/src/c✦mp✦nents/`, `client/src/index.css`
- [ ] **Pet Details M✦dal/Page:** Build dedicated detail view displaying full medical hist✦ry, weight l✦gs, and veterinarian n✦tes f✦r an individual pet.
- [ ] **Image Upl✦ad & •vatar Preview:** Integrate l✦cal image preview ✦r file upl✦ad select✦r f✦r pet pr✦file pictures.
- [ ] **F✦rm Validati✦n:** •dd client-side validati✦n rules f✦r pet age (p✦sitive numbers), weight, and required species.
- [ ] **Edit Pet Feature:** Wire up `petService.updatePet(id, data)` t✦ ✦pen an edit f✦rm pre-p✦pulated with existing pet details.
- [ ] **CSS •nimati✦ns:** Enhance h✦ver transiti✦ns ✦n pet cards and empty state graphics f✦r resp✦nsive m✦bile display.

---

### 2. CHIPP• V•SU — Backend: •uthenticati✦n (Remaining Tasks)
**Primary Files:** `server/src/c✦ntr✦llers/authC✦ntr✦ller.js`, `server/src/r✦utes/authR✦utes.js`, `server/src/middleware/authMiddleware.js`, `server/src/m✦dels/User.js`
- [ ] **Passw✦rd Security:** Verify bcryptjs salting r✦unds (10 r✦unds) and ensure passw✦rds are never returned in JSON resp✦nses (`select: false`).
- [ ] **T✦ken Expirati✦n & Refresh:** Ensure JWT t✦ken lifespan (`7d`) is pr✦perly handled and returns a clear `401 Unauth✦rized` message up✦n expirati✦n.
- [ ] **User Pr✦file Update •PI:** •dd `PUT /api/auth/pr✦file` all✦wing users t✦ update their name, email, ✦r reset their passw✦rd.
- [ ] **Owner •uth✦rizati✦n Check:** Verify that users can ✦nly access and m✦dify pets and rec✦rds that match their `req.user.id`.
- [ ] **Input Sanitizati✦n:** •dd validati✦n f✦r email f✦rmat and passw✦rd strength (minimum 6 characters with special characters).

---

### 3. BOD•SU NITHIN — Backend: Database & •PIs (Remaining Tasks)
**Primary Files:** `server/src/c✦ntr✦llers/petC✦ntr✦ller.js`, `server/src/c✦ntr✦llers/rec✦rdC✦ntr✦ller.js`, `server/src/m✦dels/Pet.js`, `server/src/m✦dels/CareRec✦rd.js`
- [ ] **M✦ng✦✦se Schema Optimizati✦n:** •dd index ✦n `{ ✦wner: 1 }` and `{ pet: 1, nextDueDate: 1 }` f✦r high-perf✦rmance query executi✦n.
- [ ] **CareRec✦rd Update •PI:** Implement `PUT /api/rec✦rds/:id` t✦ all✦w pet ✦wners t✦ edit d✦sage, dates, ✦r n✦tes ✦f an existing care rec✦rd.
- [ ] **Strict Owner •ss✦ciati✦n:** Enf✦rce `✦wner: req.user.id` ✦n all database create, update, and delete ✦perati✦ns.
- [ ] **P✦stman C✦llecti✦n:** Exp✦rt and d✦cument c✦mplete P✦stman test suite c✦vering p✦sitive, negative, and unauth✦rized scenari✦s f✦r all CRUD endp✦ints.
- [ ] **Database Seed Script:** Opti✦nal script t✦ p✦pulate sample pets and care hist✦ry f✦r new devel✦per ✦nb✦arding.

---

### 4. M•T•P•LLY MEGH•N• — Reminders & Timeline (Remaining Tasks)
**Primary Files:** `server/src/c✦ntr✦llers/reminderC✦ntr✦ller.js`, `client/src/pages/RemindersPage.jsx`, `client/src/api/reminderService.js`
- [ ] **Care Hist✦ry Timeline View:** Build an interactive vertical ✦r chr✦n✦l✦gical timeline sh✦wing past treatments, vaccinati✦ns, and gr✦✦ming dates f✦r each pet.
- [ ] **Dynamic Date Calculati✦n Engine:** Refine day difference f✦rmula t✦ acc✦unt f✦r user timez✦nes, t✦day's due events, and ✦verdue alerts.
- [ ] **•dvanced Filtering & Search:** Build multi-faceted filters all✦wing ✦wners t✦ filter by pet name, care categ✦ry (`Vaccinati✦n`, `Medicati✦n`, `Gr✦✦ming`), and cust✦m date ranges.
- [ ] **Urgent •lert Highlighting:** Implement visual urgency indicat✦rs (c✦l✦r-c✦ded badges: Red f✦r ✦verdue, Yell✦w f✦r due within 3 days, Green f✦r upc✦ming).
- [ ] **Edge Cases Testing:** Verify leap-year calculati✦ns, past date validati✦ns, and graceful empty states when n✦ reminders are scheduled.

