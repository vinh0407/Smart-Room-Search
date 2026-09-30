# Smart Room Search

A full-stack rental housing discovery and property management platform supporting major metropolitan areas nationwide across Vietnam (Ho Chi Minh City, Hanoi, Da Nang, Binh Duong, Can Tho, Hai Phong, and more).

The platform aggregates listings from primary landlords and prominent rental channels (Cho Tot Nha, Batdongsan, Phongtro123), featuring cascading 3-tier administrative filtering (Province/City -> District -> Ward), interactive distance-aware map exploration, streamlined tenant demand submission, and an automated administration dashboard.

The ecosystem consists of:
- Tenant Web Application (React 18 + Vite + Tailwind CSS)
- Native Android Mobile App (Kotlin + Jetpack Compose)
- Dedicated Admin Web Portal (React 18 + Vite)
- Serverless Backend API (Cloudflare Workers + Node.js Express)
- Distributed Database (TiDB Cloud MySQL via Data Service)

---

## Live Deployments

| Component | URL | Description |
|---|---|---|
| Tenant Website | https://smart-room-search.vercel.app | Room search, cascading filter, interactive map, room demands |
| Admin Web Portal | https://smart-room-admin.vercel.app | Property, tenant, demand management, statistics dashboard |
| Backend REST API | https://smart-room-api.smart-room-backend.workers.dev/api | Cloudflare Workers edge deployment |
| API Health Check | https://smart-room-api.smart-room-backend.workers.dev/health | System status and database connectivity check |

Default Admin Credentials:
- Username: `admin`
- Password: `123`

---

## Android Mobile Application (APK)

Download the production-ready Android APK package directly from GitHub:

