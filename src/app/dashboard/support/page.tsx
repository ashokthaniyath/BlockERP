'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { SupportTicket, TicketStatus, TicketPriority } from '@/types';
import { Button, Modal, Input } from '@/components/ui';
import { PageLoader } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import {
  Search,
  Ticket,
  Plus,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  User,
} from 'lucide-react';
import clsx from 'clsx';

export default function SupportPage() {
  const { supportTickets, customers, createSupportTicket, updateTicketStatus, addNotification, isLoading } = useApp();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    subject: '',
    description: '',
    priority: 'medium' as TicketPriority,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTicket = () => {
    if (!formData.customerId || !formData.subject || !formData.description) return;

    const customer = customers.find((c) => c.id === formData.customerId);
    if (!customer) return;

    createSupportTicket({
      customerId: formData.customerId,
      customerName: customer.name,
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority,
    });

    addNotification({
      type: 'success',
      title: 'Ticket Created',
      message: `Support ticket for ${customer.name} has been created.`,
    });

    setShowCreateModal(false);
    setFormData({
      customerId: '',
      subject: '',
      description: '',
      priority: 'medium',
    });
  };

  const handleUpdateStatus = (ticketId: string, newStatus: TicketStatus) => {
    updateTicketStatus(ticketId, newStatus);

    addNotification({
      type: 'success',
      title: 'Ticket Updated',
      message: `Ticket status changed to ${newStatus}.`,
    });
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-orange-100 text-orange-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityStyle = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-600';
      case 'medium':
        return 'bg-blue-100 text-blue-600';
      case 'high':
        return 'bg-orange-100 text-orange-600';
      case 'critical':
        return 'bg-red-100 text-red-600';
    }
  };

  // Stats
  const openCount = supportTickets.filter((t) => t.status === 'open').length;
  const inProgressCount = supportTickets.filter((t) => t.status === 'in-progress').length;
  const resolvedCount = supportTickets.filter((t) => t.status === 'resolved').length;
  const criticalCount = supportTickets.filter(
    (t) => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed'
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500 mt-1">Manage customer support requests</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
          Create Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Open</p>
              <p className="text-lg font-bold text-blue-600">{openCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-lg font-bold text-orange-600">{inProgressCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-lg font-bold text-green-600">{resolvedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-lg font-bold text-red-600">{criticalCount}</p>
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
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedTicket(ticket);
              setShowDetailModal(true);
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Ticket Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {ticket.ticketNumber}
                  </code>
                  <span className={clsx('px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1', getStatusStyle(ticket.status))}>
                    {getStatusIcon(ticket.status)}
                    {ticket.status}
                  </span>
                  <span className={clsx('px-2 py-1 text-xs font-medium rounded-full uppercase', getPriorityStyle(ticket.priority))}>
                    {ticket.priority}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ticket.description}</p>
              </div>

              {/* Customer & Dates */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:text-right lg:min-w-[180px]">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{ticket.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 lg:ml-4" onClick={(e) => e.stopPropagation()}>
                {ticket.status === 'open' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(ticket.id, 'in-progress')}
                  >
                    Start
                  </Button>
                )}
                {ticket.status === 'in-progress' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                  >
                    Resolve
                  </Button>
                )}
                {ticket.status === 'resolved' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(ticket.id, 'closed')}
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
            <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tickets found</p>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setFormData({
            customerId: '',
            subject: '',
            description: '',
            priority: 'medium',
          });
        }}
        title="Create Support Ticket"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer *
            </label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Subject *"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Brief description of the issue"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Detailed description of the issue..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket}>Create Ticket</Button>
          </div>
        </div>
      </Modal>

      {/* Ticket Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTicket(null);
        }}
        title="Ticket Details"
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 flex-wrap">
              <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {selectedTicket.ticketNumber}
              </code>
              <span className={clsx('px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1', getStatusStyle(selectedTicket.status))}>
                {getStatusIcon(selectedTicket.status)}
                {selectedTicket.status}
              </span>
              <span className={clsx('px-3 py-1 text-sm font-medium rounded-full uppercase', getPriorityStyle(selectedTicket.priority))}>
                {selectedTicket.priority}
              </span>
            </div>

            {/* Subject & Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTicket.subject}</h3>
              <p className="text-gray-600">{selectedTicket.description}</p>
            </div>

            {/* Customer Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Customer</h4>
              <p className="font-medium text-gray-900">{selectedTicket.customerName}</p>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Created</span>
                <p className="font-medium text-gray-900">{formatDate(selectedTicket.createdAt)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Last Updated</span>
                <p className="font-medium text-gray-900">{formatDate(selectedTicket.updatedAt)}</p>
              </div>
              {selectedTicket.resolvedAt && (
                <div>
                  <span className="text-sm text-gray-500">Resolved</span>
                  <p className="font-medium text-green-600">{formatDate(selectedTicket.resolvedAt)}</p>
                </div>
              )}
            </div>

            {/* Assigned Agent */}
            {selectedTicket.assignedTo && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700 mb-1">Assigned To</h4>
                <p className="font-medium text-blue-900">{selectedTicket.assignedTo}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              {selectedTicket.status === 'open' && (
                <Button onClick={() => {
                  handleUpdateStatus(selectedTicket.id, 'in-progress');
                  setShowDetailModal(false);
                }}>
                  Start Working
                </Button>
              )}
              {selectedTicket.status === 'in-progress' && (
                <Button variant="success" onClick={() => {
                  handleUpdateStatus(selectedTicket.id, 'resolved');
                  setShowDetailModal(false);
                }}>
                  Mark Resolved
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
