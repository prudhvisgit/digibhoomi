# DigiBhoomi Data Isolation & Security Architecture

## 1. Core Principle
In DigiBhoomi, **data is never blindly mixed together**. Every entity enforces relational ownership and authorization boundaries:

```text
USER → ROLE → DEPARTMENT → JURISDICTION → AUTHORIZED DATA SCOPE
```

and for Citizens:

```text
USER → PERSON → PARCEL_OWNERSHIP → PARCELS → LINKED RECORDS
```

---

## 2. Citizen Person Data Isolation Matrix

| Logged-In Citizen | Person Entity | Owned Parcels (ULPIN) | Applications / Requests | Tax Records | Documents |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Citizen 1** | Person A (`Arjun Rao`) | `AP-VSKP-000001`, `AP-VSKP-000007` | `REQ-2026-0001` | `PTAX-VSKP-8001`, `PTAX-VSKP-8007` | `DOC-001`, `DOC-007` |
| **Citizen 2** | Person B (`Sravani Devi`) | `AP-VSKP-000002`, `AP-VSKP-000009`, `AP-VSKP-000012` | `REQ-2026-0002` | `PTAX-VSKP-8002`, `PTAX-VSKP-8009` | `DOC-002`, `DOC-009` |
| **Citizen 3** | Person C (`Kiran Kumar`) | `AP-VSKP-000003` | `REQ-2026-0003` | `PTAX-VSKP-8003` | `DOC-003` |
| **Citizen 4** | Person D (`Vijay Sharma`) | `AP-VSKP-000004`, `AP-VSKP-000011` | `REQ-2026-0004` | `PTAX-VSKP-8004` | `DOC-004` |
| **Citizen 5** | Person E (`Anitha Reddy`) | `AP-VSKP-000005`, `AP-VSKP-000015` | `REQ-2026-0005` | `PTAX-VSKP-8005` | `DOC-005` |

### Zero Overlap Guarantee
When `Citizen 1 (Arjun Rao)` logs in:
- `GET /api/me/properties` returns ONLY `AP-VSKP-000001` and `AP-VSKP-000007`.
- `GET /api/me/requests` returns ONLY `REQ-2026-0001`.
- If `Citizen 1` attempts `GET /api/parcels/AP-VSKP-000002` (owned by Sravani Devi), the backend authorization middleware intercepts the request and responds with **`HTTP 403 Forbidden`**.

---

## 3. Government Officer Jurisdiction Scope Matrix

| Government Role | Assigned Department | Jurisdiction Scope | Authorized Operations |
| :--- | :--- | :--- | :--- |
| **Super Admin** | DPI Governance | Statewide (All AP) | System config, user/role management, audit logs, API gateway. |
| **State Admin** | Revenue & DPI | Statewide (All AP) | State performance analytics, district comparison metrics. |
| **Revenue Officer** | Revenue & Land Records | Visakhapatnam / Mandal A | Pattadar verification, RoR Adangal 1B, land mutation approvals. |
| **Registration Officer**| Registration & Stamps | Visakhapatnam SRO-1 | Deed registrations, CARD transactions, Encumbrance Certificates. |
| **Planning Officer** | Urban Planning (VMRDA) | Visakhapatnam Urban | Land use zoning, master plan road expansion corridors, permits. |
| **Municipal Officer** | Municipality | Visakhapatnam Municipal | Building sanctions, property tax collection, municipal infrastructure. |
| **Tax Officer** | Revenue & Tax | Visakhapatnam Municipal | Property tax assessments, tax payment reconciliations. |

---

## 4. Backend Authorization Middleware Code Pattern

```typescript
// backend/src/middleware/rbac.ts
export const authorizeParcelAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { ulpin } = req.params;
  const user = req.user;

  if (user.role === 'SUPER_ADMIN' || user.role === 'STATE_ADMIN') {
    return next(); // Admins have global access
  }

  if (user.role === 'CITIZEN') {
    const isOwner = checkPersonOwnership(user.personId, ulpin);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: `HTTP 403 Forbidden: You do not own parcel ${ulpin} and are not authorized to view its private records.`
      });
    }
  }

  if (user.jurisdiction) {
    const isWithinScope = checkJurisdiction(user.jurisdiction, ulpin);
    if (!isWithinScope) {
      return res.status(403).json({
        success: false,
        message: `HTTP 403 Forbidden: Parcel ${ulpin} is outside your assigned jurisdiction scope.`
      });
    }
  }

  next();
};
```
