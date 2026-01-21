'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  KPICard,
  ChartCard,
  CustomerFunnelChart,
  CustomerGrowthChart,
  RepeatCustomersChart,
  CustomersTable,
  TicketsTable,
} from '@/components/dashboard';
import { PageLoader } from '@/components/ui';
import {
  getCustomerFunnel,
  getCustomerGrowth,
  getRepeatVsNewCustomers,
} from '@/data/analyticsService';
import { formatCurrency } from '@/lib/utils';
import { Users, UserPlus, Repeat, HeadphonesIcon } from 'lucide-react';
import clsx from 'clsx';
import { statusColors } from '@/lib/utils';

export default function CRMDashboard() {
  const { customers, tickets, isLoading } = useApp();

  if (isLoading) {
    return <PageLoader />;
  }

  const funnelData = getCustomerFunnel(customers);
  const growthData = getCustomerGrowth(customers);
  const repeatVsNew = getRepeatVsNewCustomers(customers);

  const activeCustomers = customers.filter((c) => c.status === 'customer').length;
  const leads = customers.filter((c) => c.status === 'lead').length;
  const prospects = customers.filter((c) => c.status === 'prospect').length;
  const repeatCustomers = customers.filter((c) => c.totalOrders > 1).length;
  const openTickets = tickets.filter(
    (t) => t.status === 'open' || t.status === 'in-progress'
  ).length;

  const conversionRate = Math.round((activeCustomers / (leads + prospects + activeCustomers)) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CRM Analytics</h1>
        <p className="text-gray-500 mt-1">
          Customer relationships, sales funnel, and support metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          data={{
            label: 'Active Customers',
            value: activeCustomers,
            change: 12.5,
            changeType: 'increase',
          }}
          icon={<Users className="w-6 h-6 text-primary-600" />}
        />
        <KPICard
          data={{
            label: 'New Leads',
            value: leads + prospects,
            change: 18.3,
            changeType: 'increase',
          }}
          icon={<UserPlus className="w-6 h-6 text-primary-600" />}
        />
        <KPICard
          data={{
            label: 'Repeat Customers',
            value: repeatCustomers,
            change: 7.2,
            changeType: 'increase',
          }}
          icon={<Repeat className="w-6 h-6 text-primary-600" />}
        />
        <KPICard
          data={{
            label: 'Open Tickets',
            value: openTickets,
            change: -15.4,
            changeType: 'decrease',
          }}
          icon={<HeadphonesIcon className="w-6 h-6 text-primary-600" />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales Funnel" subtitle="Lead to customer conversion">
          <CustomerFunnelChart data={funnelData} />
        </ChartCard>

        <ChartCard title="Customer Growth" subtitle="Monthly trend">
          <CustomerGrowthChart data={growthData} />
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Customer Retention" subtitle="Repeat vs New">
          <RepeatCustomersChart data={repeatVsNew} />
        </ChartCard>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Segments
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <p className="text-3xl font-bold text-yellow-600">{leads}</p>
              <p className="text-sm text-yellow-600/70 mt-1">Leads</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">{prospects}</p>
              <p className="text-sm text-blue-600/70 mt-1">Prospects</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600">{activeCustomers}</p>
              <p className="text-sm text-green-600/70 mt-1">Customers</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-3xl font-bold text-purple-600">{conversionRate}%</p>
              <p className="text-sm text-purple-600/70 mt-1">Conversion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomersTable customers={customers} maxRows={8} />
        <TicketsTable tickets={tickets} maxRows={8} />
      </div>

      {/* Support Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ticket Status
          </h3>
          <div className="space-y-3">
            {['open', 'in_progress', 'resolved', 'closed'].map((status) => {
              const count = tickets.filter((t) => t.status === status).length;
              const percentage = Math.round((count / tickets.length) * 100);
              
              return (
                <div key={status}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500 capitalize">
                      {status.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={clsx(
                        'h-2 rounded-full',
                        status === 'open' && 'bg-yellow-500',
                        status === 'in_progress' && 'bg-blue-500',
                        status === 'resolved' && 'bg-green-500',
                        status === 'closed' && 'bg-gray-400'
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Priority Distribution
          </h3>
          <div className="space-y-3">
            {['low', 'medium', 'high', 'urgent'].map((priority) => {
              const count = tickets.filter((t) => t.priority === priority).length;
              
              return (
                <div key={priority} className="flex items-center justify-between">
                  <span
                    className={clsx(
                      'text-xs px-2 py-1 rounded-full capitalize font-medium',
                      statusColors[priority]
                    )}
                  >
                    {priority}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Customers
          </h3>
          <div className="space-y-3">
            {customers
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700 truncate max-w-[120px]">
                      {customer.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
