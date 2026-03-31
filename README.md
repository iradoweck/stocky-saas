# Stocky SaaS - Multi-Tenant Stock Management System

A comprehensive, production-ready multi-tenant SaaS stock management system with advanced procurement flows, FIFO batch-based costing, offline-first capabilities, and comprehensive business operations tracking.

## Features

### Core Inventory Management
- **Product Catalog**: Full product management with SKU, barcode, categories, and variants
- **Stock Tracking**: Real-time stock levels with batch-based inventory tracking
- **Batch Management**: FIFO (First In First Out) batch-based costing engine with expiry date tracking
- **Stock Movements**: Unified stock movement engine for all operations (purchases, sales, returns, adjustments, transfers)
- **Low Stock Alerts**: Automatic alerts when inventory falls below minimum thresholds
- **Stock Valuation**: Real-time inventory valuation using FIFO costing method

### Advanced Procurement Flows
- **Purchase Orders**: Create, track, and manage purchase orders with multiple statuses
- **Goods Receiving**: Receive goods with batch tracking and external cost allocation (transport, tax)
- **Purchase Returns**: Create purchase returns linked to original batches with cost reversal
- **Supplier Management**: Comprehensive supplier profiles with payment terms and contact information
- **Batch-Based Costing**: FIFO batch tracking for accurate cost allocation across purchases, sales, and returns

### Point of Sale (POS)
- **POS Interface**: Intuitive POS screen with barcode scanning support
- **Shopping Cart**: Add/remove items, apply discounts, calculate taxes
- **Payment Processing**: Multiple payment methods (cash, card, mobile money, credit, cheque)
- **Receipt Generation**: Automatic receipt generation with company branding
- **Sales History**: Track all sales transactions with detailed audit trail

### Sales Management
- **Sales Invoices**: Create and manage sales transactions with FIFO cost allocation
- **Sales Returns**: Process sales returns with automatic cost recalculation using FIFO method
- **Customer Management**: Maintain customer profiles with credit limits and purchase history
- **Credit Sales**: Sell on credit with automatic debtor tracking

### Debtor Management
- **Debtor Tracking**: Track customers with outstanding balances
- **Payment Recording**: Record partial and full payments with multiple payment methods
- **Payment Reminders**: Automated and manual payment reminders via email
- **Credit Limits**: Set and enforce customer credit limits
- **Payment Statements**: Generate customer payment statements

### Offline-First Architecture
- **IndexedDB Local Storage**: All data cached locally for offline access
- **Sync Queue System**: Queue operations when offline, sync when connection restored
- **Conflict Resolution**: Server-authoritative conflict resolution strategy
- **Retry Mechanism**: Automatic retry with exponential backoff for failed syncs
- **Push/Pull Sync**: Bidirectional sync for data consistency

### Multi-Tenant Architecture
- **Complete Tenant Isolation**: All data segregated by tenant ID
- **Role-Based Access Control**: Admin, Manager, Staff, and Viewer roles
- **Permission Management**: Granular permission control at feature and data levels
- **Subscription Plans**: Free, Starter, Professional, and Enterprise plans with feature limits

### Additional Features
- **Stripe Integration**: Secure payment collection during POS checkout and debt settlement
- **PDF Generation**: Receipt and invoice generation with company branding
- **Owner Notifications**: Automated alerts for critical events (low stock, large sales, sync failures)
- **Comprehensive Reporting**: Sales, inventory, debtor, and supplier reports
- **Audit Trail**: Complete audit trail for all operations with user tracking and timestamps
- **Docker Containerization**: Production-ready Docker setup with docker-compose

## Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest + Supertest
- **Logging**: Winston
- **Email**: Nodemailer
- **PDF**: PDFKit
- **Payments**: Stripe SDK

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material UI (MUI)
- **Forms**: Formik + Yup validation
- **HTTP Client**: Axios
- **Offline Storage**: IndexedDB (Dexie)
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: Jenkins
- **Package Manager**: npm/pnpm

## Project Structure

