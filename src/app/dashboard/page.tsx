'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import {
  KPICard,
  ChartCard,
  BlockchainActivityPanel,
  RevenueLineChart,
  OrderStatusPieChart,
  OrdersTable,
  InvoicesTable,
} from '@/components/dashboard';
import { PageLoader } from '@/components/ui';
import { calculateKPIs, getRevenueOverTime, getOrderStatusDistribution } from '@/data/analyticsService';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  TrendingUp,
} from 'lucide-react';

export default function ExecutiveDashboard() {
  const { user } = useAuth();
  const { orders, invoices, customers, blockchainTransactions, isLoading } = useApp();

  if (isLoading) {
    return <PageLoader />;
  }

  const kpis = calculateKPIs(orders, invoices, customers);
  const revenueData = getRevenueOverTime(invoices);
  const orderStatusData = getOrderStatusDistribution(orders);

  const kpiIcons = [
    <DollarSign key="revenue" className="w-6 h-6 text-primary-600" />,
    <ShoppingCart key="orders" className="w-6 h-6 text-primary-600" />,
    <Users key="customers" className="w-6 h-6 text-primary-600" />,
    <Clock key="pending" className="w-6 h-6 text-primary-600" />,
    <TrendingUp key="leads" className="w-6 h-6 text-primary-600" />,
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Last updated:</span>
          <span className="text-sm font-medium text-gray-700">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.slice(0, 5).map((kpi, index) => (
          <KPICard key={kpi.label} data={kpi} icon={kpiIcons[index]} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Revenue Over Time"
          subtitle="Last 12 months"
          className="lg:col-span-2"
        >
          <RevenueLineChart data={revenueData} />
        </ChartCard>

        <ChartCard title="Order Status" subtitle="Current distribution">
          <OrderStatusPieChart data={orderStatusData} />
        </ChartCard>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersTable orders={orders.slice(0, 5)} />
        <InvoicesTable invoices={invoices.slice(0, 5)} />
      </div>

      {/* Blockchain Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Recent Activity Summary" subtitle="Orders and transactions">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full items-center">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
                <p className="text-sm text-blue-600/70 mt-1">Pending Orders</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
                <p className="text-sm text-green-600/70 mt-1">Delivered</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-3xl font-bold text-purple-600">
                  {invoices.filter(i => i.status === 'paid').length}
                </p>
                <p className="text-sm text-purple-600/70 mt-1">Paid Invoices</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <p className="text-3xl font-bold text-orange-600">
                  {blockchainTransactions.filter(t => t.verified).length}
                </p>
                <p className="text-sm text-orange-600/70 mt-1">Verified Txns</p>
              </div>
            </div>
          </ChartCard>
        </div>
        <BlockchainActivityPanel transactions={blockchainTransactions} maxItems={6} />
      </div>
    </div>
  );
}
