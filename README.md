# FORME — Premium E-Commerce Website

[![Live Store](https://img.shields.io/badge/Live%20Store-forme--store.onrender.com-success?style=for-the-badge&logo=render)](https://forme-store.onrender.com)
[![Backend API](https://img.shields.io/badge/API-Online-blue?style=for-the-badge&logo=express)](https://forme-backend-api.onrender.com/api/health)

A modern, minimalist full-stack e-commerce web application built with React, Vite, Node.js, Express.js, and MongoDB Atlas.

---

## 🌐 Live Production Links

- 🛍️ **Live Online Store:** **[https://forme-store.onrender.com](https://forme-store.onrender.com)**
- ⚙️ **Backend REST API:** **[https://forme-backend-api.onrender.com/api/health](https://forme-backend-api.onrender.com/api/health)**
- 🎛️ **Admin Dashboard:** **[https://forme-store.onrender.com/admin](https://forme-store.onrender.com/admin)**

*(Note: The live site is hosted on Render at the links above, not on GitHub Pages).*

---

## 🎨 Design & Palette
- **Off-white:** `#F7F5F0` (Background)
- **Charcoal Gray:** `#343434` (Typography & Primary Accent)
- **Warm Gray:** `#D6D0C6` (Secondary Accents)
- **White:** `#FFFFFF` (Cards & Containers)
- **Border Tone:** `#DEDAD2` (Dividers & Inputs)
- **Typography:** Playfair Display (Headers) & Inter (Body)

---

## 🛠️ Tech Stack
- **Frontend:** React.js 19, Vite, React Router 7, Axios, React Hot Toast, React Icons
- **Backend:** Node.js, Express.js, Helmet, CORS, Express-Rate-Limit, Cookie-Parser
- **Database:** MongoDB Atlas + Mongoose
- **Authentication:** bcryptjs password hashing, JWT in secure HTTP-only cookies, client token fallback
- **Payments:** Razorpay test mode (with HMAC signature verification) + built-in instant demo fallback

---

## ✨ Features Included
1. **Homepage:** Premium hero section, brand pillars, visual category cards, curated featured products, brand ethos statement, and directory footer.
2. **Product Catalog:** Real-time search, category filters (Clothing, Accessories, Footwear, Bags, Beauty, Home), price slider, and sorting.
3. **Product Details:** Multi-angle image gallery, size picker, color swatches, quantity counter, and stock indicator.
4. **Shopping Cart:** Persistent cart in browser storage, automatic 18% GST and free shipping calculations.
5. **Checkout & Payment:** Shipping address collection, Razorpay test payment integration, and instant demo payment fallback.
6. **Orders:** Customer order list and detailed tracking receipts.
7. **Admin Dashboard:** Total revenue overview, order status updater, and product creator.

---

## 🚀 Local Development Setup

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
- **Default Admin Account:** `admin@forme.com`
- **Default Admin Password:** `Admin@123`

---

## 📜 License
MIT License. Built for FORME Essentials.