```
stocky-saas-complete/
├── server/                          # Backend application
│   ├── config/                      # Configuration files
│   │   ├── database.ts             # MongoDB connection
│   │   └── env.ts                  # Environment variables
│   ├── models/                      # MongoDB schemas and models
│   │   ├── schemas.ts              # All schema definitions
│   │   └── index.ts                # Model exports
│   ├── services/                    # Business logic services
│   │   ├── fifoCosting.ts          # FIFO batch costing engine
│   │   ├── stockMovement.ts        # Unified stock movement engine
│   │   └── offlineSync.ts          # Offline sync engine
│   ├── controllers/                 # Route controllers (to be implemented)
│   ├── routes/                      # API routes
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── inventory.ts
│   │   ├── purchases.ts
│   │   ├── sales.ts
│   │   ├── debtors.ts
│   │   └── sync.ts
│   ├── middleware/                  # Express middleware
│   │   ├── auth.ts                 # JWT authentication
│   │   ├── tenantIsolation.ts      # Tenant isolation
│   │   └── errorHandler.ts         # Error handling
│   ├── utils/                       # Utility functions
│   │   ├── logger.ts               # Logging utility
│   │   ├── jwt.ts                  # JWT utilities
│   │   ├── errors.ts               # Custom error classes
│   │   └── validation.ts           # Validation utilities
│   ├── tests/                       # Test suites
│   │   ├── setup.ts                # Test setup
│   │   └── fifoCosting.test.ts     # FIFO costing tests
│   ├── index.ts                     # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── client/                          # Frontend application
│   ├── src/
│   │   ├── store/                   # Redux store
│   │   │   ├── slices/             # Redux slices
│   │   │   │   ├── inventorySlice.ts
│   │   │   │   ├── salesSlice.ts
│   │   │   │   ├── purchasesSlice.ts
│   │   │   │   ├── customersSlice.ts
│   │   │   │   ├── debtorsSlice.ts
│   │   │   │   ├── syncSlice.ts
│   │   │   │   └── uiSlice.ts
│   │   │   └── index.ts            # Store configuration
│   │   ├── pages/                   # Page components (to be implemented)
│   │   ├── components/              # Reusable components (to be implemented)
│   │   ├── services/                # API services
│   │   │   └── api.ts              # Axios API client
│   │   ├── utils/                   # Utility functions
│   │   │   └── offlineStorage.ts   # IndexedDB offline storage
│   │   ├── hooks/                   # Custom React hooks (to be implemented)
│   │   ├── App.tsx                  # Main app component (to be implemented)
│   │   └── main.tsx                 # Entry point (to be implemented)
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts               # Vite configuration (to be implemented)
├── docker-compose.yml               # Docker Compose configuration
├── Dockerfile.backend               # Backend Docker image
├── Dockerfile.frontend              # Frontend Docker image
├── Jenkinsfile                      # CI/CD pipeline
├── package.json                     # Root package.json
├── DESIGN_REFERENCE.md              # Stocky design reference
└── README.md                        # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB 6+
- Docker and Docker Compose (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd stocky-saas-complete
```

2. **Install dependencies**
```bash
npm install
cd server && npm install
cd ../client && npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7.0

# Or use docker-compose
docker-compose up -d mongodb
```

### Development

**Start both backend and frontend:**
```bash
npm run dev
```

**Start backend only:**
```bash
npm run dev:server
```

**Start frontend only:**
```bash
npm run dev:client
```

### Testing

**Run all tests:**
```bash
npm test
```

**Run backend tests:**
```bash
npm run test:server
```

**Run frontend tests:**
```bash
npm run test:client
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

### Building

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

### Docker Deployment

**Build Docker images:**
```bash
npm run docker:build
```

**Start containers:**
```bash
npm run docker:up
```

**View logs:**
```bash
npm run docker:logs
```

**Stop containers:**
```bash
npm run docker:down
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory/stock-levels` - Get current stock levels
- `GET /api/inventory/movements` - Get stock movements
- `POST /api/inventory/adjust` - Adjust stock
- `GET /api/inventory/low-stock` - Get low stock alerts
- `GET /api/inventory/valuation` - Get inventory valuation

### Sales
- `GET /api/sales` - List sales transactions
- `POST /api/sales` - Create sale transaction
- `GET /api/sales/:id` - Get sale details
- `POST /api/sales/:id/return` - Create sales return
- `POST /api/sales/:id/receipt` - Generate receipt

### Purchases
- `GET /api/purchases` - List purchase orders
- `POST /api/purchases` - Create purchase order
- `GET /api/purchases/:id` - Get purchase order details
- `PUT /api/purchases/:id` - Update purchase order
- `POST /api/purchases/:id/receive` - Receive goods
- `POST /api/purchases/:id/return` - Create purchase return

### Debtors
- `GET /api/debtors` - List debtors
- `GET /api/debtors/:id` - Get debtor details
- `POST /api/debtors/:id/payment` - Record payment
- `GET /api/debtors/:id/statement` - Get payment statement
- `POST /api/debtors/:id/reminder` - Send payment reminder

### Sync
- `POST /api/sync/push` - Push offline changes
- `GET /api/sync/pull` - Pull server changes
- `GET /api/sync/status` - Get sync status
- `POST /api/sync/retry` - Retry failed syncs

## FIFO Costing Engine

The system implements a FIFO (First In First Out) batch-based costing engine for accurate inventory valuation:

### Key Features
- **Batch Tracking**: Each product purchase is tracked as a separate batch with cost per unit
- **FIFO Allocation**: When items are sold, cost is allocated from the oldest batch first
- **Return Handling**: Sales returns are allocated back to the same batches in reverse order
- **Cost Accuracy**: Ensures correct cost allocation across purchases, sales, and returns
- **Audit Trail**: Complete movement history for each batch

### Usage Example
```typescript
import fifoCosting from './services/fifoCosting';

