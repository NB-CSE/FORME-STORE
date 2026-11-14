# FORME — Premium E-Commerce Website

A modern, minimalist full-stack e-commerce web application built with React, Vite, Node.js, Express.js, and MongoDB Atlas.

---

## 🎨 Design & Palette
- **Off-white:** `#F7F5F0` (Background)
- **Charcoal Gray:** `#343434` (Typography & Primary Accent)
- **Warm Gray:** `#D6D0C6` (Secondary Accents)
- **White:** `#FFFFFF` (Cards & Containers)
- **Border Tone:** `#DEDAD2` (Dividers & Inputs)
- **Fonts:** Playfair Display (Headers) & Inter (Body)

---

## 🛠️ Tech Stack
- **Frontend:** React.js 19, Vite, React Router 7, Axios, React Hot Toast, React Icons
- **Backend:** Node.js, Express.js, Helmet, CORS, Express-Rate-Limit, Cookie-Parser
- **Database:** MongoDB Atlas + Mongoose
- **Authentication:** bcryptjs password hashing, JWT in secure HTTP-only cookies, client token fallback
- **Payments:** Razorpay test mode (with HMAC signature verification) + built-in instant demo fallback

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
```
Server runs on: `http://localhost:5000`

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Client runs on: `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/forme?retryWrites=true&w=majority
JWT_SECRET=forme_super_secret_jwt_key_2024
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 📦 Database Seeding
To populate MongoDB Atlas with the 12 curated products and the default admin user:
```bash
cd server
npm run seed
```
- **Admin Email:** `admin@forme.com`
- **Admin Password:** `Admin@123`

---

## 🌐 Production Deployment Guide

### A. Deploy Backend to Render (render.com)
1. Push your repository to GitHub.
2. Sign up on [Render.com](https://render.com) and click **New Web Service**.
3. Connect your GitHub repo.
4. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = *(your MongoDB Atlas URI)*
   - `JWT_SECRET` = *(a strong random key)*
   - `CLIENT_URL` = *(your deployed frontend Vercel URL)*
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` = *(optional, test keys)*
6. Click **Deploy Web Service**. Copy your backend URL (e.g., `https://forme-backend.onrender.com`).

### B. Deploy Frontend to Vercel (vercel.com)
1. Sign up on [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Set:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://forme-backend.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID` = *(optional, test key)*
5. Click **Deploy**. Your store is live on your custom `.vercel.app` domain.

---

## 📁 Project Structure
```text
E-com Web/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Hero, ProductCard, Category, Loading
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── data/               # Curated fallback mock product catalogue
│   │   ├── pages/              # Home, ProductList, ProductDetail, Cart, Checkout, Orders, Admin
│   │   ├── services/           # Axios API client
│   │   └── styles/             # Global & modular CSS with CSS variables
│   ├── index.html
│   └── package.json
└── server/                     # Express REST API Backend
    ├── config/                 # MongoDB Mongoose connection
    ├── controllers/            # Auth, Product, Cart, Order, Payment, Admin controllers
    ├── middleware/             # JWT auth & body input validation
    ├── models/                 # User, Product, Order, Cart schemas
    ├── routes/                 # Express API routes
    ├── scripts/                # Database seeder script
    ├── server.js               # Entry point
    └── package.json
```

---

## 📜 License
MIT License. Built for FORME Essentials.
