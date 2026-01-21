'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Order,
  Invoice,
  Customer,
  Product,
  BlockchainTransaction,
  SupportTicket,
  User,
  AuditLogEntry,
  Notification,
} from '@/types';
import { initializeMockData } from '@/data/mockData';
import { generateId, generateHash } from '@/lib/utils';

interface AppState {
  users: User[];
  products: Product[];
  customers: Customer[];
  orders: Order[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  blockchainTransactions: BlockchainTransaction[];
  auditLogs: AuditLogEntry[];
  notifications: Notification[];
  isLoading: boolean;
}

interface AppContextType extends AppState {
  // Aliases for backward compatibility
  supportTickets: SupportTicket[];
  
  // Order actions
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'blockchainHash' | 'blockchainVerified'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Invoice actions
  generateInvoice: (orderId: string) => Invoice | null;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  
  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => Customer;
  updateCustomerStatus: (customerId: string, status: Customer['status']) => void;
  
  // Ticket actions
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => SupportTicket;
  createSupportTicket: (data: { customerId: string; customerName: string; subject: string; description: string; priority: SupportTicket['priority'] }) => SupportTicket;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  
  // Product actions
  updateProductStock: (productId: string, quantity: number) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Blockchain actions
  verifyRecord: (recordId: string) => BlockchainTransaction | undefined;
  
