# BhoomiSetu Database Schema & Data Models

## 1. Overview
BhoomiSetu utilizes a relational database model (PostgreSQL with PostGIS extension for spatial queries).
Every land-related domain dataset is indexed to the primary entity **`parcels`** via **`ulpin`** (Unique Land Parcel Identification Number) or `parcel_id`.

---

## 2. Table Definitions

### 2.1 Identity & Access Control

```sql
-- Users
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- SUPER_ADMIN, REVENUE_OFFICER, REGISTRATION_OFFICER, CITIZEN etc.
    department VARCHAR(100),
    district VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Trail
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id),
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    before_value JSONB,
    after_value JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Administrative Hierarchy

```sql
CREATE TABLE states (
    code VARCHAR(10) PRIMARY KEY, -- e.g., 'AP'
    name VARCHAR(100) NOT NULL
);

CREATE TABLE districts (
    id VARCHAR(36) PRIMARY KEY,
    state_code VARCHAR(10) REFERENCES states(code),
    name VARCHAR(100) NOT NULL
);

CREATE TABLE mandals (
    id VARCHAR(36) PRIMARY KEY,
    district_id VARCHAR(36) REFERENCES districts(id),
    name VARCHAR(100) NOT NULL
);

CREATE TABLE villages (
    id VARCHAR(36) PRIMARY KEY,
    mandal_id VARCHAR(36) REFERENCES mandals(id),
    name VARCHAR(100) NOT NULL,
    pincode VARCHAR(10)
);
```

### 2.3 Core Land Parcel Entity

```sql
CREATE TABLE parcels (
    id VARCHAR(36) PRIMARY KEY,
    ulpin VARCHAR(50) UNIQUE NOT NULL, -- e.g. AP-VSKP-000123
    survey_number VARCHAR(50) NOT NULL,
    state_code VARCHAR(10) REFERENCES states(code),
    district_name VARCHAR(100) NOT NULL,
    mandal_name VARCHAR(100) NOT NULL,
    village_name VARCHAR(100) NOT NULL,
    area_acres NUMERIC(10, 4) NOT NULL,
    area_sq_meters NUMERIC(12, 2) NOT NULL,
    land_use VARCHAR(50) NOT NULL, -- Residential, Commercial, Agricultural, Industrial, Special Zone
    status VARCHAR(50) DEFAULT 'ACTIVE', -- VERIFIED, PENDING_VERIFICATION, DISPUTED
    geometry JSONB NOT NULL, -- GeoJSON Polygon or PostGIS Geometry
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Governance Modules (RoR, Ownership, Registration, Encumbrance)

```sql
CREATE TABLE owners (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Individual, Joint, Corporate, Government
    aadhaar_masked VARCHAR(20),
    contact VARCHAR(50)
);

CREATE TABLE ownership_records (
    id VARCHAR(36) PRIMARY KEY,
    parcel_id VARCHAR(36) REFERENCES parcels(id),
    ulpin VARCHAR(50) REFERENCES parcels(ulpin),
    owner_id VARCHAR(36) REFERENCES owners(id),
    owner_name VARCHAR(255) NOT NULL,
    share_percentage NUMERIC(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'VERIFIED',
    source_document VARCHAR(255)
);

CREATE TABLE ror_records (
    id VARCHAR(36) PRIMARY KEY,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin),
    khata_number VARCHAR(50) NOT NULL,
    survey_number VARCHAR(50) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    classification VARCHAR(50) NOT NULL, -- Dry Land, Wet Land, Poramboke
    extent_acres NUMERIC(10, 4) NOT NULL,
    mutation_status VARCHAR(50) DEFAULT 'COMPLETED',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registration_records (
    id VARCHAR(36) PRIMARY KEY,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin),
    transaction_type VARCHAR(50) NOT NULL, -- Sale Deed, Mortgage, Gift Deed, Partition
    registration_date DATE NOT NULL,
    seller_name VARCHAR(255) NOT NULL,
    buyer_name VARCHAR(255) NOT NULL,
    consideration_value_inr NUMERIC(15, 2) NOT NULL,
    sub_registrar_office VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED'
);

CREATE TABLE encumbrances (
    id VARCHAR(36) PRIMARY KEY,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin),
    type VARCHAR(50) NOT NULL, -- Mortgage, Lien, Court Attachment, Govt Restriction
    institution VARCHAR(255) NOT NULL, -- e.g. State Bank of India
    amount_inr NUMERIC(15, 2),
    start_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE' -- ACTIVE, RELEASED
);
```

### 2.5 Planning, Building & Taxation

```sql
CREATE TABLE zoning_master_plans (
    id VARCHAR(36) PRIMARY KEY,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin),
    current_zoning VARCHAR(100) NOT NULL,
    proposed_zoning VARCHAR(100),
    far_limit NUMERIC(4, 2) NOT NULL, -- Floor Area Ratio e.g. 2.5
    max_height_meters NUMERIC(5, 2) NOT NULL,
    road_expansion_affected BOOLEAN DEFAULT FALSE,
    expansion_distance_m NUMERIC(6, 2) DEFAULT 0
);

CREATE TABLE building_permissions (
    id VARCHAR(36) PRIMARY KEY,
    application_id VARCHAR(100) UNIQUE NOT NULL,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin),
    applicant_name VARCHAR(255) NOT NULL,
    building_type VARCHAR(100) NOT NULL,
    applied_floors INT NOT NULL,
    approved_area_sqft NUMERIC(10, 2),
    status VARCHAR(50) NOT NULL, -- SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
    permit_number VARCHAR(100)
);

CREATE TABLE property_taxes (
    id VARCHAR(36) PRIMARY KEY,
    property_id VARCHAR(100) UNIQUE NOT NULL,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin),
    annual_tax_inr NUMERIC(10, 2) NOT NULL,
    outstanding_inr NUMERIC(10, 2) DEFAULT 0,
    tax_status VARCHAR(50) NOT NULL -- PAID, PENDING, OVERDUE
);
```

### 2.6 AI Risk & Anomaly Tables

```sql
CREATE TABLE ai_risk_scores (
    id VARCHAR(36) PRIMARY KEY,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin),
    risk_score INT NOT NULL, -- 0 to 100
    risk_category VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH
    factors JSONB NOT NULL, -- breakdown of positive and negative drivers
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE data_anomalies (
    id VARCHAR(36) PRIMARY KEY,
    ulpin VARCHAR(50) REFERENCES parcels(ulpin),
    anomaly_type VARCHAR(100) NOT NULL, -- AREA_MISMATCH, DUPLICATE_OWNER, TRANSACTION_SPIKE
    severity VARCHAR(20) NOT NULL, -- CRITICAL, WARNING, INFO
    details JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN'
);
```
