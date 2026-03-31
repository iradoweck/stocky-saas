import mongoose, { Schema } from 'mongoose';

// ============================================================================
// TENANT & USER SCHEMAS
// ============================================================================

const TenantSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    logo: { type: String },
    website: { type: String },
    industry: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    subscriptionPlan: { type: String, enum: ['free', 'starter', 'professional', 'enterprise'], default: 'free' },
    subscriptionStatus: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
    subscriptionEndDate: { type: Date },
    maxUsers: { type: Number, default: 5 },
    maxProducts: { type: Number, default: 100 },
    features: [{ type: String }],
  },
  { timestamps: true }
);

const UserSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'staff', 'viewer'], default: 'staff' },
    permissions: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// ============================================================================
// INVENTORY SCHEMAS
// ============================================================================

const CategorySchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    name: { type: String, required: true },
    description: { type: String },
    parentCategoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    image: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const SupplierSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    contactPerson: { type: String, required: true },
    paymentTerms: { type: String },
    taxId: { type: String },
    bankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      swiftCode: { type: String },
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const ProductSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    sku: { type: String, required: true },
    barcode: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    unit: { type: String, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    minStockLevel: { type: Number, default: 10 },
    maxStockLevel: { type: Number, default: 100 },
    reorderQuantity: { type: Number, default: 50 },
    image: { type: String },
    variants: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    status: { type: String, enum: ['active', 'inactive', 'discontinued'], default: 'active' },
  },
  { timestamps: true }
);

const BatchSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    batchNumber: { type: String, required: true },
    quantity: { type: Number, required: true },
    costPerUnit: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    expiryDate: { type: Date },
    manufacturingDate: { type: Date },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
    status: { type: String, enum: ['active', 'expired', 'depleted'], default: 'active' },
  },
  { timestamps: true }
);

const StockMovementSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    batchId: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    movementType: { type: String, enum: ['IN', 'OUT', 'ADJUST', 'RETURN', 'TRANSFER'], required: true },
    quantity: { type: Number, required: true },
    costPerUnit: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    referenceType: { type: String, enum: ['purchase', 'sale', 'adjustment', 'return', 'transfer'], required: true },
    referenceId: { type: Schema.Types.ObjectId, required: true },
    notes: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// ============================================================================
// PURCHASE SCHEMAS
// ============================================================================

const PurchaseOrderSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    poNumber: { type: String, required: true, unique: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    status: { type: String, enum: ['draft', 'sent', 'confirmed', 'partial', 'received', 'cancelled'], default: 'draft' },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        costPerUnit: { type: Number },
        totalCost: { type: Number },
        receivedQuantity: { type: Number },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    otherCosts: { type: Number, default: 0 },
    total: { type: Number, required: true },
    expectedDeliveryDate: { type: Date, required: true },
    actualDeliveryDate: { type: Date },
    notes: { type: String },
    attachments: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const GoodsReceivedSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    grNumber: { type: String, required: true, unique: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        batchNumber: { type: String },
        quantity: { type: Number },
        costPerUnit: { type: Number },
        expiryDate: { type: Date },
      },
    ],
    externalCosts: {
      transport: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    totalCost: { type: Number, required: true },
    status: { type: String, enum: ['received', 'verified', 'rejected'], default: 'received' },
    receivedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const PurchaseReturnSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    returnNumber: { type: String, required: true, unique: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: [
      {
        batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        costPerUnit: { type: Number },
        reason: { type: String },
      },
    ],
    totalRefund: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'sent', 'received', 'credited'], default: 'draft' },
    creditNoteId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

// ============================================================================
// SALES SCHEMAS
// ============================================================================

const SalesTransactionSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
        quantity: { type: Number },
        sellingPrice: { type: Number },
        costPrice: { type: Number },
        totalPrice: { type: Number },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'mobile_money', 'credit', 'cheque'], required: true },
    paymentStatus: { type: String, enum: ['paid', 'partial', 'pending', 'failed'], default: 'pending' },
    amountPaid: { type: Number, default: 0 },
    amountDue: { type: Number, default: 0 },
    status: { type: String, enum: ['completed', 'voided', 'refunded'], default: 'completed' },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const SalesReturnSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    returnNumber: { type: String, required: true, unique: true },
    salesTransactionId: { type: Schema.Types.ObjectId, ref: 'SalesTransaction', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    items: [
      {
        batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number },
        sellingPrice: { type: Number },
        costPrice: { type: Number },
        reason: { type: String },
      },
    ],
    totalRefund: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'processed', 'credited'], default: 'draft' },
    creditNoteId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

// ============================================================================
// DEBTOR & PAYMENT SCHEMAS
// ============================================================================

const DebtorSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    totalCredit: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    outstandingBalance: { type: Number, default: 0 },
    creditLimit: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'suspended', 'cleared'], default: 'active' },
    lastPaymentDate: { type: Date },
    nextReminderDate: { type: Date },
  },
  { timestamps: true }
);

const PaymentSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    debtorId: { type: Schema.Types.ObjectId, ref: 'Debtor', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'mobile_money', 'cheque', 'bank_transfer'], required: true },
    paymentDate: { type: Date, required: true },
    referenceNumber: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  },
  { timestamps: true }
);

const PaymentReminderSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    debtorId: { type: Schema.Types.ObjectId, ref: 'Debtor', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    outstandingBalance: { type: Number, required: true },
    reminderType: { type: String, enum: ['email', 'sms', 'manual'], required: true },
    status: { type: String, enum: ['sent', 'pending', 'failed'], default: 'pending' },
    sentDate: { type: Date },
    nextReminderDate: { type: Date },
  },
  { timestamps: true }
);

// ============================================================================
// OFFLINE SYNC SCHEMAS
// ============================================================================

const SyncQueueSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    operationType: { type: String, enum: ['create', 'update', 'delete'], required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['pending', 'synced', 'failed'], default: 'pending' },
    retryCount: { type: Number, default: 0 },
    lastError: { type: String },
  },
  { timestamps: true }
);

// ============================================================================
// CUSTOMER SCHEMAS
// ============================================================================

const CustomerSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    taxId: { type: String },
    type: { type: String, enum: ['retail', 'wholesale', 'corporate'], default: 'retail' },
    creditLimit: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive', 'blacklisted'], default: 'active' },
  },
  { timestamps: true }
);

// Add indexes for better query performance
TenantSchema.index({ slug: 1 });
UserSchema.index({ tenantId: 1, email: 1 });
CategorySchema.index({ tenantId: 1 });
SupplierSchema.index({ tenantId: 1 });
ProductSchema.index({ tenantId: 1, sku: 1, barcode: 1 });
BatchSchema.index({ tenantId: 1, productId: 1, batchNumber: 1 });
StockMovementSchema.index({ tenantId: 1, productId: 1, createdAt: -1 });
PurchaseOrderSchema.index({ tenantId: 1, poNumber: 1 });
SalesTransactionSchema.index({ tenantId: 1, invoiceNumber: 1 });
DebtorSchema.index({ tenantId: 1, customerId: 1 });
PaymentSchema.index({ tenantId: 1, debtorId: 1 });
SyncQueueSchema.index({ tenantId: 1, status: 1 });
CustomerSchema.index({ tenantId: 1, email: 1 });

export {
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
};
