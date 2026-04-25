# Technical Study: Stocky SaaS

This document presents a detailed analysis of the architecture, technologies, and features of the **Stocky SaaS** system, a multi-tenant stock management system with offline-first capabilities.

## 1. System Overview

Stocky SaaS is a comprehensive platform for inventory management, sales (POS), purchases, and debtor management. It was designed to operate as a SaaS (Software as a Service) model, allowing multiple companies (tenants) to use the same infrastructure with total data isolation.

### Core Pillars:
- **Multi-tenancy:** Strict data isolation by `tenantId`.
- **Offline-first:** Uses IndexedDB (Dexie) on the frontend to allow operation without internet and subsequent synchronization.
- **FIFO Costing Engine:** Batch-based costing calculation (First In First Out), ensuring financial accuracy.
- **Modern Architecture:** Based on Node.js (Backend) and React (Frontend).

---

## 2. Technology Stack

### Backend (`/server` folder)
- **Runtime:** Node.js (ES Modules).
- **Web Framework:** Express.js.
- **Database:** MongoDB with Mongoose ODM.
- **Authentication:** JWT (JSON Web Tokens) with BcryptJS for password hashing.
- **Logging:** Winston for event and error monitoring.
- **PDF Documentation:** PDFKit for invoice and receipt generation.
- **Payments:** Integrated Stripe SDK.

### Frontend (`/client` folder)
- **Framework:** React 18 with Vite.
- **Language:** JavaScript (with structure prepared for TypeScript as per README).
- **State Management:** Redux Toolkit.
- **UI Library:** Material UI (MUI) v5.
- **Local Persistence:** Dexie.js (Wrapper for IndexedDB).
- **Form Validation:** Formik + Yup.
- **HTTP Client:** Axios.

---

## 3. Data Architecture (Models)

The system uses a centralized schema in `server/models/schemas.js`. The main entities are:

- **Tenant:** Defines the company, subscription plan, and limits.
- **User:** Users linked to a Tenant with roles (`admin`, `manager`, `staff`, `viewer`).
- **Inventory:**
    - `Product`: Product registration with SKU, barcode, and variants.
    - `Batch`: Batch control with expiry date and specific cost.
    - `StockMovement`: Record of all stock entries and exits.
- **Purchases:** `PurchaseOrder`, `GoodsReceived`, and `PurchaseReturn`.
- **Sales:** `SalesTransaction` and `SalesReturn`.
- **Financial:** `Debtor` and `Payment` (debt payments).
- **Sync:** `SyncQueue` to manage pending sync operations.

---

## 4. Logic Engines (Services)

The "heart" of the system resides in the `server/services/` folder:

### A. FIFO Costing Engine (`fifoCosting.js`)
Implements the "First In, First Out" logic.
- When selling, the system searches for the oldest batches (`sort({ createdAt: 1 })`) to calculate the cost of goods sold (COGS).
- Supports returns, recalculating the cost proportional to the original batch.

### B. Stock Movement Engine (`stockMovement.js`)
Centralizes all stock movements.
- Ensures atomic integrity between the creation of a sale/purchase and the update of stock levels.
- Movement types: `IN`, `OUT`, `ADJUST`, `RETURN`, `TRANSFER`.

### C. Offline Sync Engine (`offlineSync.js`)
Manages data bidirectionality.
- **Push:** Sends local changes to the server.
- **Pull:** Updates the local database with global tenant changes.
- Conflict resolution based on server authority.

---

## 5. Main Workflows

1. **POS Sale:**
   - The salesperson scans products.
   - The system allocates costs using the FIFO engine.
   - Generates a `SalesTransaction`.
   - If offline, queues it in the IndexedDB `SyncQueue`.

2. **Goods Receiving:**
   - Creation of a `Batch` associated with a `PurchaseOrder`.
   - Recording of external costs (freight, taxes) that compose the batch unit cost.

3. **Debt Management:**
   - Sales marked with `paymentMethod: 'credit'` create or update records in `Debtor`.
   - Subsequent payments reduce the `outstandingBalance`.

---

## 6. Key Highlights and Quality
- **Security:** Tenant isolation middleware ensures that a user never accesses data from another company, even if they try to manipulate IDs in the URL.
- **Scalability:** Extensive use of MongoDB indexes (Slug, TenantId, SKU).
- **Resilience:** Centralized error handling and detailed logs for debugging complex processes like the FIFO engine.