| Release Version | Direct Download Link | Package Size | Status |
|---|---|---|---|
| Smart Room Search v2.0 | [Download SmartRoomSearch-v2.0.apk](https://github.com/vinh0407/Smart-Room-Search/raw/main/APK/SmartRoomSearch-v2.0.apk) | ~28.8 MB | Latest Release |
| Smart Room Search v1.0 | [Download SmartRoomSearch-v1.0.apk](https://github.com/vinh0407/Smart-Room-Search/raw/main/APK/SmartRoomSearch-v1.0.apk) | ~28.0 MB | Legacy Release |

### Key Improvements in Version 2.0:
1. Nationwide Scope: Expanded property listings across major cities and provinces nationwide.
2. Cascading 3-Tier Filter: Granular location targeting across Province/City -> District -> Ward for room search and tenant demand posting.
3. Multi-Channel Aggregation: Categorized room feeds from both verified direct owners and external platforms (Cho Tot Nha, Batdongsan, Phongtro123) scoped to the selected city.
4. Resolved Mobile Map Rendering: Leaflet OpenStreetMap in Android WebView upgraded with multi-CDN fallbacks (cdnjs + jsDelivr) and readiness polling to eliminate blank screen errors.
5. High Performance: Progressive pagination, memoized card rendering, and canvas-rendered maps for smooth scrolling and responsive navigation.

### Android Installation Instructions:
1. Download the APK file onto your Android device.
2. Open the downloaded file.
3. If prompted, enable "Install unknown apps" or "Allow from this source" in system settings.
4. Complete the installation. (The APK is debug-signed for evaluation and testing).

---

## Core Features

### 1. Tenant Web Application
- Multi-criteria Search: Keyword search, dual-range price slider, area boundaries, amenities (air conditioning, Wi-Fi, mezzanine, balcony, private kitchen, pet-friendly, free hours), and rental availability status.
- 3-Tier Administrative Navigation: Synchronized cascading dropdowns for Province/City, District, and Ward.
- Interactive Map View: Leaflet OpenStreetMap with custom SVG markers, dynamic radius filtering, and real-time distance calculations from user coordinates.
- Property Details Page: Photo gallery, monthly utility breakdown (electricity, water, internet, service fees), mini map overview, and contextual recommendations.
- Room Demands Hub: Submit rental requirements using structured 3-tier forms or natural language text parsing.
- Direct Contact Integration: One-click phone calling and Zalo messaging with landlords, with automatic contact tracking.
- Local Favorites and Dark Mode: Offline favorites stored in LocalStorage and full dark/light theme switching.

### 2. Native Android Application
- Architecture: 100% Kotlin with Jetpack Compose (Material Design 3), MVVM pattern, Coroutines, and StateFlow.
- Multi-CDN Map Engine: Leaflet OpenStreetMap in WebView backed by Cloudflare cdnjs and jsDelivr fallbacks, SSL handling, and automatic viewport invalidation.
- Hierarchical Filter Chips: Horizontal scrolling chips for City, District, and Ward filtering.
- Offline Data Persistence: Local Room Database for saved offline favorites.
- Integrated Landlord Management: In-app administrative portal with dashboard metrics, property status toggling, and tenant records.

### 3. Admin Web Portal
- Operational Dashboard: Real-time metrics for total rooms, vacancies, rented units, maintenance status, active tenants, and pending demands.
- Intelligent AI Data Entry: Paste unstructured rental descriptions from social media or chat logs; the system automatically extracts fields (price, area, address, deposit, utilities, contact info) via `POST /api/rooms/parse`.
- Property Lifecycle Management: Create, update, delete, and switch status (available, rented, maintenance).
- Tenant History Tracking: Active tenant directory and historical rental lease records.
- Geocoding and AI Descriptions: Automated geocoding from street addresses into latitude/longitude coordinates and AI-assisted listing copywriting.

### 4. Serverless Edge Backend and Database
- Cloudflare Workers: Global edge deployment with minimal latency and high availability.
- TiDB Cloud Database: Distributed MySQL engine connected via TiDB Data Service with HTTP Digest Authentication.
- Security: Password hashing with bcryptjs, JWT bearer token authentication, login brute-force rate limiting, and CORS restrictions.

---

## System Architecture

```
+-----------------------------+   +-----------------------------+   +-----------------------------+
|    Native Android App       |   |      Tenant Web App         |   |      Admin Web Portal       |
|  (Kotlin + Jetpack Compose) |   |    (React 18 + Vite)        |   |    (React 18 + Vite)        |
+--------------+--------------+   +--------------+--------------+   +--------------+--------------+
               |                                 |                                 |
               +---------------------------------+---------------------------------+
                                                 | HTTPS REST API
                                                 v
                                  +-----------------------------+
                                  |     Cloudflare Workers      |
                                  |    (Production REST API)    |
                                  |     Express (Local Dev)     |
                                  +--------------+--------------+
                                                 | HTTP Digest Auth
                                                 v
                                  +-----------------------------+
                                  |      TiDB Data Service      |
                                  |        (TiDB Cloud)         |
                                  +--------------+--------------+
                                                 |
                                                 v
                                  +-----------------------------+
                                  |     MySQL smart_room_db     |
                                  +-----------------------------+
```

---

## Repository Directory Structure

```
Smart-Room-Search/
|-- APK/                                     # Android APK installation packages
|   |-- SmartRoomSearch-v2.0.apk             # Version 2.0 release package
|   `-- SmartRoomSearch-v1.0.apk             # Version 1.0 release package
|-- Smart Room Search Website-FE/            # Tenant Web frontend and Android source code
|   |-- src/
|   |   |-- app/
|   |   |   |-- App.tsx                      # Primary web application interface
|   |   |   `-- App.test.ts                  # Test suites for web logic and UI
|   |   `-- components/
|   |       `-- RoomMap.tsx                  # Leaflet OpenStreetMap component
|   |-- android/                             # Native Android project (Kotlin Compose)
|   |   `-- app/src/main/java/com/smartroomsearch/app/
|   |       |-- ui/                          # Compose screens (Home, Demands, Map, Detail, Admin)
|   |       |-- api/                         # RetrofitClient and API services
|   |       |-- model/                       # Data models and source data definitions
|   |       `-- repository/                  # Room database and offline repositories
|   `-- android_apk/                         # Mirrored APK directory for web distribution
|-- Smart Room Search Website-BE/            # Backend API service (Express and Cloudflare Worker)
|   |-- src/
|   |   |-- server.js                        # Express server entry point (local development)
|   |   |-- worker.js                        # Cloudflare Worker entry point (production)
|   |   |-- controllers/                     # API controllers (rooms, tenants, demands, auth, AI)
|   |   |-- utils/                           # AI text parser utilities
|   |   `-- config/                          # Database connection and TiDB Data Service config
|   |-- sql/schema.sql                       # Database schema definition
|   `-- wrangler.jsonc                       # Cloudflare Workers configuration
|-- Admin/                                   # Standalone Admin Web Portal (React + Vite)
`-- README.md                                # Project documentation
```

---

## Installation and Local Setup

### System Prerequisites
- Node.js: version 20 or higher (version 22 LTS recommended)
- Java Development Kit (JDK): JDK 21 or Android Studio bundled JBR
- Android Studio: Ladybug, Koala, or higher

---

### 1. Tenant Web Application

```bash
cd "Smart Room Search Website-FE"
npm install
npm run dev
```
- Local URL: http://localhost:5173
- Run automated tests:
  ```bash
  npm test
  ```
- Production build:
  ```bash
  npm run build
  ```

---

### 2. Backend API Service

```bash
cd "Smart Room Search Website-BE"
npm install
cp .env.example .env
npm run dev
```
- Local Server URL: http://localhost:4000
- Health verification: http://localhost:4000/health

Deploying to Cloudflare Workers:
```bash
npx wrangler login
npx wrangler secret put JWT_SECRET
npx wrangler secret put TIDB_DATA_PUBLIC_KEY
npx wrangler secret put TIDB_DATA_PRIVATE_KEY
npx wrangler deploy
```

---

### 3. Android Mobile Application

Open the project directory `Smart Room Search Website-FE/android` in Android Studio, or compile using the Gradle wrapper:

```powershell
cd "Smart Room Search Website-FE/android"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
.\gradlew.bat assembleDebug
```
The compiled APK binary is located at:  
`Smart Room Search Website-FE/android/app/build/outputs/apk/debug/app-debug.apk`

---

## Primary REST API Endpoints

| HTTP Method | Endpoint | Authorization | Description |
|---|---|---|---|
| POST | /api/login | Public | Admin login; returns JWT authentication token |
| GET | /api/rooms | Public | Retrieve room listings with filters (city, district, price, area, status, search) |
| GET | /api/rooms/:id | Public | Retrieve detailed information for a specific property |
| POST | /api/rooms/:id/view | Public | Increment room view counter |
| POST | /api/rooms/:id/contact | Public | Increment room contact counter (Zalo / Phone) |
| POST | /api/rooms/parse | Admin | AI Data Entry: Parse natural language text into room attributes |
| POST | /api/rooms | Admin | Create a new room listing |
| PUT | /api/rooms/:id | Admin | Update existing room listing |
| DELETE | /api/rooms/:id | Admin | Remove room listing |
| PUT | /api/rooms/:id/status | Admin | Update room status (available, rented, maintenance) |
| GET | /api/rooms/stats | Admin | Dashboard summary metrics |
| GET | /api/demands | Public | Retrieve active tenant rental demands |
| POST | /api/demands | Public | Submit a new tenant rental demand |
| GET | /api/tenants | Admin | Retrieve current tenant directory |
| GET | /api/tenant-history | Admin | Retrieve historical lease records |
| POST | /api/ai/room-description | Admin | AI-generated room marketing descriptions |
| GET | /api/geocode | Admin | Convert address text to geographic coordinates |
| GET | /health | Public | Backend health check and database status |

---

## License and Maintainer

Project developed and maintained by:
- Author: Ung Do The Vinh
- GitHub: https://github.com/vinh0407
- Repository: https://github.com/vinh0407/Smart-Room-Search
- Contact: 0337244067
- Copyright: (c) 2025 - 2026 Smart Room Search. All rights reserved.
