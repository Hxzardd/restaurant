# 🍽️ ACM Round 2 – Restaurant Online Ordering System

**Live Links**
https://restaurant.hxzard.com   

---

## Overview

This project was developed as part of **ACM Round 2**, with the objective of building a **full-stack restaurant online ordering website** using **React (frontend)** and **Python Flask (backend)**.

The system allows users to browse a restaurant menu, place orders, and track order status, while providing an admin interface for managing menu items and orders.

---

## Core Features

### User Features
- User registration and login using JWT authentication
- Browse restaurant menu
- Search menu items by name
- Filter menu by category (Veg / Non-Veg) and price range
- Add items to cart and place orders
- View order history
- Track order status (Pending, Preparing, Ready, Delivered)

### Admin Features
- Admin dashboard
- Add, edit, and delete menu items
- View all user orders
- Update order status
- Admin-only protected routes

### Some more features
- JWT-based authentication
- Role-based access control (Admin vs User)
- Email notification when order status changes to **Ready**
- Fully deployed frontend and backend

---

## Tech stack used

**Frontend**
- React
- Vite
- Axios
- Tailwind CSS

**Backend**
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-Mail
- Gunicorn

**Database**
- SQLite (development)
- PostgreSQL (production – NeonDB)

---

## Security Features

- Password hashing using Werkzeug
- JWT-based authentication
- Admin-only route protection
- CORS configuration for allowed domains
- SQL injection protection using ORM
- Environment variables for sensitive data

---

## API Endpoints (Examples)

### Authentication

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Menu (Public)

```http
GET /menu
```

```http
GET /menu?category=Veg&min_price=100&max_price=300&q=paneer
```

---

### Menu (Admin Only)

```http
POST /menu
Authorization: Bearer <JWT_TOKEN>

{
  "name": "Paneer Butter Masala",
  "description": "Creamy paneer curry",
  "price": 220,
  "category": "Veg"
}
```

```http
PUT /menu/1
DELETE /menu/1
```

---

### Orders (User)

```http
POST /orders
Authorization: Bearer <JWT_TOKEN>
```

```http
GET /orders/my
Authorization: Bearer <JWT_TOKEN>
```

---

### Orders (Admin)

```http
GET /orders/all
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

```http
PUT /orders/3/status
Authorization: Bearer <ADMIN_JWT_TOKEN>

{
  "status": "Ready"
}
```

---

## Local Development Setup

### Backend

```bash
pip install -r requirements.txt
python run.py
```

### Frontend

```bash
npm install
npm run dev
```

---

## Production Deployment

- **Backend:** Deployed on Render using Gunicorn  
- **Frontend:** Deployed on Render (Vite build)  
- **Database:** NeonDB (PostgreSQL)  
- **Custom Domains:**
  - Frontend: https://restaurant.hxzard.com
  - Backend API: https://restaurant-api.hxzard.com