import {
  Order,
  Invoice,
  Customer,
  Product,
  BlockchainTransaction,
  SupportTicket,
  User,
  AuditLogEntry,
} from '@/types';
import { generateId, generateHash, getRandomPastDate, randomChoice, randomBetween } from '@/lib/utils';

// Sample company/customer names
const companyNames = [
  'Acme Corporation', 'TechFlow Solutions', 'Global Industries', 'Pinnacle Systems',
  'Nexus Enterprises', 'Vertex Holdings', 'Quantum Dynamics', 'Atlas Manufacturing',
  'Horizon Partners', 'Summit Technologies', 'Omega Retail', 'Prime Logistics',
  'CoreTech Industries', 'BlueSky Ventures', 'MetroWorks Inc', 'Pacific Trading Co',
];

const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda', 'William', 'Ashley'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const productNames = [
  'Enterprise Server Pro', 'Cloud Storage Solution', 'Security Suite X', 'Analytics Platform',
  'Network Router Elite', 'Backup System Pro', 'Database Manager', 'API Gateway',
  'Load Balancer X', 'Monitoring Dashboard', 'Data Sync Tool', 'Integration Hub',
];

const categories = ['Hardware', 'Software', 'Services', 'Subscriptions', 'Accessories'];

// Generate Users
export const mockUsers: User[] = [
  { id: 'USR001', name: 'Alex Thompson', email: 'alex@company.com', role: 'admin', avatar: 'AT' },
  { id: 'USR002', name: 'Sarah Chen', email: 'sarah@company.com', role: 'manager', avatar: 'SC' },
  { id: 'USR003', name: 'Mike Johnson', email: 'mike@company.com', role: 'sales', avatar: 'MJ' },
  { id: 'USR004', name: 'Emily Davis', email: 'emily@company.com', role: 'auditor', avatar: 'ED' },
  { id: 'USR005', name: 'Chris Wilson', email: 'chris@company.com', role: 'support', avatar: 'CW' },
];

// Generate Products
export const generateProducts = (): Product[] => {
  return productNames.map((name, index) => ({
    id: `PRD${String(index + 1).padStart(3, '0')}`,
    name,
    sku: `SKU-${generateId().substring(0, 6)}`,
    category: randomChoice(categories),
    price: randomBetween(99, 9999),
    stockLevel: randomBetween(0, 500),
    reorderPoint: randomBetween(20, 100),
    lastRestocked: getRandomPastDate(1, 60),
  }));
};

// Generate Customers
export const generateCustomers = (count: number = 50): Customer[] => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = randomChoice(firstNames);
    const lastName = randomChoice(lastNames);
    const company = randomChoice(companyNames);
    const totalOrders = randomBetween(0, 25);
    const totalSpent = totalOrders * randomBetween(500, 5000);
    
    return {
      id: `CUS${String(i + 1).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1 (${randomBetween(200, 999)}) ${randomBetween(200, 999)}-${randomBetween(1000, 9999)}`,
      company,
      status: randomChoice(['lead', 'prospect', 'customer', 'customer', 'customer', 'churned']) as Customer['status'],
      totalOrders,
      totalSpent,
      createdAt: getRandomPastDate(30, 365),
      lastOrderAt: totalOrders > 0 ? getRandomPastDate(1, 90) : undefined,
    };
  });
};

