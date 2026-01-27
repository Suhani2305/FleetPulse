# 🚀 FleetPulse Deployment Guide

This guide will help you deploy the **FleetPulse** application to production using **Render** (Backend) and **Vercel** (Frontend).

## 1. 🌐 Backend Deployment (Render)

Render is great for hosting Node.js APIs.

### Steps:
1. **Create a Web Service**: Log in to [Render](https://render.com/) and click **New > Web Service**.
2. **Connect Repository**: Connect your GitHub repository.
3. **Settings**:
   - **Name**: `fleetpulse-backend`
   - **Root Directory**: `backend` (CRITICAL: Set this to the backend folder)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Environment Variables**: Add the following in the **Env Vars** tab:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_ACCESS_SECRET`: A long random string.
   - `JWT_ACCESS_EXPIRES_IN`: `1d`
   - `NODE_ENV`: `production`
   - `PORT`: `4000` (Render will override this, but good to have)

## 2. 🎨 Frontend Deployment (Vercel)

Vercel is optimized for Vite projects.

### Steps:
1. **Create Project**: Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. **Connect Repository**: Connect your GitHub repository.
3. **Settings**:
   - **Framework Preset**: `Vite` (Should be auto-detected)
   - **Root Directory**: `./` (The root of the repo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**: Add your backend URL:
   - `VITE_API_BASE_URL`: `https://your-backend-name.onrender.com`
   - `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key (if used).

## 3. 💾 Database (MongoDB Atlas)

Ensure your MongoDB Atlas cluster allows incoming connections from anywhere (`0.0.0.0/0`) since Render IPs change, or use a static IP service if needed.

## 🛠️ Performance Check
- The backend will sleep on Render's free tier after 15 mins of inactivity. The first request after a sleep might take 30-60 seconds.
- The frontend uses `vercel.json` to handle client-side routing, so refreshing on `/dashboard` will work.
