import { Order, Invoice, Customer, Product, BlockchainTransaction, KPIData, ChartDataPoint } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

// Calculate KPI metrics
export const calculateKPIs = (
  orders: Order[],
  invoices: Invoice[],
  customers: Customer[]
): KPIData[] => {
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const activeCustomers = customers.filter(c => c.status === 'customer').length;
  const totalLeads = customers.filter(c => c.status === 'lead' || c.status === 'prospect').length;
  
  // Simulate previous period for comparison
  const previousRevenue = totalRevenue * (0.8 + Math.random() * 0.3);
  const previousOrders = Math.floor(totalOrders * (0.8 + Math.random() * 0.3));
  
  return [
    {
      label: 'Total Revenue',
      value: totalRevenue,
      change: Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100 * 10) / 10,
      changeType: totalRevenue >= previousRevenue ? 'increase' : 'decrease',
      prefix: '$',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      change: Math.round(((totalOrders - previousOrders) / previousOrders) * 100 * 10) / 10,
      changeType: totalOrders >= previousOrders ? 'increase' : 'decrease',
    },
    {
      label: 'Active Customers',
      value: activeCustomers,
      change: 12.5,
      changeType: 'increase',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      change: -8.3,
      changeType: 'decrease',
    },
    {
      label: 'Leads Pipeline',
      value: totalLeads,
      change: 23.1,
      changeType: 'increase',
    },
  ];
};

// Revenue over time (last 12 months)
export const getRevenueOverTime = (invoices: Invoice[]): ChartDataPoint[] => {
  const months: ChartDataPoint[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthlyRevenue = invoices
      .filter(inv => {
        if (inv.status !== 'paid' || !inv.paidAt) return false;
        const paidDate = parseISO(inv.paidAt);
        return isWithinInterval(paidDate, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, inv) => sum + inv.amount, 0);
    
    // Add some baseline revenue to make chart look better
    const revenue = monthlyRevenue + (Math.random() * 50000 + 100000);
    
    months.push({
      name: format(date, 'MMM'),
      value: Math.round(revenue),
      revenue: Math.round(revenue),
      orders: Math.floor(revenue / 2000),
    });
  }
  
  return months;
};

// Order status distribution
export const getOrderStatusDistribution = (orders: Order[]): ChartDataPoint[] => {
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const colors: Record<string, string> = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#22c55e',
    cancelled: '#ef4444',
  };
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    fill: colors[status] || '#6b7280',
  }));
};

// Invoice status breakdown
export const getInvoiceStatusBreakdown = (invoices: Invoice[]): ChartDataPoint[] => {
  const statusCounts = invoices.reduce((acc, invoice) => {
    acc[invoice.status] = (acc[invoice.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }));
};

// Inventory levels
export const getInventoryLevels = (products: Product[]): ChartDataPoint[] => {
  return products.map(product => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    value: product.stockLevel,
    stockLevel: product.stockLevel,
    reorderPoint: product.reorderPoint,
    isLowStock: product.stockLevel <= product.reorderPoint,
  }));
};

// Low stock alerts
export const getLowStockAlerts = (products: Product[]): Product[] => {
  return products
    .filter(p => p.stockLevel <= p.reorderPoint)
    .sort((a, b) => a.stockLevel - b.stockLevel);
};

// Orders per month
export const getOrdersPerMonth = (orders: Order[]): ChartDataPoint[] => {
  const months: ChartDataPoint[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthlyOrders = orders.filter(order => {
      const orderDate = parseISO(order.createdAt);
      return isWithinInterval(orderDate, { start: monthStart, end: monthEnd });
    }).length;
    
    // Add baseline
    const orderCount = monthlyOrders + Math.floor(Math.random() * 20 + 15);
    
    months.push({
      name: format(date, 'MMM'),
      value: orderCount,
    });
  }
  
  return months;
};

// Customer funnel
export const getCustomerFunnel = (customers: Customer[]): ChartDataPoint[] => {
  const leads = customers.filter(c => c.status === 'lead').length;
  const prospects = customers.filter(c => c.status === 'prospect').length;
  const activeCustomers = customers.filter(c => c.status === 'customer').length;
  
  // Simulate funnel
  return [
    { name: 'Leads', value: leads + Math.floor(Math.random() * 30 + 50) },
    { name: 'Qualified', value: prospects + Math.floor(Math.random() * 20 + 30) },
    { name: 'Proposals', value: Math.floor((prospects + 20) * 0.6) },
    { name: 'Negotiation', value: Math.floor((prospects + 15) * 0.4) },
    { name: 'Closed Won', value: activeCustomers },
  ];
};

// Customer growth
export const getCustomerGrowth = (customers: Customer[]): ChartDataPoint[] => {
  const months: ChartDataPoint[] = [];
  let cumulative = Math.floor(customers.length * 0.4);
  
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const newCustomers = Math.floor(Math.random() * 8 + 3);
    cumulative += newCustomers;
    
    months.push({
      name: format(date, 'MMM'),
      value: cumulative,
      newCustomers,
      total: cumulative,
    });
  }
  
  return months;
};

// Repeat vs new customers
export const getRepeatVsNewCustomers = (customers: Customer[]): ChartDataPoint[] => {
  const repeatCustomers = customers.filter(c => c.totalOrders > 1).length;
  const newCustomers = customers.filter(c => c.totalOrders <= 1).length;
  
  return [
    { name: 'Repeat Customers', value: repeatCustomers, fill: '#22c55e' },
    { name: 'New Customers', value: newCustomers, fill: '#3b82f6' },
  ];
};

// Blockchain analytics
export const getBlockchainAnalytics = (transactions: BlockchainTransaction[]) => {
  const totalTransactions = transactions.length;
  const verifiedCount = transactions.filter(t => t.verified).length;
  const tamperedCount = totalTransactions - verifiedCount;
  
  const byType = transactions.reduce((acc, t) => {
    acc[t.recordType] = (acc[t.recordType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalTransactions,
    verifiedCount,
    tamperedCount,
    verificationRate: Math.round((verifiedCount / totalTransactions) * 100 * 10) / 10,
    byType: Object.entries(byType).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    })),
  };
};

// Transaction timeline
export const getTransactionTimeline = (transactions: BlockchainTransaction[]): ChartDataPoint[] => {
  const days: ChartDataPoint[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = format(date, 'MMM dd');
    
    const dayCount = Math.floor(Math.random() * 15 + 5);
    
    days.push({
      name: dayStr,
      value: dayCount,
      verified: Math.floor(dayCount * 0.95),
      tampered: Math.ceil(dayCount * 0.05),
    });
  }
  
  return days;
};

// Verify record on blockchain
export const verifyBlockchainRecord = (
  recordId: string,
  transactions: BlockchainTransaction[]
): { found: boolean; transaction?: BlockchainTransaction; verification: string } => {
  const transaction = transactions.find(t => t.recordId === recordId);
  
  if (!transaction) {
    return {
      found: false,
      verification: 'Record not found in blockchain',
    };
  }
  
  return {
    found: true,
    transaction,
    verification: transaction.verified
      ? 'Record verified and integrity confirmed'
      : 'Warning: Record integrity check failed - possible tampering detected',
  };
};
