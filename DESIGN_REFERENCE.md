# Stocky Design Reference & Feature Analysis

## Overview
Stocky is a production-ready POS + Inventory & HRM system. This document outlines the key features, workflows, and UI patterns that should be replicated in our system.

## Core Features

### 1. Dashboard
- **Key Metrics Display:**
  - Total Sales (Today/This Week/This Month)
  - Total Revenue
  - Inventory Value
  - Low Stock Alerts
  - Recent Transactions
  - Top Selling Products
  - Pending Orders

- **Layout:**
  - Sidebar navigation with collapsible menu
  - Top navigation bar with user profile and notifications
  - Main content area with responsive grid layout
  - Charts and graphs for analytics

### 2. Inventory Management
- **Product Management:**
  - Add/Edit/Delete Products
  - Product Categories and Subcategories
  - Product Variants (size, color, etc.)
  - SKU/Barcode Management
  - Product Images
  - Bulk Import/Export (CSV, Excel, PDF)

- **Stock Tracking:**
  - Real-time stock levels
  - Stock adjustments (add/remove/correct)
  - Low stock alerts and thresholds
  - Stock history and audit trail
  - Warehouse/location tracking

- **Supplier Management:**
  - Supplier profiles
  - Supplier contact information
  - Supplier pricing
  - Supplier performance metrics

### 3. Point of Sale (POS)
- **POS Interface:**
  - Product search and quick add to cart
  - Barcode scanner support
  - Shopping cart with item quantities
  - Discount application (percentage/fixed)
  - Tax calculation
  - Payment methods (cash, card, mobile money)
  - Receipt printing and email

- **Transaction Management:**
  - Save and recall transactions
  - Void/Cancel transactions
  - Refund processing
  - Transaction history

### 4. Purchase Management
- **Purchase Orders:**
  - Create purchase orders from suppliers
  - Track order status (draft, sent, received, cancelled)
  - Receive goods and update inventory
  - Purchase order history

- **Goods Receiving:**
  - Receive partial or full orders
  - Verify received quantities
  - Update inventory automatically
  - Record external costs (transport, tax)

- **Purchase Returns:**
  - Create return notes
  - Track returned items
  - Update inventory
  - Generate credit notes

### 5. Debtor/Customer Management
- **Customer Profiles:**
  - Customer information and contact details
  - Credit limit and credit status
  - Payment history
  - Outstanding balance

- **Credit Management:**
  - Sell on credit
  - Track outstanding balances
  - Payment tracking (partial/full)
  - Overdue alerts

- **Payment Tracking:**
  - Record payments
  - Generate payment receipts
  - Payment history and statements

### 6. Reporting & Analytics
- **Reports:**
  - Sales reports (daily, weekly, monthly)
  - Inventory reports
  - Debtor reports
  - Supplier performance
  - Product performance
  - Revenue analysis

- **Export Options:**
  - PDF export
  - Excel export
  - CSV export

### 7. User Management & Access Control
- **Roles:**
  - Admin (full access)
  - Manager (inventory, sales, reports)
  - Staff (POS, basic inventory)
  - Viewer (read-only)

- **Permissions:**
  - Role-based access control
  - Feature-level permissions
  - Data-level permissions (tenant isolation)

## UI/UX Patterns

### Navigation
- **Sidebar Navigation:**
  - Collapsible menu with icons
  - Active state highlighting
  - Breadcrumb trail
  - Quick access shortcuts

- **Top Navigation:**
  - Logo/Brand
  - Search bar
  - Notifications
  - User profile dropdown
  - Logout option

### Tables & Lists
- **Features:**
  - Sortable columns
  - Filterable data
  - Pagination
  - Bulk actions (select multiple)
  - Row actions (edit, delete, view)
  - Search functionality
  - Column visibility toggle

### Forms
- **Design:**
  - Clear labels
  - Input validation with error messages
  - Required field indicators
  - Helper text for complex fields
  - Submit and Cancel buttons
  - Form sections/tabs for complex forms

### Modals & Dialogs
- **Usage:**
  - Confirmation dialogs for destructive actions
  - Form modals for creating/editing items
  - Alert modals for notifications
  - Loading states

### Cards & Panels
- **Styling:**
  - White background with subtle shadow
  - Rounded corners
  - Padding for content spacing
  - Icon + text combinations
  - Hover effects

## Design System

### Color Palette
- **Primary:** Professional blue (for actions, links)
- **Secondary:** Neutral gray (for backgrounds, text)
- **Success:** Green (for positive actions)
- **Warning:** Orange (for alerts, low stock)
- **Danger:** Red (for errors, deletions)
- **Background:** Light gray or white
- **Text:** Dark gray or black

### Typography
- **Headings:** Bold, sans-serif
- **Body:** Regular, sans-serif
- **Labels:** Medium weight, sans-serif

### Spacing
- **Consistent padding and margins**
- **Grid-based layout (8px or 16px units)**
- **Generous whitespace for readability**

### Icons
- **Consistent icon set (Material Icons or similar)**
- **Icons with labels for clarity**
- **Color-coded icons for status**

## Workflow Examples

### POS Sale Workflow
1. Staff opens POS interface
2. Search or scan products
3. Add items to cart
4. Apply discounts if applicable
5. Select payment method
6. Process payment
7. Generate receipt
8. Inventory updated automatically

### Purchase Order Workflow
1. Create purchase order from supplier
2. Add line items with quantities
3. Send to supplier
4. Track order status
5. Receive goods
6. Verify quantities
7. Update inventory
8. Record payment

### Debtor Payment Workflow
1. Sell items on credit
2. Track outstanding balance
3. Send payment reminders
4. Record partial/full payment
5. Update balance
6. Generate payment receipt

## Key Considerations

- **Multi-tenant:** Each business operates independently with complete data isolation
- **Offline-first:** System works offline with sync when connection is restored
- **Mobile-friendly:** Responsive design for tablets and mobile devices
- **Barcode Support:** Built-in barcode scanning for POS and inventory
- **Reporting:** Comprehensive analytics and export capabilities
- **Security:** JWT authentication, role-based access control, data encryption
- **Performance:** Fast load times, optimized queries, caching strategies
