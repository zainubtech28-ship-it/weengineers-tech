# WEENGINEERS TECH — Enterprise Production Deployment Guide

This document provides exact, end-to-end instructions for deploying the **WEENGINEERS TECH** full-stack corporate platform.

---

## Architecture & Hosting Overview

| Component | Target Platform | Directory | Primary Technology |
| :--- | :--- | :--- | :--- |
| **Database** | MongoDB Atlas | Cloud Cluster | MongoDB 7+ / Mongoose |
| **Backend API** | Render | `backend/` | Node.js, Express, TypeScript |
| **Frontend App** | Vercel | `frontend/` | React 19, Vite, Tailwind CSS |
| **Source Control** | GitHub | Root | `https://github.com/zainubtech28-ship-it/weengineers-tech` |

---

## Part 1: MongoDB Atlas Setup (Production Database)

### 1. Create Cluster & Database
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Project (e.g., `WEENGINEERS-TECH`).
3. Deploy a new Database: Choose the **Shared / Free Tier (M0)** or a dedicated tier.
4. Select a cloud provider and region closest to your users (e.g., AWS Mumbai `ap-south-1` or Singapore `ap-southeast-1`).
5. Set Cluster Name to `weengineers-cluster` (or default `Cluster0`).

### 2. Configure Database User Credentials
1. In the Atlas sidebar, navigate to **Security** → **Database Access**.
2. Click **Add New Database User**.
3. Authentication Method: **Password**.
4. Set Username: e.g. `weengineers_admin`.
5. Set a strong password (avoid special characters like `@`, `:`, `/` inside the password or URL-encode them).
6. Set Database User Privileges: **Read and write to any database** (or `Built-in Role: readWriteAnyDatabase`).
7. Click **Add User**.

### 3. Configure Network Access (IP Whitelist)
1. In the Atlas sidebar, navigate to **Security** → **Network Access**.
2. Click **Add IP Address**.
3. Click **Allow Access from Anywhere** (`0.0.0.0/0`) with description `Render Web Service Access`.
   > *Note:* Render free and standard web services use dynamic outbound IP addresses, requiring `0.0.0.0/0` access. Your database is secured by the database user credentials.
4. Click **Confirm**.

### 4. Obtain the Connection String
1. Under **Databases**, click **Connect** on your cluster.
2. Choose **Drivers** (Node.js).
3. Copy the SRV URI. It looks like:
   ```text
   mongodb+srv://weengineers_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Specify the database name by inserting `weengineers` before the `?`:
   ```text
   mongodb+srv://weengineers_admin:<password>@cluster0.xxxxx.mongodb.net/weengineers?retryWrites=true&w=majority
   ```

### 5. Managing Atlas with MongoDB Compass (Optional GUI)
1. Download and open [MongoDB Compass](https://www.mongodb.com/products/tools/compass).
2. Paste the exact Atlas connection URI obtained above into the connection bar.
3. Click **Connect** to inspect collections, view records, or monitor performance directly from your desktop.

---

## Part 2: Render Deployment (Backend API)

### 1. Create the Web Service
1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `zainubtech28-ship-it/weengineers-tech`.
4. Configure the service settings:
   - **Name**: `weengineers-backend` (or your preferred service name)
   - **Region**: Choose the region closest to your Atlas cluster (e.g., `Singapore` or `Frankfurt`)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` or `Starter`

### 2. Configure Backend Environment Variables
In the Render Web Service settings, navigate to **Environment** and add the following:

| Key | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations & security flags |
| `PORT` | `10000` *(Render sets this automatically)* | Port the Express server listens on |
| `MONGODB_URI` | `mongodb+srv://.../weengineers?retryWrites=true&w=majority` | Your MongoDB Atlas connection URI |
| `JWT_SECRET` | *(Generate a 32+ character random string)* | Secret key for signing authentication tokens |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Allowed CORS origin (set after Vercel deployment) |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | Secondary CORS origin alias |

> **Tip for JWT_SECRET:** You can generate a cryptographically secure key in your terminal using:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 3. Deploy & Verify Health Check
1. Click **Create Web Service** / **Manual Deploy** → **Deploy latest commit**.
2. Monitor the Render deployment logs. Once complete, your backend will be live at:
   `https://weengineers-backend.onrender.com`
