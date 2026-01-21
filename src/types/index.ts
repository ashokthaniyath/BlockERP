// User Roles
export type UserRole = 'admin' | 'manager' | 'sales' | 'auditor' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  blockchainHash?: string;
  blockchainVerified?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Invoice Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  blockchainHash?: string;
  blockchainVerified?: boolean;
}

// Customer Types
export type CustomerStatus = 'lead' | 'prospect' | 'customer' | 'churned';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastOrderAt?: string;
}

// Inventory Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stockLevel: number;
  reorderPoint: number;
  lastRestocked: string;
}

// Blockchain Types
export type BlockchainRecordType = 'order' | 'invoice' | 'inventory' | 'audit';

export interface BlockchainTransaction {
  id: string;
  hash: string;
  recordType: BlockchainRecordType;
  recordId: string;
  timestamp: string;
  previousHash: string;
  verified: boolean;
  data: Record<string, unknown>;
}

// Support Ticket Types
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// Analytics Types
export interface KPIData {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  prefix?: string;
  suffix?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number | boolean;
}

// Audit Types
export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  user: string;
  userName: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
  changes?: Record<string, unknown>;
  blockchainHash?: string;
  blockchainTxHash?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
