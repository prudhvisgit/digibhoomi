# BhoomiSetu API Specification

## 1. OpenAPI REST Standard
All APIs follow REST standards, return standard JSON payloads, use HTTP status codes, and enforce JWT bearer authentication.

### Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-09-02T21:47:00.000Z"
}
```

---

## 2. API Endpoints Reference

### 2.1 Authentication & RBAC (`/api/auth`)
- `POST /api/auth/login` - Authenticate user, return JWT token & user profile with role.
- `POST /api/auth/logout` - Invalidate session token.
- `GET /api/auth/me` - Retrieve authenticated user profile & permissions.

### 2.2 Parcels & GIS (`/api/parcels`)
- `GET /api/parcels` - List/filter parcels (supports `bbox`, `ulpin`, `village`, `district`, `landUse`).
- `GET /api/parcels/:ulpin` - Fetch complete canonical parcel profile by ULPIN.
- `GET /api/parcels/spatial/query` - Perform PostGIS spatial intersection query (e.g. parcels inside road expansion zone or flood zone).
- `GET /api/parcels/geojson` - Retrieve full GeoJSON FeatureCollection for GIS map layer rendering.

### 2.3 Domain Modules (`/api/parcels/:ulpin/...`)
- `GET /api/parcels/:ulpin/ownership` - Ownership details & share breakdown.
- `POST /api/parcels/:ulpin/ownership/verify` - Verify ownership status (REVENUE_OFFICER only).
- `GET /api/parcels/:ulpin/ror` - Record of Rights (Khata details, mutation status).
- `GET /api/parcels/:ulpin/registration` - Deed registration history & mortgage releases.
- `GET /api/parcels/:ulpin/encumbrance` - Encumbrance status (active mortgages, court claims).
- `GET /api/parcels/:ulpin/zoning` - Master plan zoning, FAR limits, setback rules, road expansion impact.
- `GET /api/parcels/:ulpin/building-permissions` - Building permits & workflow status.
- `GET /api/parcels/:ulpin/tax` - Property tax records & simulated payment execution.
- `GET /api/parcels/:ulpin/utilities` - Linked utility connections (electricity, water, sewerage).
- `GET /api/parcels/:ulpin/environment` - Environmental restrictions & flood zone overlay status.
- `GET /api/parcels/:ulpin/disputes` - Active court litigations & court case status.
- `GET /api/parcels/:ulpin/timeline` - Unified multi-system chronological event history.
- `GET /api/parcels/:ulpin/documents` - Linked digital land documents (RoR PDF, Sale Deed).

### 2.4 Citizen Services & Governance Workflows (`/api/services`)
- `POST /api/services/requests` - Submit citizen service request (Mutation, Record Correction, Permit Check).
- `GET /api/services/requests` - Search & track service requests by REQ-ID.
- `POST /api/services/requests/:reqId/transition` - Transition workflow status (Officer authorization).

### 2.5 AI & Intelligence Engine (`/api/ai`)
- `GET /api/ai/risk-score/:ulpin` - Calculate and explain Land Risk Score (0-100).
- `GET /api/ai/anomalies` - Retrieve detected data anomalies (Area Mismatch, Duplicate Records).
- `GET /api/ai/change-detection/:ulpin` - Retrieve simulated satellite change detection overlay analysis.
- `GET /api/ai/delay-prediction` - Predict application resolution delays.

### 2.6 Departmental Interoperability (`/api/integrations`)
- `GET /api/integrations/status` - Live health status of mock departmental APIs (RoR, Reg, Tax, Plan).
- `GET /api/integrations/logs` - Integration transaction logs & latency metrics.
- `GET /api/analytics/kpis` - Executive dashboard metrics (Total Parcels, Verified, Disputed, Tax Collected).
- `GET /api/audit/logs` - System audit log records.