3. Test the built-in health check endpoint in your browser or terminal:
   ```bash
   curl https://weengineers-backend.onrender.com/health
   ```
   **Expected Response (HTTP 200):**
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "timestamp": "2026-10-19T18:00:00.000Z",
     "service": "WEENGINEERS TECH Enterprise API",
     "version": "1.0.0",
     "uptime": 12.34,
     "environment": "production"
   }
   ```

### 4. Optional: Initial Database Seed
To populate the 13 official team members and base corporate data into a brand-new MongoDB Atlas cluster:
1. Temporarily run the seed script locally pointing to your Atlas database:
   ```bash
   # From your local backend directory:
   npm run seed
   ```
   *(Ensure your local `.env` has the Atlas `MONGODB_URI` temporarily configured)*
2. Or use Render's **Shell** tab (available on paid plans) and run `npm run seed`.

---

## Part 3: Vercel Deployment (Frontend Application)

### 1. Import Project to Vercel
1. Sign in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import the GitHub repository: `zainubtech28-ship-it/weengineers-tech`.

### 2. Configure Project Settings
- **Project Name**: `weengineers-tech`
- **Framework Preset**: `Vite`
- **Root Directory**: Click **Edit** and select `frontend` *(Crucial step!)*
- **Build Command**: `npm run build` (or leave default `vite build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Configure Environment Variables
Under **Environment Variables**, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://weengineers-backend.onrender.com` | Deployed Render backend URL (no trailing slash) |

### 4. SPA Routing Configuration (`vercel.json`)
The repository includes `frontend/vercel.json` configured with client-side rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This guarantees that direct URLs and browser refreshes on routes like `/about`, `/services`, `/team`, `/admin/login`, and `/founder/dashboard` resolve correctly without 404 errors.

### 5. Finalize Backend CORS Origin
Once Vercel assigns your production URL (e.g. `https://weengineers-tech.vercel.app`):
1. Return to your **Render Dashboard** → **Backend Web Service** → **Environment**.
2. Update `FRONTEND_URL` and `CORS_ORIGIN` with your Vercel URL:
   ```text
   FRONTEND_URL=https://weengineers-tech.vercel.app
   CORS_ORIGIN=https://weengineers-tech.vercel.app
   ```
3. Render will automatically redeploy with the updated CORS policy.

---

## Part 4: Production Verification Checklist

Run through these verification checks once deployed:

- [ ] **Public Health Check**: Navigate to `https://weengineers-backend.onrender.com/health` and verify `"status": "healthy"`, `"database": "connected"`.
- [ ] **Homepage & Branding**: Visit your Vercel URL. Confirm the homepage loads with high aesthetic quality and company branding.
- [ ] **Team Page (`/team`)**:
  - Exactly 13 members displayed in the official order.
  - Row 1: SURESH R, MAHARAJA, SARANYA, DHANYA SHANKARI.
  - Row 2: ZAINUDEEN (first member in row 2), BALANAVIN S, MAHESH, MATHIVANAN.
  - Row 3: VINOTH, ADSHAYAA, DEEPIKAA, DEVIKAA, ISHWARYALAKSHMI.
  - Every card displays `"B.Tech Information Technology — 3rd Year"`.
  - Zero avatar/photo placeholders.
- [ ] **Navigation & Direct Refresh**:
  - Navigate directly to `/about`, `/services`, `/contact`, `/team`.
  - Press `F5` / Refresh to verify that Vercel rewrites maintain page state without 404s.
- [ ] **Enquiry Submission**:
  - Visit `/contact` or click "Start a Project".
  - Submit a test inquiry. Confirm reference code generation and successful response.
- [ ] **Authentication**:
  - Log in to the Founder Portal (`/founder/login`).
  - Log in to the Admin Portal (`/admin/login`).
  - Verify role-based protected routes and dashboard analytics load.

---

## Part 5: Operational Notes for Free Hosting Tiers

- **Render Cold Starts**: On Render's Free tier, the web service spins down after 15 minutes of inactivity. The first request after a spin-down may take ~30–50 seconds while the container initializes. The frontend is equipped with user-friendly notices explaining this transient state.
- **Persistent Media**: Free Render instances use ephemeral storage. Images uploaded via the Admin Portal are stored in the local `/uploads` directory, which is reset on container redeployments. For persistent enterprise file storage, configure cloud object storage (e.g., Cloudinary or AWS S3).
- **Credentials Protection**: Never commit `.env` files or expose database passwords. Store all production credentials exclusively inside Vercel and Render Environment settings.
