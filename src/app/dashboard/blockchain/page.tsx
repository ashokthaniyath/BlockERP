'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  KPICard,
  ChartCard,
  BlockchainActivityPanel,
  BlockchainVerificationPanel,
  BlockchainTransactionsChart,
} from '@/components/dashboard';
import { PageLoader } from '@/components/ui';
import { getBlockchainAnalytics, getTransactionTimeline } from '@/data/analyticsService';
import { formatDateTime } from '@/lib/utils';
import {
  Link2,
  CheckCircle,
  XCircle,
  Activity,
  Shield,
  FileText,
  ShoppingCart,
  Package,
} from 'lucide-react';
import clsx from 'clsx';

export default function BlockchainDashboard() {
  const { blockchainTransactions, auditLogs, isLoading } = useApp();

  if (isLoading) {
    return <PageLoader />;
  }

  const analytics = getBlockchainAnalytics(blockchainTransactions);
  const timelineData = getTransactionTimeline(blockchainTransactions);

  const typeIcons: Record<string, React.ReactNode> = {
    Order: <ShoppingCart className="w-4 h-4" />,
    Invoice: <FileText className="w-4 h-4" />,
    Inventory: <Package className="w-4 h-4" />,
    Audit: <Shield className="w-4 h-4" />,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blockchain Analytics</h1>
        <p className="text-gray-500 mt-1">
          On-chain transactions, verification status, and audit trail
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          data={{
            label: 'Total Transactions',
            value: analytics.totalTransactions,
            change: 24.5,
            changeType: 'increase',
          }}
          icon={<Link2 className="w-6 h-6 text-primary-600" />}
        />
        <KPICard
          data={{
            label: 'Verified Records',
            value: analytics.verifiedCount,
            change: 2.1,
            changeType: 'increase',
          }}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
        />
        <KPICard
          data={{
            label: 'Flagged Records',
            value: analytics.tamperedCount,
            change: analytics.tamperedCount > 5 ? 15 : -30,
            changeType: analytics.tamperedCount > 5 ? 'increase' : 'decrease',
          }}
          icon={<XCircle className="w-6 h-6 text-red-600" />}
        />
        <KPICard
          data={{
            label: 'Verification Rate',
            value: analytics.verificationRate,
            change: 0.5,
            changeType: 'increase',
            suffix: '%',
          }}
          icon={<Activity className="w-6 h-6 text-primary-600" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Transaction Timeline"
          subtitle="Last 30 days"
          className="lg:col-span-2"
        >
          <BlockchainTransactionsChart data={timelineData} />
        </ChartCard>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Transactions by Type
          </h3>
          <div className="space-y-4">
            {analytics.byType.map((item) => {
              const percentage = Math.round(
                (item.value / analytics.totalTransactions) * 100
              );
              const colors: Record<string, string> = {
                Order: 'bg-blue-500',
                Invoice: 'bg-green-500',
                Inventory: 'bg-purple-500',
                Audit: 'bg-orange-500',
              };

              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          'p-1.5 rounded text-white',
                          colors[item.name] || 'bg-gray-500'
                        )}
                      >
                        {typeIcons[item.name]}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={clsx('h-2 rounded-full', colors[item.name] || 'bg-gray-500')}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Verification Panel & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BlockchainVerificationPanel transactions={blockchainTransactions} />
        <BlockchainActivityPanel transactions={blockchainTransactions} maxItems={8} />
      </div>

      {/* Audit Trail */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 p-4 border-b border-gray-100">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Audit Trail</h3>
          <span className="ml-auto text-sm text-gray-500">
            {auditLogs.length} entries
          </span>
        </div>
        <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
          {auditLogs.slice(0, 15).map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-medium flex-shrink-0">
                {log.userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">{log.userName}</span>
                  <span className="text-gray-500">{log.action}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                    {log.entityId}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{log.details}</p>
                {log.blockchainHash && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <code className="text-xs text-gray-400 font-mono truncate max-w-[200px]">
                      {log.blockchainHash.substring(0, 20)}...
                    </code>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {formatDateTime(log.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <h3 className="font-semibold text-lg">Integrity Status</h3>
          </div>
          <p className="text-3xl font-bold">{analytics.verificationRate}%</p>
          <p className="text-green-100 mt-1">Records verified successfully</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-8 h-8" />
            <h3 className="font-semibold text-lg">Chain Length</h3>
          </div>
          <p className="text-3xl font-bold">{analytics.totalTransactions}</p>
          <p className="text-blue-100 mt-1">Blocks in the ledger</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <h3 className="font-semibold text-lg">Audit Coverage</h3>
          </div>
          <p className="text-3xl font-bold">100%</p>
          <p className="text-purple-100 mt-1">All transactions logged</p>
        </div>
      </div>
    </div>
  );
}
