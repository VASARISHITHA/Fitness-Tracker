# 🏋️‍♀️ Fitness Tracker

A full-stack fitness tracking application designed for Trainers and Trainees to manage workout plans, monitor activity, and visualize progress.

## 🚀 Features

### ✅ Authentication
- Create an account with `name`, `email`, `password`, and `role` (Trainer/Trainee)
- Login using email and password
- Redirects to role-specific dashboard after login

---

### 🧑‍🏫 Trainer Dashboard
- Create workout plans (exercise type, duration, workout type)
- Assign plans to specific trainees
- Create fitness groups and view groups with their members
- Invite trainees to join groups using Gmail
- Track trainee activity:
  - Filter by **date**, **month**, **year**, **city** and **country**

---

### 🧑‍💼 Trainee Dashboard
- View plans assigned by the trainer
- Submit daily activity (activity type, duration, date, city, country)
- View personal progress categorized by activity type (e.g. cycling, swimming)

---

## 🛠️ Tech Stack

**Frontend**: React
**Backend**: Node.js, Express.js  
**Database**: MongoDB  
**Email**: Nodemailer (Gmail)  
**API Docs**: Swagger  
**Auth**: JSON Web Tokens (JWT)

## 📦 Installation

### 1.install backend dependencies
cd backend
npm install express mongoose cors dotenv nodemailer jsonwebtoken bcryptjs

### 2.install frontend dependencies
cd frontend
npm install react-router-dom axios react-chartjs-2

### 3.set up environment variables
create .env file inside the backend directory and add:
    MONGO_URI=your_mongodb_connection_string
    PORT=port_no
    JWT_SECRET=your_jwt_secret
    GMAIL_USER=your_gmail_address
    GMAIL_PASS=your_gmail_app_password

### 4.start the backend server
cd backend
npm start

### 5.start the frontend
cd frontend
npm start

### 6.visit the application
Open your browser and go to: http://localhost:3000

### 7. 📚 API Documentation
Access the interactive API documentation here:  
👉 [Swagger UI](http://localhost:5000/api-docs/)
