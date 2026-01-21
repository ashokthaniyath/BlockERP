'use client';

import React from 'react';
import { Order, Invoice, Customer, SupportTicket } from '@/types';
import { formatCurrency, formatDate, statusColors } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
  }[];
  onRowClick?: (item: T) => void;
  maxRows?: number;
  emptyMessage?: string;
  viewAllHref?: string;
}

export function DataTable<T extends { id: string }>({
  title,
  data,
  columns,
  onRowClick,
  maxRows = 5,
  emptyMessage = 'No data available',
  viewAllHref,
}: DataTableProps<T>) {
  const displayData = data.slice(0, maxRows);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {viewAllHref && (
          <a
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="overflow-x-auto">
        {displayData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={clsx(
                      'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={clsx(
                    'hover:bg-gray-50 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx('px-4 py-3 text-sm', col.className)}
                    >
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Pre-configured table for Orders
export function OrdersTable({
  orders,
  maxRows = 5,
  onRowClick,
}: {
  orders: Order[];
  maxRows?: number;
  onRowClick?: (order: Order) => void;
}) {
  return (
    <DataTable
      title="Recent Orders"
      data={orders}
      maxRows={maxRows}
      onRowClick={onRowClick}
      viewAllHref="/dashboard/orders"
      columns={[
        {
          key: 'id',
          header: 'Order ID',
          render: (order) => (
            <span className="font-medium text-gray-900">{order.id}</span>
          ),
        },
        {
          key: 'customerName',
          header: 'Customer',
          render: (order) => order.customerName,
        },
        {
          key: 'totalAmount',
          header: 'Amount',
          render: (order) => formatCurrency(order.totalAmount),
        },
        {
          key: 'status',
          header: 'Status',
          render: (order) => (
            <span
              className={clsx(
                'px-2 py-1 text-xs font-medium rounded-full capitalize',
                statusColors[order.status]
              )}
            >
              {order.status}
            </span>
          ),
        },
        {
          key: 'createdAt',
          header: 'Date',
          render: (order) => formatDate(order.createdAt),
        },
      ]}
    />
  );
}

// Pre-configured table for Invoices
export function InvoicesTable({
  invoices,
  maxRows = 5,
  onRowClick,
}: {
  invoices: Invoice[];
  maxRows?: number;
  onRowClick?: (invoice: Invoice) => void;
}) {
  return (
    <DataTable
      title="Recent Invoices"
      data={invoices}
      maxRows={maxRows}
      onRowClick={onRowClick}
      viewAllHref="/dashboard/invoices"
      columns={[
        {
          key: 'id',
          header: 'Invoice ID',
          render: (inv) => (
            <span className="font-medium text-gray-900">{inv.id}</span>
          ),
        },
        {
          key: 'customerName',
          header: 'Customer',
          render: (inv) => inv.customerName,
        },
        {
          key: 'amount',
          header: 'Amount',
          render: (inv) => formatCurrency(inv.amount),
        },
        {
          key: 'status',
          header: 'Status',
          render: (inv) => (
            <span
              className={clsx(
                'px-2 py-1 text-xs font-medium rounded-full capitalize',
                statusColors[inv.status]
              )}
            >
              {inv.status}
            </span>
          ),
        },
        {
          key: 'dueDate',
          header: 'Due Date',
          render: (inv) => formatDate(inv.dueDate),
        },
      ]}
    />
  );
}

// Pre-configured table for Customers
export function CustomersTable({
  customers,
  maxRows = 5,
  onRowClick,
}: {
  customers: Customer[];
  maxRows?: number;
  onRowClick?: (customer: Customer) => void;
}) {
  return (
    <DataTable
      title="Recent Customers"
      data={customers}
      maxRows={maxRows}
      onRowClick={onRowClick}
      viewAllHref="/dashboard/customers"
      columns={[
        {
          key: 'name',
          header: 'Name',
          render: (cust) => (
            <div>
              <span className="font-medium text-gray-900">{cust.name}</span>
              <p className="text-xs text-gray-500">{cust.email}</p>
            </div>
          ),
        },
        {
          key: 'company',
          header: 'Company',
          render: (cust) => cust.company,
        },
        {
          key: 'status',
          header: 'Status',
          render: (cust) => (
            <span
              className={clsx(
                'px-2 py-1 text-xs font-medium rounded-full capitalize',
                statusColors[cust.status]
              )}
            >
              {cust.status}
            </span>
          ),
        },
        {
          key: 'totalOrders',
          header: 'Orders',
          render: (cust) => cust.totalOrders,
        },
        {
          key: 'totalSpent',
          header: 'Total Spent',
          render: (cust) => formatCurrency(cust.totalSpent),
        },
      ]}
    />
  );
}

// Pre-configured table for Support Tickets
export function TicketsTable({
  tickets,
  maxRows = 5,
  onRowClick,
}: {
  tickets: SupportTicket[];
  maxRows?: number;
  onRowClick?: (ticket: SupportTicket) => void;
}) {
  return (
    <DataTable
      title="Support Tickets"
      data={tickets}
      maxRows={maxRows}
      onRowClick={onRowClick}
      viewAllHref="/dashboard/support"
      columns={[
        {
          key: 'id',
          header: 'Ticket ID',
          render: (ticket) => (
            <span className="font-medium text-gray-900">{ticket.id}</span>
          ),
        },
        {
          key: 'subject',
          header: 'Subject',
          render: (ticket) => (
            <span className="truncate max-w-[200px] block">{ticket.subject}</span>
          ),
        },
        {
          key: 'priority',
          header: 'Priority',
          render: (ticket) => (
            <span
              className={clsx(
                'px-2 py-1 text-xs font-medium rounded-full capitalize',
                statusColors[ticket.priority]
              )}
            >
              {ticket.priority}
            </span>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          render: (ticket) => (
            <span
              className={clsx(
                'px-2 py-1 text-xs font-medium rounded-full',
                statusColors[ticket.status]
              )}
            >
              {ticket.status.replace('_', ' ')}
            </span>
          ),
        },
        {
          key: 'createdAt',
          header: 'Created',
          render: (ticket) => formatDate(ticket.createdAt),
        },
      ]}
    />
  );
}
