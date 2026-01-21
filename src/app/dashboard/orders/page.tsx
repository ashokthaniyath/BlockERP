'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Order, OrderStatus } from '@/types';
import { Button, Modal, Input, Select } from '@/components/ui';
import { PageLoader } from '@/components/ui';
import { formatCurrency, formatDate, statusColors } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
} from 'lucide-react';
import clsx from 'clsx';

export default function OrdersPage() {
  const {
    orders,
    customers,
    products,
    createOrder,
    updateOrderStatus,
    generateInvoice,
    addNotification,
    isLoading,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New order form state
  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderProducts, setNewOrderProducts] = useState<
    { productId: string; quantity: number }[]
  >([{ productId: '', quantity: 1 }]);

  if (isLoading) {
    return <PageLoader />;
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = () => {
    if (!newOrderCustomer || newOrderProducts.every((p) => !p.productId)) {
      return;
    }

    const customer = customers.find((c) => c.id === newOrderCustomer);
    if (!customer) return;

    const items = newOrderProducts
      .filter((p) => p.productId)
      .map((p) => {
        const product = products.find((prod) => prod.id === p.productId);
        if (!product) return null;
        return {
          productId: product.id,
          productName: product.name,
          quantity: p.quantity,
          unitPrice: product.price,
          total: product.price * p.quantity,
        };
      })
      .filter(Boolean) as Order['items'];

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const newOrder = createOrder({
      customerId: customer.id,
      customerName: customer.name,
      items,
      status: 'pending',
      totalAmount,
    });

    addNotification({
      type: 'success',
      title: 'Order Created',
      message: `Order ${newOrder.id} has been created and recorded on blockchain.`,
    });

    setShowCreateModal(false);
    setNewOrderCustomer('');
    setNewOrderProducts([{ productId: '', quantity: 1 }]);
  };

  const handleStatusUpdate = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    addNotification({
      type: 'info',
      title: 'Order Updated',
      message: `Order ${orderId} status changed to ${status}.`,
    });
  };

  const handleGenerateInvoice = (orderId: string) => {
    const invoice = generateInvoice(orderId);
    if (invoice) {
      addNotification({
        type: 'success',
        title: 'Invoice Generated',
        message: `Invoice ${invoice.id} created and verified on blockchain.`,
      });
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track customer orders</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          Create Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="all">All Status</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blockchain
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="font-medium text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-gray-700">{order.customerName}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-gray-600">{order.items.length} items</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full capitalize',
                        statusColors[order.status]
                      )}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {order.blockchainVerified ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs">
                        <XCircle className="w-4 h-4" />
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-gray-600 text-sm">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleGenerateInvoice(order.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                        title="Generate invoice"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Order"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Customer"
            value={newOrderCustomer}
            onChange={(e) => setNewOrderCustomer(e.target.value)}
            options={[
              { value: '', label: 'Select a customer' },
              ...customers
                .filter((c) => c.status === 'customer')
                .map((c) => ({ value: c.id, label: `${c.name} (${c.company})` })),
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products
            </label>
            {newOrderProducts.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={item.productId}
                  onChange={(e) => {
                    const updated = [...newOrderProducts];
                    updated[index].productId = e.target.value;
                    setNewOrderProducts(updated);
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {formatCurrency(p.price)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const updated = [...newOrderProducts];
                    updated[index].quantity = parseInt(e.target.value) || 1;
                    setNewOrderProducts(updated);
                  }}
                  className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNewOrderProducts(newOrderProducts.filter((_, i) => i !== index));
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setNewOrderProducts([...newOrderProducts, { productId: '', quantity: 1 }])
              }
            >
              Add Product
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder}>Create Order</Button>
          </div>
        </div>
      </Modal>

      {/* Order Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={`Order ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusUpdate(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  options={statusOptions}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">{formatCurrency(selectedOrder.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Items</p>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.blockchainHash && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Blockchain Hash</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">
                  {selectedOrder.blockchainHash}
                </code>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button onClick={() => handleGenerateInvoice(selectedOrder.id)}>
                Generate Invoice
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
