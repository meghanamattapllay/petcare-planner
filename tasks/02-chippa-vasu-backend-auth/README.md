# 🔐 Task Instructions: Backend — Authentication
**Assigned Member:** CHIPPA VASU  
**Roll Number:** `2303A51618`  
**Branch:** CSE  
**Role:** Backend: Authentication  
**Deliverable:** Secure authentication APIs, User model, password hashing, and auth middleware.

---

## 🎯 Your Assigned Scope
You are responsible for user security, account management, and session verification in the Express backend:
1. Setting up and refining the Node.js/Express authentication pipeline.
2. Developing user registration and login endpoints.
3. Defining the `User` MongoDB model.
4. Implementing secure password hashing (`bcryptjs`) and JWT token issuance (`jsonwebtoken`).
5. Developing the `protect` authentication middleware to enforce owner authorization on protected routes.

---

## 📂 Your Target Files in the Project
You will be working directly in these files:
- 📄 `server/src/models/User.js` *(User Mongoose Schema)*
- 📄 `server/src/controllers/authController.js` *(Register, Login, Me controllers)*
- 📄 `server/src/routes/authRoutes.js` *(Express router for /api/auth)*
- 📄 `server/src/middleware/authMiddleware.js` *(JWT verification middleware)*

---

## 📋 Step-by-Step Task Checklist

### Step 1: User MongoDB Model
- [ ] Open `server/src/models/User.js`.
- [ ] Confirm schema fields:
  - `name`: String, required, trimmed.
  - `email`: String, required, unique, lowercase, regex-validated for valid email format.
  - `password`: String, required, minlength 6.
  - `role`: Enum `['owner', 'admin']`, default `'owner'`.
  - `timestamps: true` (auto-creates `createdAt` & `updatedAt`).

### Step 2: Password Hashing (bcryptjs)
- [ ] In `server/src/controllers/authController.js`:
  - When a user registers (`registerUser`), generate salt using `bcrypt.genSalt(10)`.
  - Hash password with `bcrypt.hash(password, salt)`.
  - Store ONLY the hashed password in MongoDB. Never store plaintext passwords.
  - When a user logs in (`loginUser`), compare with `await bcrypt.compare(password, user.password)`.

### Step 3: JWT Token Generation
- [ ] Verify `generateToken` helper function:
  ```javascript
  const generateToken = (id, email, name) => {
    return jwt.sign(
      { id, email, name },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  };
  ```
- [ ] Ensure token payload includes user `id`, `email`, and `name`.

### Step 4: Authentication APIs (`authController.js`)
- [ ] **`POST /api/auth/register`**:
  - Validates `name`, `email`, `password`.
  - Checks if email is already taken.
  - Creates user, signs JWT, and returns `201 Created` with token and user object (excluding password).
- [ ] **`POST /api/auth/login`**:
  - Validates `email` and `password`.
  - Finds user by email, checks password with bcrypt.
  - Returns `200 OK` with token and user object.
- [ ] **`GET /api/auth/me`**:
  - Protected route using `protect` middleware.
  - Returns current logged-in user profile (`req.user`).

### Step 5: Protect Middleware (`authMiddleware.js`)
- [ ] In `server/src/middleware/authMiddleware.js`:
  - Extract Bearer token from header: `req.headers.authorization`.
  - Verify signature with `jwt.verify(token, process.env.JWT_SECRET)`.
  - If valid, attach `req.user = decoded;` and call `next()`.
  - If invalid or expired, return `401 Unauthorized` with `{ success: false, message: 'Not authorized, token validation failed' }`.
  - If no token provided, return `401 Unauthorized` with `{ success: false, message: 'Not authorized, no bearer token provided' }`.

---

## 🔌 API Contract Reference

### Registration
- **URL:** `POST /api/auth/register`
- **Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "mypassword123"
}
```
- **Success Response `201 Created`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "6725dc8b2f8a84001c3d9a12",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Login
- **URL:** `POST /api/auth/login`
- **Body:**
```json
{
  "email": "jane@example.com",
  "password": "mypassword123"
}
```

---

## 🧪 How to Run & Verify Your Work
1. Start the Express backend:
   ```bash
   cd server
   npm run dev
   ```
2. Test using `curl` or Postman:
   ```bash
   # Test Register
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d "{\"name\":\"Test Owner\",\"email\":\"test@pawtech.com\",\"password\":\"password123\"}"

   # Test Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"test@pawtech.com\",\"password\":\"password123\"}"
   ```
3. Test frontend integration by opening `http://localhost:5173/login` in the browser and testing registration and login.

