'use client';

import React, { useState } from 'react';
import { BlockchainTransaction } from '@/types';
import { formatDateTime } from '@/lib/utils';
import {
  Search,
  CheckCircle,
  XCircle,
  Shield,
  Clock,
  Hash,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';

interface BlockchainVerificationPanelProps {
  transactions: BlockchainTransaction[];
}

export default function BlockchainVerificationPanel({
  transactions,
}: BlockchainVerificationPanelProps) {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    transaction?: BlockchainTransaction;
    searched: boolean;
  }>({ found: false, searched: false });

  const handleSearch = () => {
    if (!searchId.trim()) {
      setSearchResult({ found: false, searched: false });
      return;
    }

    const found = transactions.find(
      (t) =>
        t.recordId.toLowerCase().includes(searchId.toLowerCase()) ||
        t.hash.toLowerCase().includes(searchId.toLowerCase())
    );

    setSearchResult({
      found: !!found,
      transaction: found,
      searched: true,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <Shield className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-gray-900">Record Verification</h3>
      </div>

      <div className="p-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Order ID, Invoice ID, or Hash..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Verify
          </button>
        </div>

        {/* Search Result */}
        {searchResult.searched && (
          <div className="mt-4">
            {searchResult.found && searchResult.transaction ? (
              <div
                className={clsx(
                  'p-4 rounded-lg border',
                  searchResult.transaction.verified
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                )}
              >
                <div className="flex items-start gap-3">
                  {searchResult.transaction.verified ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={clsx(
                        'font-semibold',
                        searchResult.transaction.verified
                          ? 'text-green-800'
                          : 'text-red-800'
                      )}
                    >
                      {searchResult.transaction.verified
                        ? 'Record Verified on Blockchain'
                        : 'Verification Failed - Possible Tampering'}
                    </p>
                    <p
                      className={clsx(
                        'text-sm mt-1',
                        searchResult.transaction.verified
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {searchResult.transaction.verified
                        ? 'Data integrity confirmed. No modifications detected.'
                        : 'Hash mismatch detected. Record may have been altered.'}
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Record ID:</span>
                        <span className="font-mono font-medium text-gray-900">
                          {searchResult.transaction.recordId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Block Hash:</span>
                        <code className="font-mono text-xs text-gray-700 bg-white/50 px-2 py-0.5 rounded truncate max-w-[250px]">
                          {searchResult.transaction.hash}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Timestamp:</span>
                        <span className="text-gray-900">
                          {formatDateTime(searchResult.transaction.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800">
                      Record Not Found
                    </p>
                    <p className="text-sm text-yellow-600 mt-1">
                      No blockchain record found for "{searchId}". The record may not
                      have been added to the blockchain yet, or the ID may be incorrect.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!searchResult.searched && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Enter an Order ID (e.g., ORD00001), Invoice ID (e.g., INV00001), or
              blockchain hash to verify its authenticity and integrity.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                ORD00001
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                INV00001
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                0x1234...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
