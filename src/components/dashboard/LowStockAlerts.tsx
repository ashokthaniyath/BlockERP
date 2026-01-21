'use client';

import React from 'react';
import { Product } from '@/types';
import { formatNumber } from '@/lib/utils';
import { AlertTriangle, Package } from 'lucide-react';
import clsx from 'clsx';

interface LowStockAlertsProps {
  products: Product[];
  maxItems?: number;
}

export default function LowStockAlerts({ products, maxItems = 5 }: LowStockAlertsProps) {
  const lowStockProducts = products
    .filter((p) => p.stockLevel <= p.reorderPoint)
    .sort((a, b) => a.stockLevel - b.stockLevel)
    .slice(0, maxItems);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-gray-900">Low Stock Alerts</h3>
        {lowStockProducts.length > 0 && (
          <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {lowStockProducts.length} items
          </span>
        )}
      </div>

      <div className="divide-y divide-gray-50">
        {lowStockProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">All products are well stocked</p>
          </div>
        ) : (
          lowStockProducts.map((product) => {
            const stockPercentage = Math.round(
              (product.stockLevel / product.reorderPoint) * 100
            );
            const isCritical = product.stockLevel < product.reorderPoint * 0.5;

            return (
              <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      SKU: {product.sku}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      'text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap',
                      isCritical
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    )}
                  >
                    {isCritical ? 'Critical' : 'Low'}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">
                      Stock: {formatNumber(product.stockLevel)} units
                    </span>
                    <span className="text-gray-500">
                      Reorder at: {formatNumber(product.reorderPoint)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={clsx(
                        'h-2 rounded-full transition-all',
                        isCritical ? 'bg-red-500' : 'bg-orange-500'
                      )}
                      style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {products.filter((p) => p.stockLevel <= p.reorderPoint).length > maxItems && (
        <div className="p-3 border-t border-gray-100 text-center">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all low stock items
          </button>
        </div>
      )}
    </div>
  );
}
