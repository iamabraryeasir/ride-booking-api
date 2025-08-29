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
| GET    | `/reports/daily-analytics`          | Get daily analytics (last 7 days)      | Admin |
| GET    | `/reports/monthly-analytics`        | Get monthly analytics (last 6 months)  | Admin |
| GET    | `/reports/driver-activity`          | Get driver activity statistics          | Admin |
| GET    | `/reports/revenue-trends`           | Get revenue trends (last 30 days)      | Admin |
| GET    | `/users`                            | List all users (with filters)          | Admin |
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
| GET    | `/drivers/my-rides`            | Get driver ride history      | Driver |

#### 📦 Ride Control (Driver)

| Method | Endpoint                | Description                            | Auth   |
| ------ | ----------------------- | -------------------------------------- | ------ |
| GET    | `/rides/incoming`       | Get available ride requests            | Driver |
| PATCH  | `/rides/accept/:rideId` | Accept a pending ride                  | Driver |
| PATCH  | `/rides/reject/:rideId` | Reject a pending ride (body: `reason`) | Driver |
| PATCH  | `/rides/update-ride-status/:rideId` | Update ride status (PICKED_UP, IN_TRANSIT, COMPLETED) | Driver |

#### 🧍 Rider Routes

| Method | Endpoint                     | Description                          | Auth  |
| ------ | ---------------------------- | ------------------------------------ | ----- |
| POST   | `/rides/request`             | Request a new ride                   | Rider |
| POST   | `/rides/estimate-fare`       | Estimate ride fare                   | Rider |
| PATCH  | `/rides/cancel/:rideId`      | Cancel a ride (body: `cancelReason`) | Rider |
| GET    | `/rides/my-rides`            | View your ride history               | Rider |
| GET    | `/rides/:rideId`             | Get detailed ride information        | All   |

#### 👤 Profile Management (All Users)

| Method | Endpoint                | Description                  | Auth |
| ------ | ----------------------- | ---------------------------- | ---- |
| GET    | `/users/profile`        | Get user profile             | All  |
| PATCH  | `/users/profile`        | Update user profile          | All  |
| PATCH  | `/users/change-password`| Change user password         | All  |

#### 💳 Payment Methods (Riders)

| Method | Endpoint                        | Description                    | Auth  |
| ------ | ------------------------------- | ------------------------------ | ----- |
| GET    | `/payment-methods`              | Get user payment methods       | Rider |
| POST   | `/payment-methods`              | Add new payment method         | Rider |
| PATCH  | `/payment-methods/:methodId`    | Update payment method          | Rider |
| DELETE | `/payment-methods/:methodId`    | Delete payment method          | Rider |

#### 🚨 Emergency Contacts (All Users)

| Method | Endpoint                         | Description                    | Auth |
| ------ | -------------------------------- | ------------------------------ | ---- |
| GET    | `/emergency-contacts`            | Get emergency contacts         | All  |
| POST   | `/emergency-contacts`            | Add emergency contact          | All  |
| PATCH  | `/emergency-contacts/:contactId` | Update emergency contact       | All  |
| DELETE | `/emergency-contacts/:contactId` | Delete emergency contact       | All  |

#### ⭐ Rating & Feedback System

| Method | Endpoint                   | Description                      | Auth         |
| ------ | -------------------------- | -------------------------------- | ------------ |
| GET    | `/ratings`                 | Get user ratings (given/received)| All          |
| POST   | `/ratings/ride/:rideId`    | Rate a completed ride            | Rider/Driver |
| PATCH  | `/ratings/:ratingId`       | Update rating                    | Rider/Driver |
| DELETE | `/ratings/:ratingId`       | Delete rating                    | Rider/Driver |
| GET    | `/ratings/average/:userId` | Get user average rating          | All          |

#### ⚙️ User Settings & Preferences

| Method | Endpoint           | Description                  | Auth |
| ------ | ------------------ | ---------------------------- | ---- |
| GET    | `/settings`        | Get user settings            | All  |
| PATCH  | `/settings`        | Update user settings         | All  |
| POST   | `/settings/reset`  | Reset settings to default    | All  |

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
