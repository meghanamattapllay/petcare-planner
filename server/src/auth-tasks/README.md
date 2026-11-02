# 🔐 Task Instructions: Backend — Authentication
**Assigned Member:** CHIPPA VASU (Roll: `2303A51618` · Branch: CSE)

Please see the full task specification in:
👉 [`tasks/02-chippa-vasu-backend-auth/README.md`](../../../tasks/02-chippa-vasu-backend-auth/README.md)

### Quick Checklist:
1. `server/src/models/User.js`: Confirm User schema with name, email, password, timestamps.
2. `server/src/controllers/authController.js`: bcryptjs hashing + JWT token creation for register & login.
3. `server/src/middleware/authMiddleware.js`: Verify Authorization Bearer token and attach req.user.
4. `server/src/routes/authRoutes.js`: Expose `/register`, `/login`, `/me`.
5. Test with Postman or `curl` against `http://localhost:5000/api/auth/register`.
