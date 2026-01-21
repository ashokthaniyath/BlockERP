'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { AuditLogEntry } from '@/types';
import { Button, Modal } from '@/components/ui';
import { PageLoader } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import {
  Search,
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
  User,
  Clock,
  Link2,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';
import clsx from 'clsx';

export default function AuditPage() {
  const { auditLogs, isLoading } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');

  const sortedLogs = useMemo(() => {
    return [...auditLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [auditLogs]);

  const actions = [...new Set(auditLogs.map((log) => log.action))];
  const entities = [...new Set(auditLogs.map((log) => log.entityType))];

  const filteredLogs = sortedLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.blockchainTxHash && log.blockchainTxHash.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAction =
      actionFilter === 'all' || log.action === actionFilter;
    const matchesEntity =
      entityFilter === 'all' || log.entityType === entityFilter;
    return matchesSearch && matchesAction && matchesEntity;
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const handleVerify = async () => {
    if (!selectedLog?.blockchainTxHash) return;

    setVerificationStatus('verifying');
    
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate blockchain verification - in real app would call verifyBlockchainRecord
    const isVerified = selectedLog.blockchainTxHash.startsWith('0x');
    setVerificationStatus(isVerified ? 'verified' : 'failed');
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Create') || action.includes('Add')) {
      return <div className="w-2 h-2 bg-green-500 rounded-full" />;
    }
    if (action.includes('Update') || action.includes('Change')) {
      return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
    }
    if (action.includes('Delete') || action.includes('Remove')) {
      return <div className="w-2 h-2 bg-red-500 rounded-full" />;
    }
    return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
  };

  const getActionStyle = (action: string) => {
    if (action.includes('Create') || action.includes('Add')) {
      return 'text-green-700 bg-green-50';
    }
    if (action.includes('Update') || action.includes('Change')) {
      return 'text-blue-700 bg-blue-50';
    }
    if (action.includes('Delete') || action.includes('Remove')) {
      return 'text-red-700 bg-red-50';
    }
    return 'text-gray-700 bg-gray-50';
  };

  // Stats
  const todayLogs = auditLogs.filter(
    (log) => new Date(log.timestamp).toDateString() === new Date().toDateString()
  ).length;
  const blockchainVerified = auditLogs.filter((log) => log.blockchainTxHash).length;
  const uniqueUsers = new Set(auditLogs.map((log) => log.user)).size;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-500 mt-1">Track all system activities with blockchain verification</p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => {
            // Simulate export
            alert('Exporting audit logs...');
          }}
        >
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Entries</p>
              <p className="text-lg font-bold text-gray-900">{auditLogs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-lg font-bold text-green-600">{todayLogs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blockchain-100 rounded-lg">
              <Shield className="w-5 h-5 text-blockchain-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Blockchain Verified</p>
              <p className="text-lg font-bold text-blockchain-600">{blockchainVerified}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-lg font-bold text-purple-600">{uniqueUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Actions</option>
          {actions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Entities</option>
          {entities.map((entity) => (
            <option key={entity} value={entity}>
              {entity}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blockchain
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.slice(0, 50).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">
                      {formatDate(log.timestamp)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded',
                        getActionStyle(log.action)
                      )}
                    >
                      {getActionIcon(log.action)}
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{log.entityType}</span>
                      <p className="text-xs text-gray-500">{log.entityId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {log.blockchainTxHash ? (
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-blockchain-600" />
                        <span className="text-xs text-blockchain-600 font-mono">
                          {log.blockchainTxHash.slice(0, 8)}...
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedLog(log);
                        setVerificationStatus('idle');
                        setShowDetailModal(true);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No audit logs found</p>
          </div>
        )}

        {filteredLogs.length > 50 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Showing 50 of {filteredLogs.length} entries
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedLog(null);
          setVerificationStatus('idle');
        }}
        title="Audit Log Details"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-6">
            {/* Action Header */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={clsx(
                  'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded',
                  getActionStyle(selectedLog.action)
                )}
              >
                {getActionIcon(selectedLog.action)}
                {selectedLog.action}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(selectedLog.timestamp)}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">User</h4>
                <p className="font-medium text-gray-900">{selectedLog.user}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">IP Address</h4>
                <p className="font-mono text-gray-900">{selectedLog.ipAddress || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Entity Type</h4>
                <p className="font-medium text-gray-900">{selectedLog.entityType}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Entity ID</h4>
                <p className="font-mono text-gray-900">{selectedLog.entityId}</p>
              </div>
            </div>

            {/* Changes */}
            {selectedLog.changes && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Changes</h4>
                <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">
                    {JSON.stringify(selectedLog.changes, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Blockchain Verification */}
            {selectedLog.blockchainTxHash && (
              <div className="p-4 bg-blockchain-50 rounded-lg border border-blockchain-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blockchain-600" />
                    <h4 className="font-medium text-blockchain-700">Blockchain Record</h4>
                  </div>
                  {verificationStatus === 'idle' && (
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<RefreshCw className="w-3 h-3" />}
                      onClick={handleVerify}
                    >
                      Verify
                    </Button>
                  )}
                  {verificationStatus === 'verifying' && (
                    <div className="flex items-center gap-2 text-blockchain-600">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Verifying...</span>
                    </div>
                  )}
                  {verificationStatus === 'verified' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                  {verificationStatus === 'failed' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Failed</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-blockchain-500" />
                  <code className="text-sm text-blockchain-700 font-mono break-all">
                    {selectedLog.blockchainTxHash}
                  </code>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
