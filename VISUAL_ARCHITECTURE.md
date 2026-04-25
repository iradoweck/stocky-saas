# Visual Architecture: Stocky SaaS

This artifact provides a diagrammatic view of the structure and data flow of Stocky SaaS.

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph Frontend [Client - React/Vite]
        UI[Material UI Components]
        Store[Redux Toolkit State]
        Offline[IndexedDB / Dexie]
        API_Client[Axios API Client]
    end

    subgraph Backend [Server - Express/Node]
        Router[Express Router]
        Middleware[Auth & Tenant Isolation]
        Services[Business Logic Services]
        FIFO[FIFO Costing Engine]
        Sync[Sync Engine]
        DB_Adapter[Mongoose ODM]
    end

    subgraph Infrastructure
        MongoDB[(MongoDB Atlas)]
        Stripe[Stripe API]
        Smtp[SMTP Server]
    end

    %% Data Flows
    UI --> Store
    Store --> Offline
    Store --> API_Client
    API_Client --> Router
    Router --> Middleware
    Middleware --> Services
    Services --> FIFO
    Services --> Sync
    Services --> DB_Adapter
    DB_Adapter --> MongoDB
    Services --> Stripe
    Services --> Smtp
```

---

## 2. Entity-Relationship Diagram (Simplified)

```mermaid
erDiagram
    TENANT ||--o{ USER : contains
    TENANT ||--o{ PRODUCT : owns
    TENANT ||--o{ CUSTOMER : has
    TENANT ||--o{ SUPPLIER : manages

    PRODUCT }|--|| CATEGORY : belongs_to
    PRODUCT ||--o{ BATCH : tracks_inventory

    BATCH ||--o{ STOCK_MOVEMENT : records
    USER ||--o{ STOCK_MOVEMENT : performs

    SUPPLIER ||--o{ PURCHASE_ORDER : supplies
    PURCHASE_ORDER ||--o{ BATCH : creates

    CUSTOMER ||--o{ SALES_TRANSACTION : buys
    SALES_TRANSACTION ||--o{ BATCH : consumes_from

    CUSTOMER ||--o{ DEBTOR : becomes
    DEBTOR ||--o{ PAYMENT : makes
```

---

## 3. Offline Synchronization Flow

```mermaid
sequenceDiagram
    participant User
    participant LocalDB as IndexedDB (Dexie)
    participant Queue as Sync Queue
    participant Server as Express API
    participant DB as MongoDB

    User->>LocalDB: Performs Operation (e.g., Sale)
    LocalDB-->>User: Local Success (Immediate)
    LocalDB->>Queue: Enqueues Operation (Status: Pending)
    
    Note over Queue, Server: When internet is restored
    
    Queue->>Server: Push Pending Operations
    Server->>DB: Validates and Persists
    DB-->>Server: OK
    Server-->>Queue: Confirm Sync
    Queue->>LocalDB: Updates Status to 'Synced'
```

---

## 4. Key Server Components

| Component | Responsibility |
| :--- | :--- |
| `tenantIsolation.js` | Ensures each request is filtered by the authenticated user's `tenantId`. |
| `fifoCosting.js` | Algorithm that decides which batch to withdraw the product from to maximize fiscal accuracy. |
| `stockMovement.js` | Single entry point for any physical product quantity change. |
| `schemas.js` | Single source of truth for all system data. |
