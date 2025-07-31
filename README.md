# 🚕 Ride Booking API

A secure, scalable, and role-based RESTful API for a ride booking platform like Uber or Pathao — built with **Express.js**, **Zod**, **MongoDB**, **TypeScript**, and **Mongoose**.

This system supports **riders** requesting rides, **drivers** managing ride status and availability, and **admins** controlling users, drivers, and reports.

---

## 🌟 Features

-   🔐 **JWT-based Authentication**
-   🧑‍🤝‍🧑 **Role-Based Access Control** (`admin`, `rider`, `driver`)
-   🛵 **Ride Lifecycle**: request → accept → in transit → complete
-   ❌ **Cancellations** and rejection tracking
-   📈 **Driver earnings history**
-   📊 **Admin reporting & analytics**
-   📦 Modular & production-ready folder structure

---

## 🚀 Tech Stack

-   **Backend:** Express.js, TypeScript, Mongoose, MongoDB
-   **Security:** JWT, Bcrypt, Zod validation, Role-based middleware
-   **Testing & Docs:** Postman, README, Demo video

---

## ⚙️ Setup & Environment Instructions

### 🧩 Prerequisites

-   Node.js v18+
-   MongoDB Atlas/local
-   Package manager (npm or yarn)

### 🛠 Installation

```bash
# Clone the project
git clone https://github.com/iamabraryeasir/ride-booking-api.git
cd ride-booking-api

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### 🚴‍♂️ Run the Server

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

---

## 📫 API Endpoints Summary

Here’s a fully checked list of your API endpoints, organized by module and presented in Markdown table format:

#### 🔐 Auth Routes

| Method | Endpoint              | Description                 | Auth   |
| ------ | --------------------- | --------------------------- | ------ |
| POST   | `/auth/login`         | Login with email & password | Public |
| POST   | `/auth/logout`        | Logout current session      | Public |
| POST   | `/auth/refresh-token` | Refresh access token        | Public |

#### 👤 User Routes (Admin-only)

| Method | Endpoint                  | Description             | Auth   |
| ------ | ------------------------- | ----------------------- | ------ |
| POST   | `/users/register`         | Register a new user     | Public |
| PATCH  | `/users/toggle-block/:id` | Block or unblock a user | Admin  |

#### 🛠 Admin Routes

| Method | Endpoint                            | Description                             | Auth  |
| ------ | ----------------------------------- | --------------------------------------- | ----- |
| GET    | `/reports`                          | Get system summary report               | Admin |
| GET    | `/users`                            | List all users (with filters)           | Admin |
| GET    | `/drivers`                          | List all drivers                        | Admin |
| GET    | `/rides`                            | List all rides                          | Admin |
| PATCH  | `/drivers/approve/:driverId`        | Approve driver application              | Admin |
| PATCH  | `/drivers/reject/:driverId`         | Reject driver (body: `rejectionReason`) | Admin |
| PATCH  | `/drivers/toggle-suspend/:driverId` | Suspend or unsuspend a driver           | Admin |

#### 🚗 Driver Routes

| Method | Endpoint                       | Description                  | Auth   |
| ------ | ------------------------------ | ---------------------------- | ------ |
| POST   | `/drivers/apply`               | Apply to become a driver     | Rider  |
| PATCH  | `/drivers/toggle-availability` | Toggle online/offline status | Driver |
| GET    | `/drivers/earnings`            | View earnings history        | Driver |

#### 📦 Ride Control (Driver)

| Method | Endpoint                | Description                            | Auth   |
| ------ | ----------------------- | -------------------------------------- | ------ |
| PATCH  | `/rides/accept/:rideId` | Accept a pending ride                  | Driver |
| PATCH  | `/rides/reject/:rideId` | Reject a pending ride (body: `reason`) | Driver |

#### 🧍 Rider Routes

| Method | Endpoint                     | Description                          | Auth  |
| ------ | ---------------------------- | ------------------------------------ | ----- |
| POST   | `/rides/request`             | Request a new ride                   | Rider |
| PATCH  | `/rides/cancel-ride/:rideId` | Cancel a ride (body: `cancelReason`) | Rider |
| GET    | `/rides/my-rides`            | View your ride history               | Rider |

#### 🔧 Misc

| Method | Endpoint | Description  | Auth   |
| ------ | -------- | ------------ | ------ |
| GET    | `/`      | Health check | Public |

---

## 🧪 Testing

-   Use **Postman** for testing routes (collection included in repo)
-   Test with different roles: `admin`, `rider`, `driver`
-   JWT must be attached to all protected routes

---

## 📁 Folder Structure

```bash
src/
├── app.ts
├── modules/
│   ├── auth/
│   ├── user/
│   ├── driver/
│   ├── ride/
├── middlewares/
├── utils/
├── config/
└── server.ts
```

---

## 🙌 Author

-   **Name:** Abrar
-   **Role:** Full-stack Developer, Gen-Z Builder
-   **Contact:** \[LinkedIn / GitHub / Email]

---

## 🏁 Final Thoughts

This API is clean, modular, and built with scalability in mind. Future versions can include:

-   🚦 Fare estimation
-   🌍 Geo-location based driver search
-   ⭐ Rider feedback & rating system
-   📲 Integration with a frontend/mobile app

---
