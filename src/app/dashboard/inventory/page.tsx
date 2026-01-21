'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/types';
import { Button, Modal, Input } from '@/components/ui';
import { PageLoader } from '@/components/ui';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import {
  Search,
  Package,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
} from 'lucide-react';
import clsx from 'clsx';

export default function InventoryPage() {
  const { products, updateProductStock, addNotification, isLoading } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockQuantity, setRestockQuantity] = useState('');

  if (isLoading) {
    return <PageLoader />;
  }

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && product.stockLevel <= product.reorderPoint) ||
      (stockFilter === 'out' && product.stockLevel === 0) ||
      (stockFilter === 'ok' && product.stockLevel > product.reorderPoint);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleRestock = () => {
    if (!selectedProduct || !restockQuantity) return;

    const quantity = parseInt(restockQuantity);
    if (isNaN(quantity) || quantity <= 0) return;

    updateProductStock(selectedProduct.id, quantity);

    addNotification({
      type: 'success',
      title: 'Stock Updated',
      message: `Added ${quantity} units to ${selectedProduct.name}. Recorded on blockchain.`,
    });

    setShowRestockModal(false);
    setSelectedProduct(null);
    setRestockQuantity('');
  };

  // Stats
  const totalValue = products.reduce((sum, p) => sum + p.stockLevel * p.price, 0);
  const lowStockCount = products.filter((p) => p.stockLevel <= p.reorderPoint).length;
  const outOfStockCount = products.filter((p) => p.stockLevel === 0).length;
  const totalUnits = products.reduce((sum, p) => sum + p.stockLevel, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-500 mt-1">Manage product stock levels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Units</p>
              <p className="text-lg font-bold text-gray-900">
                {formatNumber(totalUnits)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-lg font-bold text-orange-600">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Package className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-lg font-bold text-red-600">{outOfStockCount}</p>
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
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="all">All Stock</option>
          <option value="ok">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => {
                const isLowStock = product.stockLevel <= product.reorderPoint;
                const isOutOfStock = product.stockLevel === 0;

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {product.sku}
                      </code>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-600">{product.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={clsx(
                            'font-medium',
                            isOutOfStock && 'text-red-600',
                            isLowStock && !isOutOfStock && 'text-orange-600',
                            !isLowStock && 'text-gray-900'
                          )}
                        >
                          {formatNumber(product.stockLevel)}
                        </span>
                        <div className="w-20 bg-gray-100 rounded-full h-2">
                          <div
                            className={clsx(
                              'h-2 rounded-full',
                              isOutOfStock && 'bg-red-500',
                              isLowStock && !isOutOfStock && 'bg-orange-500',
                              !isLowStock && 'bg-green-500'
                            )}
                            style={{
                              width: `${Math.min(
                                (product.stockLevel / product.reorderPoint) * 50,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={clsx(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          isOutOfStock && 'bg-red-100 text-red-700',
                          isLowStock && !isOutOfStock && 'bg-orange-100 text-orange-700',
                          !isLowStock && 'bg-green-100 text-green-700'
                        )}
                      >
                        {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-600 text-sm">
                        {formatDate(product.lastRestocked)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<RefreshCw className="w-3 h-3" />}
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowRestockModal(true);
                        }}
                      >
                        Restock
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      <Modal
        isOpen={showRestockModal}
        onClose={() => {
          setShowRestockModal(false);
          setSelectedProduct(null);
          setRestockQuantity('');
        }}
        title="Restock Product"
        size="sm"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedProduct.name}</p>
              <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
              <p className="text-sm text-gray-500 mt-2">
                Current Stock: {formatNumber(selectedProduct.stockLevel)} units
              </p>
            </div>

            <Input
              label="Quantity to Add"
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              placeholder="Enter quantity"
            />

            {restockQuantity && parseInt(restockQuantity) > 0 && (
              <p className="text-sm text-gray-600">
                New stock level:{' '}
                <span className="font-medium text-green-600">
                  {formatNumber(selectedProduct.stockLevel + parseInt(restockQuantity))} units
                </span>
              </p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRestockModal(false);
                  setSelectedProduct(null);
                  setRestockQuantity('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleRestock}>Confirm Restock</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
