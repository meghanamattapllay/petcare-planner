# 🚀 PetCare Planner — Complete Production Hosting & Deployment Guide

This guide covers everything needed to host **PetCare Planner** online for free.

---

## 🎯 Recommended Hosting Architecture

| Component | Recommended Free Host | Alternative |
|---|---|---|
| **Database** | **MongoDB Atlas** (Free M0 Cluster) | Self-hosted MongoDB |
| **Backend & Frontend (Option A - 1-Click Monorepo)** | **Render.com** (Free Web Service) | Railway / Heroku |
| **Frontend (Option B - Split Architecture)** | **Vercel** | Netlify |
| **Backend (Option B - Split Architecture)** | **Render.com** | Railway |

---

## 🛠️ Step 1: Create Free Cloud Database on MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Click **Create a Deployment** and select the free **M0 Sandbox** cluster (AWS / Frankfurt or Mumbai or any region).
3. Under **Security Quickstart**:
   - Create a Database User (e.g., username `petcare_admin` and a strong password).
   - Under **IP Access List**, click **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Click **Connect** → **Drivers** → Copy the Connection String:
   ```text
   mongodb+srv://petcare_admin:<password>@cluster0.abcde.mongodb.net/petcare_planner?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your database user password).*

---

## 🌐 Option A (Easiest): 1-Click Monorepo on Render.com

This option hosts **both** the React frontend and Express backend under a single URL on Render.

1. Push your latest code to your GitHub repository (branch `Taskes` or `main`).
2. Go to [Render.com](https://dashboard.render.com) and sign in with GitHub.
3. Click **New +** → **Web Service**.
4. Select your `petcare-planner` repository.
5. Fill in the deployment settings:
   - **Name:** `petcare-planner`
   - **Environment:** `Node`
   - **Region:** Any (e.g., Oregon or Singapore)
   - **Branch:** `Taskes` (or `main`)
   - **Build Command:**
     ```bash
     npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
6. Scroll down to **Environment Variables** and add:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` *(Render provides this automatically)*
   - `MONGODB_URI` = `your_mongodb_atlas_connection_string_from_step_1`
   - `JWT_SECRET` = `your_super_secret_jwt_key_here`
   - `JWT_EXPIRES_IN` = `7d`
7. Click **Create Web Service**.
8. Render will build the React client, install server packages, and deploy your live URL (e.g. `https://petcare-planner.onrender.com`)!

---

## ⚡ Option B (Fastest): Split Hosting (Vercel Frontend + Render Backend)

### Part 1: Deploy Backend to Render
1. In Render, create a **Web Service** pointing to your repository.
2. Set **Root Directory:** `server`
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `npm start`
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `your_jwt_secret_key`
6. Click **Create Web Service**. Copy your live backend URL (e.g. `https://petcare-backend.onrender.com`).

### Part 2: Deploy Frontend to Vercel
1. Go to [Vercel](https://vercel.com) and sign in with GitHub.
2. Click **Add New Project** → Import `petcare-planner`.
3. Set **Root Directory:** `client`
4. Framework Preset will auto-detect as **Vite**.
5. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://petcare-backend.onrender.com/api`
6. Click **Deploy**. Vercel will build and give you a live frontend URL (e.g., `https://petcare-planner.vercel.app`)!

---

## ✅ Pre-flight Checklist Before Submitting Live Link
- [x] Backend responds to `GET /api/health` with `status: "ONLINE"`.
- [x] Pet owner user can register, login, create a pet, and add care reminders.
- [x] Admin can sign in using `admin@pawtech.com` / `admin123` and view the Admin Command Center.
- [x] In-app care reminders calculate upcoming and overdue dates accurately.

