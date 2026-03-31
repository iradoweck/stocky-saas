# JavaScript ES6 Conversion Guide

## Overview

This project has been fully converted from TypeScript to JavaScript ES6 (ECMAScript 2021). All functionality, architecture, and features remain identical to the TypeScript version.

## Key Changes

### 1. File Extensions
- All `.ts` files have been converted to `.js`
- All `.tsx` files have been converted to `.jsx` (when applicable)
- TypeScript configuration files removed

### 2. Import/Export Syntax
JavaScript ES6 uses the same import/export syntax as TypeScript:

```javascript
// Before (TypeScript)
import { User } from './models/index.ts';
export interface UserData { ... }

// After (JavaScript ES6)
import { User } from './models/index.js';
export const UserData = { ... };
```

### 3. Type Annotations Removed
All TypeScript type annotations have been removed:

```javascript
// Before (TypeScript)
async function allocateCostForSale(
  tenantId: string,
  productId: string,
  quantityToSell: number
): Promise<AllocationResult> { ... }

// After (JavaScript ES6)
async function allocateCostForSale(tenantId, productId, quantityToSell) { ... }
```

### 4. Class Syntax
Classes remain the same, but without type annotations:

```javascript
// Before (TypeScript)
class FIFOCostingEngine {
  async allocateCostForSale(tenantId: string, productId: string, quantity: number): Promise<any> {
    ...
  }
}

// After (JavaScript ES6)
class FIFOCostingEngine {
  async allocateCostForSale(tenantId, productId, quantity) {
    ...
  }
}
```

### 5. Configuration Files

#### Backend
- `server/tsconfig.json` → Removed
- `server/jest.config.js` → Updated for JavaScript
- `server/package.json` → Updated with JavaScript dependencies

#### Frontend
- `client/tsconfig.json` → Removed
- `client/vite.config.js` → Created for Vite configuration
- `client/package.json` → Updated with JavaScript dependencies

### 6. Module System
The project uses ES6 modules (`type: "module"` in package.json):

```javascript
// Import
import express from 'express';
import { Logger } from './utils/logger.js';

// Export
export const apiClient = new APIClient();
export default new FIFOCostingEngine();
```

## Project Structure

```
stocky-saas-complete/
├── server/                          # Backend (JavaScript ES6)
│   ├── config/
│   │   ├── database.js             # Database configuration
│   │   └── env.js                  # Environment variables
│   ├── models/
│   │   ├── schemas.js              # MongoDB schemas
│   │   └── index.js                # Model exports
│   ├── services/
│   │   ├── fifoCosting.js          # FIFO costing engine
│   │   ├── stockMovement.js        # Stock movement engine
│   │   └── offlineSync.js          # Offline sync engine
│   ├── middleware/
│   │   ├── auth.js                 # Authentication
│   │   ├── tenantIsolation.js      # Tenant isolation
│   │   └── errorHandler.js         # Error handling
│   ├── routes/                      # API routes
│   ├── utils/                       # Utilities
│   ├── tests/                       # Test files
│   ├── index.js                     # Server entry point
│   ├── package.json
│   └── jest.config.js
├── client/                          # Frontend (JavaScript ES6)
│   ├── src/
│   │   ├── store/
│   │   │   ├── slices/             # Redux slices (7 slices)
│   │   │   └── index.js            # Store configuration
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   ├── utils/
│   │   │   └── offlineStorage.js   # IndexedDB storage
│   │   ├── pages/                  # Page components
│   │   ├── components/             # Reusable components
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── package.json                     # Root package.json
├── .eslintrc.json                   # ESLint configuration
├── .prettierrc.json                 # Prettier configuration
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+ (supports ES modules natively)
- npm or pnpm
- MongoDB 6+

### Installation

1. **Install dependencies**
```bash
npm install
cd server && npm install
cd ../client && npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB**
```bash
docker run -d -p 27017:27017 mongo:7.0
```

### Development

**Start backend:**
```bash
cd server && npm run dev
```

**Start frontend:**
```bash
cd client && npm run dev
```

**Start both:**
```bash
npm run dev
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

**Watch mode:**
```bash
npm run test:watch
```

### Linting & Formatting

**Lint code:**
```bash
npm run lint
```

**Format code:**
```bash
npm run format
```

## Backend Services

### FIFO Costing Engine (`server/services/fifoCosting.js`)
Implements First-In-First-Out batch-based costing:

```javascript
import fifoCosting from './services/fifoCosting.js';

// Allocate cost for a sale
const result = await fifoCosting.allocateCostForSale(tenantId, productId, quantity);

// Get available batch quantity
const available = await fifoCosting.getAvailableBatchQuantity(tenantId, batchId);

// Calculate weighted average cost
const avgCost = await fifoCosting.calculateWeightedAverageCost(tenantId, productId);
```

### Stock Movement Engine (`server/services/stockMovement.js`)
Unified engine for all stock operations:

```javascript
import stockMovement from './services/stockMovement.js';

// Record purchase inbound
await stockMovement.recordPurchaseInbound(
  tenantId, batchId, productId, quantity, costPerUnit, purchaseOrderId, userId
);

// Record sale outbound
await stockMovement.recordSaleOutbound(
  tenantId, batchId, productId, quantity, costPerUnit, saleId, userId
);

