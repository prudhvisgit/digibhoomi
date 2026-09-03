# BhoomiSetu Security & RBAC Architecture

## 1. Security Overview
BhoomiSetu adheres to Enterprise Digital Public Infrastructure security standards, protecting sensitive citizen land ownership data while providing open interoperability.

---

## 2. Authentication & Session Security
- **JSON Web Tokens (JWT)** signed with strong HMAC SHA-256 secret.
- **Passowrd Protection**: bcrypt password hashing with salt rounds = 12.
- **Session Expiry**: Short-lived access tokens (2 hours) with secure refresh mechanisms.
- **API Protection**: Helmet security headers, CORS policy enforcement, rate limiting (100 requests / minute / IP).

---

## 3. Role-Based Access Control (RBAC) Matrix

| Role | Parcel View | RoR Modify | Reg Update | Permit Approval | Tax Manage | Audit View | Config Manage |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **SUPER_ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **STATE_ADMIN** | ✅ | 👁️ | 👁️ | 👁️ | 👁️ | ✅ | 👁️ |
| **DISTRICT_ADMIN** | ✅ | 👁️ | 👁️ | 👁️ | 👁️ | ✅ | ❌ |
| **REVENUE_OFFICER** | ✅ | ✅ | 👁️ | ❌ | ❌ | 👁️ | ❌ |
| **REGISTRATION_OFFICER**| ✅ | 👁️ | ✅ | ❌ | ❌ | 👁️ | ❌ |
| **MUNICIPAL_OFFICER** | ✅ | 👁️ | 👁️ | ✅ | ❌ | 👁️ | ❌ |
| **PLANNING_OFFICER** | ✅ | 👁️ | 👁️ | ✅ | ❌ | 👁️ | ❌ |
| **TAX_OFFICER** | ✅ | 👁️ | 👁️ | ❌ | ✅ | 👁️ | ❌ |
| **UTILITY_OFFICER** | ✅ | 👁️ | 👁️ | ❌ | ❌ | 👁️ | ❌ |
| **ENVIRONMENT_OFFICER**| ✅ | 👁️ | 👁️ | ❌ | ❌ | 👁️ | ❌ |
| **CITIZEN** | ✅ | 👁️ Public | 👁️ Public | ❌ Submit Req | 👁️ Public | ❌ | ❌ |

*(Legend: ✅ Full Permission | 👁️ Read Only | ❌ No Access)*

---

## 4. Immutable System Audit Trail
Every write, status mutation, verification, or sensitive record read operation triggers an asynchronous audit logger that writes to the `audit_logs` table with:
- `user_id` & `user_role`
- `action` (e.g. `OWNERSHIP_VERIFIED`, `BUILDING_PERMIT_APPROVED`)
- `entity` & `entity_id` (e.g. `ulpin:AP-VSKP-000123`)
- `ip_address` & `timestamp`
- `before_value` & `after_value` (JSON differential)