  // Utility
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    users: [],
    products: [],
    customers: [],
    orders: [],
    invoices: [],
    tickets: [],
    blockchainTransactions: [],
    auditLogs: [],
    notifications: [],
    isLoading: true,
  });

  useEffect(() => {
    // Initialize mock data
    const data = initializeMockData();
    setState({
      ...data,
      notifications: [
        {
          id: 'NOT001',
          type: 'info',
          title: 'Welcome to BlockChain ERP',
          message: 'Your enterprise dashboard is ready.',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'NOT002',
          type: 'warning',
          title: 'Low Stock Alert',
          message: '3 products are below reorder point.',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
    });
  }, []);

  const addBlockchainTransaction = (
    recordType: BlockchainTransaction['recordType'],
    recordId: string,
    data: Record<string, unknown>
  ): string => {
    const hash = generateHash();
    const previousHash = state.blockchainTransactions[0]?.hash || 
      '0x0000000000000000000000000000000000000000000000000000000000000000';
    
    const transaction: BlockchainTransaction = {
      id: `BLK${generateId()}`,
      hash,
      recordType,
      recordId,
      timestamp: new Date().toISOString(),
      previousHash,
      verified: true,
      data,
    };

    setState((prev: AppState) => ({
      ...prev,
      blockchainTransactions: [transaction, ...prev.blockchainTransactions],
    }));

    return hash;
  };

  const addAuditLog = (action: string, entityType: string, entityId: string, userId: string, userName: string) => {
    const hash = generateHash();
    const log: AuditLogEntry = {
      id: `AUD${generateId()}`,
      action,
      entityType,
      entityId,
      userId,
      user: userName,
      userName,
      timestamp: new Date().toISOString(),
      details: `${action} - ${entityType} ${entityId}`,
      blockchainHash: hash,
      blockchainTxHash: hash,
    };

    setState((prev: AppState) => ({
      ...prev,
      auditLogs: [log, ...prev.auditLogs],
    }));
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'blockchainHash' | 'blockchainVerified'>): Order => {
    const orderId = `ORD${generateId()}`;
    const now = new Date().toISOString();
    
    const hash = addBlockchainTransaction('order', orderId, {
      customerId: orderData.customerId,
      totalAmount: orderData.totalAmount,
      status: orderData.status,
    });

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: now,
      updatedAt: now,
      blockchainHash: hash,
      blockchainVerified: true,
    };

    setState((prev: AppState) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
    }));

    addAuditLog('Created order', 'Order', orderId, 'USR001', 'System');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setState((prev: AppState) => ({
      ...prev,
      orders: prev.orders.map((order: Order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ),
    }));

    addBlockchainTransaction('order', orderId, { status, action: 'status_update' });
    addAuditLog('Updated order status', 'Order', orderId, 'USR001', 'System');
  };

  const generateInvoice = (orderId: string): Invoice | null => {
    const order = state.orders.find((o: Order) => o.id === orderId);
    if (!order) return null;

    const existingInvoice = state.invoices.find((i: Invoice) => i.orderId === orderId);
    if (existingInvoice) return existingInvoice;

    const invoiceId = `INV${generateId()}`;
    const now = new Date().toISOString();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const hash = addBlockchainTransaction('invoice', invoiceId, {
      orderId,
      amount: order.totalAmount,
      customerId: order.customerId,
    });

    const newInvoice: Invoice = {
      id: invoiceId,
      orderId,
      customerId: order.customerId,
      customerName: order.customerName,
      amount: order.totalAmount,
      status: 'sent',
      dueDate: dueDate.toISOString(),
      createdAt: now,
      blockchainHash: hash,
      blockchainVerified: true,
    };

    setState((prev: AppState) => ({
      ...prev,
      invoices: [newInvoice, ...prev.invoices],
    }));

    addAuditLog('Generated invoice', 'Invoice', invoiceId, 'USR001', 'System');

    return newInvoice;
  };

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    setState((prev: AppState) => ({
      ...prev,
      invoices: prev.invoices.map((invoice: Invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              status,
              paidAt: status === 'paid' ? new Date().toISOString() : invoice.paidAt,
            }
          : invoice
      ),
    }));

    addBlockchainTransaction('invoice', invoiceId, { status, action: 'status_update' });
    addAuditLog('Updated invoice status', 'Invoice', invoiceId, 'USR001', 'System');
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>): Customer => {
    const customerId = `CUS${generateId()}`;
    const now = new Date().toISOString();

    const newCustomer: Customer = {
      ...customerData,
      id: customerId,
      createdAt: now,
      totalOrders: 0,
      totalSpent: 0,
    };

    setState((prev: AppState) => ({
      ...prev,
      customers: [newCustomer, ...prev.customers],
    }));

    addAuditLog('Added customer', 'Customer', customerId, 'USR001', 'System');

    return newCustomer;
  };

  const updateCustomerStatus = (customerId: string, status: Customer['status']) => {
    setState((prev: AppState) => ({
      ...prev,
      customers: prev.customers.map((customer: Customer) =>
        customer.id === customerId ? { ...customer, status } : customer
      ),
    }));

    addAuditLog('Updated customer status', 'Customer', customerId, 'USR001', 'System');
  };

  const createTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): SupportTicket => {
    const ticketId = `TKT${generateId()}`;
    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const newTicket: SupportTicket = {
      ...ticketData,
      id: ticketId,
      ticketNumber,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev: AppState) => ({
      ...prev,
      tickets: [newTicket, ...prev.tickets],
    }));

    addAuditLog('Created support ticket', 'Ticket', ticketId, 'USR001', 'System');

    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setState((prev: AppState) => ({
      ...prev,
      tickets: prev.tickets.map((ticket: SupportTicket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status,
              updatedAt: new Date().toISOString(),
              resolvedAt: status === 'resolved' || status === 'closed' ? new Date().toISOString() : ticket.resolvedAt,
            }
          : ticket
      ),
    }));

    addAuditLog('Updated ticket status', 'Ticket', ticketId, 'USR001', 'System');
  };

  const updateProductStock = (productId: string, quantity: number) => {
    setState((prev: AppState) => ({
      ...prev,
      products: prev.products.map((product: Product) =>
        product.id === productId
          ? { ...product, stockLevel: product.stockLevel + quantity, lastRestocked: new Date().toISOString() }
          : product
      ),
    }));

    addBlockchainTransaction('inventory', productId, { quantity, action: 'stock_update' });
    addAuditLog('Updated product stock', 'Product', productId, 'USR001', 'System');
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `NOT${generateId()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setState((prev: AppState) => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications],
    }));
  };

  const markNotificationRead = (notificationId: string) => {
    setState((prev: AppState) => ({
      ...prev,
      notifications: prev.notifications.map((n: Notification) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  };

  const clearNotifications = () => {
    setState((prev: AppState) => ({
      ...prev,
      notifications: [],
    }));
  };

  const verifyRecord = (recordId: string): BlockchainTransaction | undefined => {
    return state.blockchainTransactions.find((t: BlockchainTransaction) => t.recordId === recordId);
  };

  const refreshData = () => {
    const data = initializeMockData();
    setState((prev: AppState) => ({
      ...prev,
      ...data,
    }));
  };

  // Alias for support page
  const createSupportTicket = (data: { customerId: string; customerName: string; subject: string; description: string; priority: SupportTicket['priority'] }): SupportTicket => {
    return createTicket({
      ...data,
      status: 'open',
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        supportTickets: state.tickets,
        createOrder,
        updateOrderStatus,
        generateInvoice,
        updateInvoiceStatus,
        addCustomer,
        updateCustomerStatus,
        createTicket,
        createSupportTicket,
        updateTicketStatus,
        updateProductStock,
        addNotification,
        markNotificationRead,
        clearNotifications,
        verifyRecord,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