// Generate Orders
export const generateOrders = (customers: Customer[], products: Product[], count: number = 100): Order[] => {
  return Array.from({ length: count }, (_, i) => {
    const customer = randomChoice(customers.filter(c => c.status === 'customer'));
    const numItems = randomBetween(1, 5);
    const items = Array.from({ length: numItems }, () => {
      const product = randomChoice(products);
      const quantity = randomBetween(1, 10);
      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        total: quantity * product.price,
      };
    });
    
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const hash = generateHash();
    
    return {
      id: `ORD${String(i + 1).padStart(5, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      items,
      status: randomChoice(['pending', 'processing', 'processing', 'shipped', 'shipped', 'delivered', 'delivered', 'delivered', 'cancelled']) as Order['status'],
      totalAmount,
      createdAt: getRandomPastDate(1, 90),
      updatedAt: getRandomPastDate(0, 7),
      blockchainHash: hash,
      blockchainVerified: Math.random() > 0.05,
    };
  });
};

// Generate Invoices
export const generateInvoices = (orders: Order[]): Invoice[] => {
  return orders.slice(0, Math.floor(orders.length * 0.8)).map((order, i) => {
    const hash = generateHash();
    const status = randomChoice(['draft', 'sent', 'sent', 'paid', 'paid', 'paid', 'overdue']) as Invoice['status'];
    
    return {
      id: `INV${String(i + 1).padStart(5, '0')}`,
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      amount: order.totalAmount,
      status,
      dueDate: getRandomPastDate(-30, 30),
      createdAt: order.createdAt,
      paidAt: status === 'paid' ? getRandomPastDate(0, 14) : undefined,
      blockchainHash: hash,
      blockchainVerified: Math.random() > 0.03,
    };
  });
};

// Generate Support Tickets
export const generateTickets = (customers: Customer[], count: number = 30): SupportTicket[] => {
  const subjects = [
    'Unable to access dashboard', 'Billing inquiry', 'Product delivery delay',
    'Feature request', 'Integration issue', 'Account upgrade', 'Password reset',
    'Technical support needed', 'Refund request', 'Product return',
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const customer = randomChoice(customers);
    const status = randomChoice(['open', 'open', 'in-progress', 'in-progress', 'resolved', 'closed']) as SupportTicket['status'];
    
    return {
      id: `TKT${String(i + 1).padStart(4, '0')}`,
      ticketNumber: `TKT-${String(100000 + i).slice(-6)}`,
      customerId: customer.id,
      customerName: customer.name,
      subject: randomChoice(subjects),
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      status,
      priority: randomChoice(['low', 'medium', 'medium', 'high', 'critical']) as SupportTicket['priority'],
      assignedTo: status !== 'open' ? randomChoice(mockUsers.filter(u => u.role === 'support' || u.role === 'manager')).name : undefined,
      createdAt: getRandomPastDate(0, 30),
      updatedAt: getRandomPastDate(0, 7),
      resolvedAt: status === 'resolved' || status === 'closed' ? getRandomPastDate(0, 3) : undefined,
    };
  });
};

// Generate Blockchain Transactions
export const generateBlockchainTransactions = (
  orders: Order[],
  invoices: Invoice[],
  count: number = 200
): BlockchainTransaction[] => {
  let previousHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
  
  return Array.from({ length: count }, (_, i) => {
    const recordType = randomChoice(['order', 'invoice', 'inventory', 'audit']) as BlockchainTransaction['recordType'];
    let recordId = '';
    let data: Record<string, unknown> = {};
    
    if (recordType === 'order' && orders.length > 0) {
      const order = randomChoice(orders);
      recordId = order.id;
      data = { orderId: order.id, amount: order.totalAmount, status: order.status };
    } else if (recordType === 'invoice' && invoices.length > 0) {
      const invoice = randomChoice(invoices);
      recordId = invoice.id;
      data = { invoiceId: invoice.id, amount: invoice.amount, status: invoice.status };
    } else {
      recordId = `REC${generateId()}`;
      data = { action: 'system_update', details: 'Automated verification' };
    }
    
    const currentHash = generateHash();
    const transaction: BlockchainTransaction = {
      id: `BLK${String(i + 1).padStart(6, '0')}`,
      hash: currentHash,
      recordType,
      recordId,
      timestamp: getRandomPastDate(0, 90),
      previousHash,
      verified: Math.random() > 0.02,
      data,
    };
    
    previousHash = currentHash;
    return transaction;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate Audit Logs
export const generateAuditLogs = (count: number = 100): AuditLogEntry[] => {
  const actions = [
    'Created order', 'Updated order status', 'Generated invoice', 'Processed payment',
    'Updated inventory', 'Added customer', 'Modified user permissions', 'Exported report',
    'Verified blockchain record', 'Resolved support ticket', 'Updated product pricing',
  ];
  
  const entityTypes = ['Order', 'Invoice', 'Customer', 'Product', 'User', 'Ticket', 'Settings'];
  const ipAddresses = ['192.168.1.1', '10.0.0.15', '172.16.0.100', '192.168.0.50', '10.10.10.1'];
  
  return Array.from({ length: count }, (_, i) => {
    const userObj = randomChoice(mockUsers);
    const hash = Math.random() > 0.3 ? generateHash() : undefined;
    return {
      id: `AUD${String(i + 1).padStart(5, '0')}`,
      action: randomChoice(actions),
      entityType: randomChoice(entityTypes),
      entityId: `${randomChoice(['ORD', 'INV', 'CUS', 'PRD', 'USR'])}${randomBetween(1, 999)}`,
      userId: userObj.id,
      user: userObj.name,
      userName: userObj.name,
      timestamp: getRandomPastDate(0, 30),
      details: 'Operation completed successfully',
      ipAddress: randomChoice(ipAddresses),
      changes: Math.random() > 0.5 ? { before: 'old value', after: 'new value' } : undefined,
      blockchainHash: hash,
      blockchainTxHash: hash,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Initialize all mock data
export const initializeMockData = () => {
  const products = generateProducts();
  const customers = generateCustomers(50);
  const orders = generateOrders(customers, products, 100);
  const invoices = generateInvoices(orders);
  const tickets = generateTickets(customers, 30);
  const blockchainTransactions = generateBlockchainTransactions(orders, invoices, 200);
  const auditLogs = generateAuditLogs(100);
  
  return {
    users: mockUsers,
    products,
    customers,
    orders,
    invoices,
    tickets,
    blockchainTransactions,
    auditLogs,
  };
};
