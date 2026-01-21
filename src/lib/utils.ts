// Utility functions for generating realistic mock data
import { format, subDays, subHours, subMonths } from 'date-fns';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11).toUpperCase();
};

export const generateHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const getRandomDate = (daysBack: number): string => {
  return subDays(new Date(), Math.floor(Math.random() * daysBack)).toISOString();
};

export const getRandomPastDate = (minDays: number, maxDays: number): string => {
  const days = minDays + Math.floor(Math.random() * (maxDays - minDays));
  return subDays(new Date(), days).toISOString();
};

export const getMonthsArray = (count: number): string[] => {
  const months: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    months.push(format(subMonths(new Date(), i), 'MMM yyyy'));
  }
  return months;
};

export const getRecentTimestamp = (): string => {
  const hoursAgo = Math.floor(Math.random() * 48);
  return subHours(new Date(), hoursAgo).toISOString();
};

export const randomChoice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const randomBetween = (min: number, max: number): number => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

export const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
};

export const statusColors: Record<string, string> = {
  // Order statuses
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  // Invoice statuses
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  // Customer statuses
  lead: 'bg-yellow-100 text-yellow-800',
  prospect: 'bg-blue-100 text-blue-800',
  customer: 'bg-green-100 text-green-800',
  churned: 'bg-gray-100 text-gray-800',
  // Ticket statuses
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  // Priority
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export const rolePermissions: Record<string, string[]> = {
  admin: ['dashboard', 'erp', 'crm', 'blockchain', 'orders', 'invoices', 'customers', 'inventory', 'tickets', 'settings', 'audit'],
  manager: ['dashboard', 'erp', 'crm', 'orders', 'invoices', 'customers', 'inventory', 'tickets'],
  sales: ['dashboard', 'crm', 'orders', 'customers'],
  auditor: ['dashboard', 'blockchain', 'audit'],
  support: ['dashboard', 'crm', 'tickets', 'customers'],
};

export const hasPermission = (role: string, permission: string): boolean => {
  return rolePermissions[role]?.includes(permission) ?? false;
};