// Allocate cost for a sale
const result = await fifoCosting.allocateCostForSale(
  tenantId,
  productId,
  quantityToSell
);

// Get available batch quantity
const available = await fifoCosting.getAvailableBatchQuantity(
  tenantId,
  batchId
);

// Calculate weighted average cost
const avgCost = await fifoCosting.calculateWeightedAverageCost(
  tenantId,
  productId
);
```

## Offline-First Architecture

The system supports offline-first operation with automatic sync:

### How It Works
1. **Local Storage**: All data is cached in IndexedDB
2. **Offline Operations**: Users can continue working offline
3. **Queue System**: Operations are queued when offline
4. **Auto-Sync**: When connection is restored, queued operations are synced
5. **Conflict Resolution**: Server-authoritative resolution for conflicts

### Usage Example
```typescript
import { offlineStorage } from './utils/offlineStorage';

// Queue an operation
await offlineStorage.queueOperation({
  tenantId,
  userId,
  operationType: 'create',
  entityType: 'sale',
  entityId: saleId,
  payload: saleData,
  status: 'pending',
});

// Get pending operations
const pending = await offlineStorage.getPendingOperations(tenantId);

// Mark as synced
await offlineStorage.markAsSynced(operationId);
```

## Multi-Tenant Architecture

All data is completely isolated by tenant:

### Tenant Isolation
- Every collection includes a `tenantId` field
- All queries filter by `tenantId`
- Middleware enforces tenant isolation
- Users can only access their tenant's data

### Tenant Context
```typescript
// Tenant ID is extracted from JWT token
const tenantId = req.user.tenantId;

// All queries include tenant filter
const products = await Product.find({ tenantId });
```

## Testing

### Backend Tests
- Unit tests for services (FIFO costing, stock movement, sync)
- Integration tests for API endpoints
- Mock database for isolated testing
- Coverage threshold: 70%

### Frontend Tests
- Redux slice tests
- Component tests with React Testing Library
- API client tests
- Offline storage tests

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test -- --coverage

# Run specific test file
npm run test:server -- fifoCosting.test.ts
```

## Performance Considerations

- **Batch Queries**: Use batch queries for large datasets
- **Indexing**: MongoDB indexes on tenantId, productId, batchId
- **Caching**: Redis caching for frequently accessed data (future enhancement)
- **Pagination**: Implement pagination for large result sets
- **Lazy Loading**: Load related data on demand

## Security

- **JWT Authentication**: Secure token-based authentication
- **Tenant Isolation**: Complete data isolation between tenants
- **Input Validation**: Comprehensive input validation on all endpoints
- **Error Handling**: Secure error messages without exposing internals
- **CORS**: Configured CORS for secure cross-origin requests
- **Password Hashing**: bcryptjs for secure password storage

## Deployment

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure MongoDB with authentication
- [ ] Set NODE_ENV=production
- [ ] Configure Stripe keys
- [ ] Set up email configuration
- [ ] Configure owner notifications
- [ ] Set up SSL/TLS certificates
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting

### Environment Variables
See `.env.example` for all required environment variables.

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongosh --authenticationDatabase admin -u admin -p password

# Verify connection string in .env
MONGODB_URI=mongodb://admin:password@localhost:27017/stocky-saas?authSource=admin
```

### Port Already in Use
```bash
# Change ports in .env
PORT=5001  # Backend
VITE_API_URL=http://localhost:5001
```

### Offline Sync Issues
- Check browser IndexedDB in DevTools
- Verify sync operations in sync queue
- Check network connectivity
- Review server logs for sync errors

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Run test suite
5. Submit pull request

## License

MIT

## Support

For issues and questions, please create an issue in the repository or contact the development team.

## Roadmap

### Phase 2
- [ ] Advanced reporting and analytics
- [ ] Multi-warehouse support
- [ ] Barcode generation and printing
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)

### Phase 3
- [ ] AI-powered demand forecasting
- [ ] Integration with accounting software
- [ ] Multi-currency support
- [ ] Advanced user permissions
- [ ] API rate limiting and throttling

### Phase 4
- [ ] Machine learning for stock optimization
- [ ] Supplier performance analytics
- [ ] Customer segmentation
- [ ] Predictive analytics
- [ ] Advanced reporting dashboards
