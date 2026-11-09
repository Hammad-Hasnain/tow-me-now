# Tow Me Now | Roadside-Assistance & Towing Management Monorepo
> A real-time roadside-assistance and vehicle towing platform connecting customers in need of a tow with available drivers, built for high reliability and rapid response.

---

## Technical Overview

Tow Me Now is an enterprise-grade roadside assistance platform designed to solve coordination delays and tracking gaps during emergency vehicle breakdowns. In standard towing applications, delayed driver dispatch or lack of location awareness leads to extended customer wait times and poor route efficiency. Tow Me Now addresses this through an **Optimized Dispatch & Tracking Engine**:

* **Real-Time Matching:** Instant location-based distance calculations to pair stranded customers with the closest available towing drivers.
* **Transactional Trip Progression:** Robust state management ensuring atomic transitions across pickup, towing, and completion stages.
* **Database Consistency:** MongoDB session transactions handling driver duty updates and earnings updates concurrently.
* **Multi-Client Architecture:** Decoupled interfaces tailored for stranded customers (mobile), active drivers (mobile), and back-office dispatchers (web dashboard).

---

## Monorepo Architecture

Managed via **Turborepo** and npm workspaces, the project enforces clean separation across backend APIs, admin management tools, and mobile client apps.

```text
tow-me-now/
├── apps/
│   ├── server/           # NestJS REST API, Mongoose Models, Transaction Handlers
│   ├── web-admin/        # Next.js Admin Dashboard & Operations Panel
│   └── mobile-app/       # React Native CLI Driver & Customer Client Application
├── turbo.json            # Monorepo pipeline configuration
└── package.json          # Root workspace scripts & workspace mappings
```

### 1. Backend Service (`apps/server`)
* **Framework:** NestJS (TypeScript) with Modular Domain Architecture (`identity`, `user`, `driver`, `service-request`, `admin`).
* **Authentication & Security:** JWT-based authentication paired with bcrypt password hashing and modular role validation.
* **Database:** Mongoose / MongoDB for structured storage of users, drivers, and service requests.
* **Geospatial & Logic:** Coordinate-based distance sorting, fare estimation calculations, and atomic MongoDB sessions.

### 2. Admin Dashboard (`apps/web-admin`)
* **Framework:** Next.js (App Router, Tailwind CSS).
* **State & Data Fetching:** React, TypeScript, and optimized API integration hooks.
* **Operations Panel:** Real-time visibility into customer records, driver fleet availability, and service request lifecycles.

### 3. Mobile Application (`apps/mobile-app`)
* **Framework:** React Native CLI, TypeScript, React Navigation.
* **Location Services:** Device geolocation integration combined with OpenStreetMap Nominatim for address search and lookup.
* **Client Flows:** Dual-persona experience supporting customer service creation and driver task management.

---

## Domain Models & Workflow

```text
[ Customer ] ---> Submits Service Request ---> [ Request: PENDING ]
                                                       |
                                        (Driver Selection & Assignment)
                                                       |
[ Driver Decision: Accept ] --------------> [ Request: ACCEPTED ]
                                                       |
                                 [ ARRIVED ] ---> [ TOWING ] ---> [ COMPLETED ]
```

### Core Operational Flow
1. **Service Request Creation:** Customers submit breakdown details, vehicle info, pickup coordinates, and destination.
2. **Driver Ranking & Selection:** The system evaluates available drivers nearby, calculates estimated fares based on distance and vehicle type, and presents matches.
3. **Trip Execution:** Assigned drivers accept requests, advancing through `ACCEPTED` -> `ARRIVED` -> `TOWING` -> `COMPLETED`.
4. **Completion & Status Reset:** Upon reaching `COMPLETED`, driver earnings update and the driver's duty status is reset safely via database transactions.

---

## Local Development Setup

### Prerequisites
* Node.js (`v22.11.0` or higher required for mobile client compatibility)
* npm / npx
* MongoDB (Local instance or MongoDB Atlas)
* Android Studio / Xcode (for running the React Native CLI mobile app on emulators or physical devices)

### 1. Environment Configuration
Copy `apps/server/.env.example` to `apps/server/.env.development` and configure your environment variables:

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/towmenow
JWT_SECRET=replace-with-a-local-secret
JWT_EXPIRATION=1d
BCRYPT_SALT_ROUNDS=10
```

### 2. Installation & Running
Install dependencies at the monorepo root:

```bash
npm install
```

Start the Backend & Admin Dashboard simultaneously via Turborepo:

```bash
npm run dev --workspace=server
npm run dev --workspace=web-admin
```

Start the Mobile Application (React Native CLI / Metro):

```bash
npm run start --workspace=TowingApp
```

To run on an Android device/emulator:

```bash
npm run android --workspace=TowingApp
```

---

## Project Verification & Status
* **Monorepo Workspaces:** Backend API, Admin Dashboard, and Mobile App structured cleanly under Turborepo and npm workspaces.
* **Testing & Quality:** Built-in unit and e2e testing suites configured for backend services and mobile applications.
* **Deployment State:** Configured for local development, testing, and enterprise demonstration environments.

---

## Engineering Team & Credits

* **Hammad Hasnain** - *Systems Architect & Backend Engineer*  
  Designed the overall monorepo structure, systems architecture, and built the NestJS core REST API, geospatial routing logic, and database transactional management layers.  
  [LinkedIn Profile](https://www.linkedin.com/in/hammadhasnain/) | [GitHub Portfolio](https://github.com/Hammad-Hasnain/)


* **Ahmed** - *Mobile Application Engineer*  
  Engineered the multi-persona React Native cross-platform client app, implementing localized device telemetry tracking, geolocation systems, and modular screen navigations.
  [LinkedIn Profile](https://www.linkedin.com/in/) | [GitHub Portfolio](https://github.com/Ahmed-201)
  

* **Usaid** - *Frontend Engineer (Web Admin)*  
  Developed the comprehensive Next.js central management dashboard panel, setting up global infrastructure tracking dashboards, administrative tools, and real-time operations interfaces.
  [LinkedIn Profile](https://www.linkedin.com/in/) | [GitHub Portfolio](https://github.com/)
