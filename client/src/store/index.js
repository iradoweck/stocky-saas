import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './slices/inventorySlice.js';
import salesReducer from './slices/salesSlice.js';
import purchasesReducer from './slices/purchasesSlice.js';
import customersReducer from './slices/customersSlice.js';
import debtorsReducer from './slices/debtorsSlice.js';
import syncReducer from './slices/syncSlice.js';
import uiReducer from './slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    sales: salesReducer,
    purchases: purchasesReducer,
    customers: customersReducer,
    debtors: debtorsReducer,
    sync: syncReducer,
    ui: uiReducer,
  },
});
