# DigiBhoomi Architecture Specification

## 1. System Vision & Overview
**DigiBhoomi** ("One Parcel. One Identity. Connected Governance.") is an integrated GIS-based Digital Public Infrastructure (DPI) for Land Governance designed for Smart India Hackathon 2026 (SIH26014).

The fundamental architectural principle of DigiBhoomi is **Parcel-Centric & Data-Isolated Land Governance**:

```text
EVERY PARCEL (ULPIN) ↔ LINKED DATASETS ↔ WORKFLOWS ↔ CITIZEN SERVICES ↔ AI ANALYTICS

AND

EVERY USER ↔ SPECIFIC ROLE ↔ SPECIFIC DEPARTMENT ↔ SPECIFIC JURISDICTION ↔ AUTHORIZED DATA
```

---

## 2. High-Level Architecture & Data Isolation Model

```
                                    DIGIBHOOMI
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
             GOVERNMENT USERS                            CITIZEN USERS
        (role_id + department_id +                  (user_id → person_id)
          jurisdiction_boundary)                              │
                    │                                PERSON DATA ISOLATION
       JURISDICTION DATA ISOLATION                   (My Properties, My Tax,
      (State / District / Mandal / SRO)               My Requests, My Documents)
                    │                                         │
                    └────────────────────┬────────────────────┘
                                         │
                            BACKEND AUTHORIZATION ENGINE
                          (Enforces HTTP 403 Forbidden Checks)
                                         │
                               CANONICAL PARCEL (ULPIN)
                                         │
           ┌────────────┬────────────────┼────────────────┬────────────┐
           ↓            ↓                ↓                ↓            ↓
       Person 1     Person 2         Person 3         Person 4     Co-Owners
       (Parcels     (Parcels         (Parcel          (Parcels     (Shared 50%
       001, 007)   002, 009, 012)     003)            004, 011)    Ownership)
```

---

## 3. Administrative & Geographical Hierarchy
DigiBhoomi models India's administrative structure:
`India → State (Andhra Pradesh) → District (Visakhapatnam, Vijayawada, Guntur, Tirupati, Kurnool, Nellore) → Mandal / Taluk → Village → Parcel (ULPIN)`

### Configurable State Engine (`state_config.json`)
Supports state-level data models and terminology mapping for:
- **Andhra Pradesh** (Visakhapatnam - detailed GIS demo area)
- **Tamil Nadu** (Chennai)
- **Karnataka** (Bengaluru)
- **Telangana** (Hyderabad)
- **Maharashtra** (Pune)

---

## 4. Mandatory Data Isolation Rules
1. **Person-Specific Citizen Isolation**: Every Citizen account maps to a unique `Person` entity. Citizen 1 (Arjun Rao) sees ONLY his properties (`AP-VSKP-000001`, `AP-VSKP-000007`), his requests, and his documents. Citizen 2 (Sravani Devi) sees ONLY her properties (`AP-VSKP-000002`, `AP-VSKP-000009`, `AP-VSKP-000012`). Zero overlap exists unless shared co-ownership is recorded.
2. **Department & Jurisdiction Isolation**:
   - **Revenue Officers**: Access ONLY Revenue & RoR Adangal records within their assigned Mandal jurisdiction.
   - **Registration Officers**: Access ONLY Deed Registrations & Encumbrance Certificates (EC) within their SRO.
   - **Planning Officers**: Access ONLY Land Use, Zoning, Master Plan, and Planning Applications.
   - **Municipal Officers**: Access ONLY Building Permissions, Property Tax, and Infrastructure in their Municipality.
3. **Backend Authorization Enforcement**: Frontend filtering alone is not security. All backend APIs (`/api/me/properties`, `/api/parcels/:id`, `/api/service-requests`) evaluate JWT role, department, jurisdiction, and person ownership, returning `HTTP 403 Forbidden` if unauthorized.
