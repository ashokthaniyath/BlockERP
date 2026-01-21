'use client';

import React from 'react';
import { BlockchainTransaction } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { CheckCircle, XCircle, Link2, Copy, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

interface BlockchainActivityPanelProps {
  transactions: BlockchainTransaction[];
  maxItems?: number;
}

export default function BlockchainActivityPanel({
  transactions,
  maxItems = 10,
}: BlockchainActivityPanelProps) {
  const displayTransactions = transactions.slice(0, maxItems);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
  };

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      order: 'bg-blue-100 text-blue-700',
      invoice: 'bg-green-100 text-green-700',
      inventory: 'bg-purple-100 text-purple-700',
      audit: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Blockchain Activity</h3>
        </div>
        <span className="text-xs bg-blockchain-100 text-blockchain-700 px-2 py-1 rounded-full font-medium">
          Live
        </span>
      </div>

      <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
        {displayTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Link2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No blockchain activity</p>
          </div>
        ) : (
          displayTransactions.map((tx) => (
            <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5">
                    {tx.verified ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={clsx(
                          'text-xs px-2 py-0.5 rounded font-medium capitalize',
                          getRecordTypeColor(tx.recordType)
                        )}
                      >
                        {tx.recordType}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {tx.recordId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <code className="text-xs text-gray-500 font-mono truncate max-w-[200px]">
                        {tx.hash.substring(0, 18)}...
                      </code>
                      <button
                        onClick={() => copyHash(tx.hash)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy hash"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateTime(tx.timestamp)}
                    </p>
                  </div>
                </div>
                <span
                  className={clsx(
                    'text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap',
                    tx.verified
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  )}
                >
                  {tx.verified ? 'Verified' : 'Flagged'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {transactions.length > maxItems && (
        <div className="p-3 border-t border-gray-100 text-center">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all {transactions.length} transactions
          </button>
        </div>
      )}
    </div>
  );
}
