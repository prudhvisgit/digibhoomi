# BHOOMISETU — LAND STACK DIGITAL PUBLIC INFRASTRUCTURE
> *"Connecting Every Parcel to Every Possibility"*

Prototype Implementation for **Smart India Hackathon 2026 Problem Statement SIH26014**.

---

## 🌟 Executive Summary
**BhoomiSetu** is an integrated GIS-based Digital Public Infrastructure (DPI) for Land Governance. It establishes a unified **Parcel-Centric Framework** that connects disconnected land datasets—including Revenue (Record of Rights / Adangal 1B), Sub-Registrar Deed Registrations, Municipal Urban Planning & Zoning, Property Taxation, Infrastructure Utilities, Environmental Restrictions, and Civil Court Litigation—indexed around a common **ULPIN** (Unique Land Parcel Identification Number) identifier.

```text
LAND PARCEL → ULPIN → MULTIPLE GOVERNANCE DATASETS → WORKFLOWS → CITIZEN SERVICES → ANALYTICS
```

---

## 🚀 Key Features

1. **Parcel-Centric GIS Engine**: MapLibre GL JS / Leaflet vector map renderer supporting 500+ parcels, 3-layer architecture (Base Layer, Core Governance, Additional Use-Case), layer toggles, and ULPIN tooltips.
2. **17-Tab Detailed Parcel Dashboard**: Comprehensive single-source-of-context panel covering Overview, Ownership, RoR, Registration, Encumbrance, Zoning, Master Plan, Building Permit, Property Tax, Utilities, Infrastructure, Environment, Disputes, Timeline, and Audit logs.
3. **Explainable AI Land Governance Engine**:
   - **Land Risk Score (0-100)**: Transparent score with positive and negative risk factors.
   - **Data Anomaly Detection**: Cross-checks RoR area vs Registration deed area vs PostGIS spatial geometry.
   - **Simulated Satellite Change Detection**: Detects unsanctioned construction footprints & vegetation loss.
   - **Workflow Delay Prediction**: Machine learning prediction engine forecasting approval bottlenecks.
4. **Configurable State Architecture (`state_config.json`)**: Configurable administrative hierarchy (State → District → Mandal/Taluk → Village → ULPIN) and terminology mapping for **Andhra Pradesh** (Visakhapatnam), **Tamil Nadu**, **Karnataka**, **Telangana**, and **Maharashtra**.
5. **Citizen & Government Portals**: Universal parcel lookup, online citizen service request submission (mutation, building permits, tax queries), live REQ tracking, and RBAC officer dashboards.
6. **Departmental Interoperability Monitor**: Status dashboard monitoring live REST APIs across Revenue, Registration, Municipality, Tax, Utilities, and Law & Justice.
7. **Role-Based Access Control (RBAC) & Immutable Audit Trail**: 11 granular roles with automatic audit log tracking.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet / MapLibre GL JS, Recharts.
- **Backend**: Node.js, Express, TypeScript, JWT Authentication, bcryptjs, CORS, PostGIS spatial driver.
- **Database**: PostgreSQL with PostGIS extension (includes seed generator for 500+ parcels).
- **DevOps**: Docker, Docker Compose.

---

## 🔑 Demo Credentials & Roles

| Role | Email | Password | Department |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@bhoomisetu.gov.in` | `admin123` | DPI Governance |
| **Revenue Officer (Tahsildar)** | `revenue@bhoomisetu.gov.in` | `revenue123` | Revenue & Land Records |
| **Registration Officer (SRO)** | `registration@bhoomisetu.gov.in` | `reg123` | Registration & Stamps |
| **Municipal Planner** | `planning@bhoomisetu.gov.in` | `plan123` | VMRDA Planning |
| **Citizen / Land Buyer** | `citizen@bhoomisetu.gov.in` | `citizen123` | Public Portal |

---

## 🏁 Quick Start & Installation

### Option 1: Local Development (Node.js)

1. **Install Backend Dependencies & Seed Data**:
   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```
   *Backend runs on `http://localhost:5000`*

2. **Install Frontend Dependencies & Run**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend runs on `http://localhost:3000`*

---

### Option 2: Docker Compose

```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- PostGIS: `localhost:5432`

---

## 🎯 SIH Judging Demo Walkthrough Scenarios

Use the top **SIH Judge Quick Bar** in the application to trigger interactive demonstration scenarios:

### Scenario 1: Citizen Land Buyer Journey
1. Select **Scenario 1** on top bar or search ULPIN `AP-VSKP-000123`.
2. Inspect the 17-tab Parcel Drawer (Ownership, RoR, Registration, Encumbrance, Tax, Disputes).
3. View the **Explainable AI Land Risk Score** (18/100 LOW RISK with factor breakdown).
4. Click **Request Verification** as Citizen.
5. Switch role to **Revenue Officer (Tahsildar)** and click **Verify Ownership Record**.
6. Observe real-time status change to `VERIFIED` and inspect the immutable Audit Log.

### Scenario 2: Master Plan Road Corridor Impact
1. Click **Scenario 2** on the top bar.
2. Observe the GIS Explorer automatically toggling the **Master Plan Road Expansion Layer**.
3. Parcels intersecting proposed road corridors are highlighted in purple, displaying expansion distances (12.5m impact).

### Scenario 3: AI Data Anomaly Resolution
1. Click **Scenario 3** on the top bar.
2. Review the **Data Quality & Anomaly Dashboard** flagging Area Mismatches between RoR Adangal records (2.5 acres) and spatial geometry (2.48 acres).
3. Create an automated officer task to initiate physical field survey verification.

---

## 📄 Documentation Directory

Detailed technical documents are available in `/docs/`:
- [`architecture.md`](file:///c:/Users/prudh/Documents/antigravity/peaceful-darwin/docs/architecture.md) — System Vision, Core Subsystems & Diagram
- [`database-schema.md`](file:///c:/Users/prudh/Documents/antigravity/peaceful-darwin/docs/database-schema.md) — Database Tables & PostGIS Geometry Model
- [`api-spec.md`](file:///c:/Users/prudh/Documents/antigravity/peaceful-darwin/docs/api-spec.md) — OpenAPI REST Endpoints Specification
- [`gis-architecture.md`](file:///c:/Users/prudh/Documents/antigravity/peaceful-darwin/docs/gis-architecture.md) — 3-Layer GIS Vector Map Architecture
- [`security.md`](file:///c:/Users/prudh/Documents/antigravity/peaceful-darwin/docs/security.md) — JWT Auth, RBAC Matrix & Audit Logs