// Get audit trail
const trail = await stockMovement.getAuditTrail(tenantId, filters);
```

### Offline Sync Engine (`server/services/offlineSync.js`)
Manages offline sync operations:

```javascript
import offlineSync from './services/offlineSync.js';

// Queue an operation
await offlineSync.queueOperation(operation);

// Get pending operations
const pending = await offlineSync.getPendingOperations(tenantId, userId);

// Get sync statistics
const stats = await offlineSync.getSyncStats(tenantId);
```

## Frontend Redux Store

### Redux Slices
The frontend uses Redux Toolkit with 7 slices:

1. **inventorySlice** - Product inventory state
2. **salesSlice** - Shopping cart and sales state
3. **purchasesSlice** - Purchase orders state
4. **customersSlice** - Customer data state
5. **debtorsSlice** - Debtor tracking state
6. **syncSlice** - Offline sync state
7. **uiSlice** - UI state (sidebar, theme, notifications)

### Usage Example
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from './store/slices/salesSlice.js';

function ShoppingCart() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.sales.cart);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      productId: product.id,
      quantity: 1,
      price: product.sellingPrice,
    }));
  };

  return (
    // Component JSX
  );
}
```

## API Client

The Axios API client handles all backend communication:

```javascript
import { apiClient } from './services/api.js';

// Login
const { token, user } = await apiClient.login(email, password);
apiClient.setToken(token);

// Get products
const products = await apiClient.getProducts(tenantId);

// Create sale
const sale = await apiClient.createSale(tenantId, saleData);

// Record payment
const payment = await apiClient.recordPayment(tenantId, debtorId, paymentData);
```

## Offline Storage

IndexedDB-based offline storage with Dexie:

```javascript
import { offlineStorage } from './utils/offlineStorage.js';

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

// Get sync statistics
const stats = await offlineStorage.getSyncStats(tenantId);
```

## Middleware

### Authentication Middleware
```javascript
import { authMiddleware, requireRole } from './middleware/auth.js';

app.use('/api/protected', authMiddleware, requireRole('admin'), handler);
```

### Tenant Isolation Middleware
```javascript
import { tenantIsolationMiddleware } from './middleware/tenantIsolation.js';

app.use('/api/data', authMiddleware, tenantIsolationMiddleware, handler);
```

### Error Handler Middleware
```javascript
import { errorHandlerMiddleware } from './middleware/errorHandler.js';

app.use(errorHandlerMiddleware);
```

## Logging

Winston-based logging with file and console output:

```javascript
import { Logger } from './utils/logger.js';

const logger = new Logger('ModuleName');

logger.info('Information message', { data: 'value' });
logger.warn('Warning message', { data: 'value' });
logger.error('Error message', { data: 'value' });
logger.debug('Debug message', { data: 'value' });
```

## Error Handling

Custom error classes for consistent error handling:

```javascript
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from './utils/errors.js';

// Throw validation error
throw new ValidationError('Invalid input', { field: 'email' });

// Throw authentication error
throw new AuthenticationError('Invalid credentials');

// Throw authorization error
throw new AuthorizationError('Access denied');

// Throw not found error
throw new NotFoundError('Product', productId);
```

## Environment Variables

See `.env.example` for all required environment variables:

```bash
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/stocky-saas
MONGODB_TEST_URI=mongodb://localhost:27017/stocky-saas-test

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Offline Sync
SYNC_BATCH_SIZE=50
SYNC_RETRY_ATTEMPTS=3
```

## Docker Deployment

**Build images:**
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

## Testing

### Backend Tests
Jest with Supertest for API testing:

```javascript
import request from 'supertest';
import app from '../index.js';

describe('API Tests', () => {
  it('should get products', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .query({ tenantId });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

### Frontend Tests
Vitest with React Testing Library:

```javascript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/index.js';
import ProductList from '../pages/ProductList.jsx';

describe('ProductList Component', () => {
  it('should render products', () => {
    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(screen.getByText(/products/i)).toBeInTheDocument();
  });
});
```

## Performance Tips

1. **Use lazy loading** for routes and components
2. **Implement pagination** for large datasets
3. **Cache frequently accessed data** in Redux
4. **Use IndexedDB** for offline caching
5. **Batch API requests** when possible
6. **Optimize database queries** with proper indexing

## Troubleshooting

### Module not found errors
Ensure all imports include the `.js` extension:
```javascript
// ❌ Wrong
import { Logger } from './utils/logger';

// ✅ Correct
import { Logger } from './utils/logger.js';
```

### ES6 module issues
Make sure `"type": "module"` is set in package.json:
```json
{
  "type": "module"
}
```

### MongoDB connection errors
Verify MongoDB is running and connection string is correct:
```bash
mongosh --authenticationDatabase admin -u admin -p password
```

### Port already in use
Change ports in .env:
```bash
PORT=5001
VITE_API_URL=http://localhost:5001
```

## Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` file
3. Start MongoDB
4. Run development servers: `npm run dev`
5. Access frontend at `http://localhost:3000`
6. API available at `http://localhost:5000`

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review error logs in `./logs` directory
3. Check browser console for frontend errors
4. Review server logs for backend errors

## License

MIT
