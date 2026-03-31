import mongoose from 'mongoose';
import {
  TenantSchema,
  UserSchema,
  CategorySchema,
  SupplierSchema,
  ProductSchema,
  BatchSchema,
  StockMovementSchema,
  PurchaseOrderSchema,
  GoodsReceivedSchema,
  PurchaseReturnSchema,
  SalesTransactionSchema,
  SalesReturnSchema,
  DebtorSchema,
  PaymentSchema,
  PaymentReminderSchema,
  SyncQueueSchema,
  CustomerSchema,
} from './schemas.js';

export const Tenant = mongoose.model('Tenant', TenantSchema);
export const User = mongoose.model('User', UserSchema);
export const Category = mongoose.model('Category', CategorySchema);
export const Supplier = mongoose.model('Supplier', SupplierSchema);
export const Product = mongoose.model('Product', ProductSchema);
export const Batch = mongoose.model('Batch', BatchSchema);
export const StockMovement = mongoose.model('StockMovement', StockMovementSchema);
export const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
export const GoodsReceived = mongoose.model('GoodsReceived', GoodsReceivedSchema);
export const PurchaseReturn = mongoose.model('PurchaseReturn', PurchaseReturnSchema);
export const SalesTransaction = mongoose.model('SalesTransaction', SalesTransactionSchema);
export const SalesReturn = mongoose.model('SalesReturn', SalesReturnSchema);
export const Debtor = mongoose.model('Debtor', DebtorSchema);
export const Payment = mongoose.model('Payment', PaymentSchema);
export const PaymentReminder = mongoose.model('PaymentReminder', PaymentReminderSchema);
export const SyncQueue = mongoose.model('SyncQueue', SyncQueueSchema);
export const Customer = mongoose.model('Customer', CustomerSchema);
