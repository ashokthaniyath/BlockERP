'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  KPICard,
  ChartCard,
  LowStockAlerts,
  InventoryBarChart,
  OrdersPerMonthChart,
  InvoiceStatusChart,
  OrdersTable,
  InvoicesTable,
} from '@/components/dashboard';
import { PageLoader } from '@/components/ui';
import {
  getInventoryLevels,
  getOrdersPerMonth,
  getInvoiceStatusBreakdown,
  getLowStockAlerts,
} from '@/data/analyticsService';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Package, ShoppingCart, FileText, AlertTriangle } from 'lucide-react';

export default function ERPDashboard() {
  const { orders, invoices, products, isLoading } = useApp();

  if (isLoading) {
    return <PageLoader />;
  }

  const inventoryData = getInventoryLevels(products).slice(0, 8);
  const ordersPerMonth = getOrdersPerMonth(orders);
  const invoiceStatus = getInvoiceStatusBreakdown(invoices);
  const lowStockProducts = getLowStockAlerts(products);

  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.stockLevel * p.price,
    0
  );
  const totalProducts = products.length;
  const lowStockCount = lowStockProducts.length;
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const pendingInvoices = invoices.filter(
    (i) => i.status === 'sent' || i.status === 'overdue'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ERP Analytics</h1>
        <p className="text-gray-500 mt-1">
          Inventory, orders, and financial overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          data={{
            label: 'Inventory Value',
            value: totalInventoryValue,
            change: 8.2,
            changeType: 'increase',
            prefix: '$',
          }}
          icon={<Package className="w-6 h-6 text-primary-600" />}
        />
        <KPICard
          data={{
            label: 'Total Products',
            value: totalProducts,
            change: 2,
            changeType: 'increase',
          }}
          icon={<ShoppingCart className="w-6 h-6 text-primary-600" />}
        />
        <KPICard
          data={{
            label: 'Paid Invoices',
            value: paidInvoices.reduce((sum, i) => sum + i.amount, 0),
            change: 15.3,
            changeType: 'increase',
            prefix: '$',
          }}
          icon={<FileText className="w-6 h-6 text-primary-600" />}
        />
        <KPICard
          data={{
            label: 'Low Stock Items',
            value: lowStockCount,
            change: lowStockCount > 3 ? 20 : -10,
            changeType: lowStockCount > 3 ? 'increase' : 'decrease',
          }}
          icon={<AlertTriangle className="w-6 h-6 text-orange-500" />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Orders Per Month" subtitle="Last 6 months">
          <OrdersPerMonthChart data={ordersPerMonth} />
        </ChartCard>

        <ChartCard title="Invoice Status" subtitle="Current breakdown">
          <InvoiceStatusChart data={invoiceStatus} />
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Inventory Levels"
          subtitle="Stock vs Reorder Point"
          className="lg:col-span-2"
          height="h-96"
        >
          <InventoryBarChart data={inventoryData} height={350} />
        </ChartCard>

        <LowStockAlerts products={products} maxItems={6} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersTable orders={orders} maxRows={8} />
        <InvoicesTable invoices={invoices} maxRows={8} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Orders</span>
              <span className="font-medium">{formatNumber(orders.length)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Processing</span>
              <span className="font-medium text-blue-600">
                {orders.filter((o) => o.status === 'processing').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipped</span>
              <span className="font-medium text-purple-600">
                {orders.filter((o) => o.status === 'shipped').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivered</span>
              <span className="font-medium text-green-600">
                {orders.filter((o) => o.status === 'delivered').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Invoice Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Value</span>
              <span className="font-medium">
                {formatCurrency(invoices.reduce((sum, i) => sum + i.amount, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Paid</span>
              <span className="font-medium text-green-600">
                {formatCurrency(paidInvoices.reduce((sum, i) => sum + i.amount, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending</span>
              <span className="font-medium text-yellow-600">
                {formatCurrency(pendingInvoices.reduce((sum, i) => sum + i.amount, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Overdue</span>
              <span className="font-medium text-red-600">
                {formatCurrency(
                  invoices
                    .filter((i) => i.status === 'overdue')
                    .reduce((sum, i) => sum + i.amount, 0)
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Inventory Health
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total SKUs</span>
              <span className="font-medium">{products.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">In Stock</span>
              <span className="font-medium text-green-600">
                {products.filter((p) => p.stockLevel > p.reorderPoint).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Low Stock</span>
              <span className="font-medium text-orange-600">{lowStockCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Out of Stock</span>
              <span className="font-medium text-red-600">
                {products.filter((p) => p.stockLevel === 0).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
