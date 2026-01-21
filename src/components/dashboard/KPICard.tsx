'use client';

import React from 'react';
import { KPIData } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

interface KPICardProps {
  data: KPIData;
  icon?: React.ReactNode;
  className?: string;
}

export default function KPICard({ data, icon, className }: KPICardProps) {
  const formatValue = () => {
    if (data.prefix === '$') {
      return formatCurrency(data.value);
    }
    return `${data.prefix || ''}${formatNumber(data.value)}${data.suffix || ''}`;
  };

  const TrendIcon = data.changeType === 'increase' 
    ? TrendingUp 
    : data.changeType === 'decrease' 
      ? TrendingDown 
      : Minus;

  return (
    <div className={clsx('bg-white rounded-xl p-6 shadow-sm border border-gray-100', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{data.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatValue()}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendIcon
              className={clsx(
                'w-4 h-4',
                data.changeType === 'increase' && 'text-green-500',
                data.changeType === 'decrease' && 'text-red-500',
                data.changeType === 'neutral' && 'text-gray-400'
              )}
            />
            <span
              className={clsx(
                'text-sm font-medium',
                data.changeType === 'increase' && 'text-green-600',
                data.changeType === 'decrease' && 'text-red-600',
                data.changeType === 'neutral' && 'text-gray-500'
              )}
            >
              {Math.abs(data.change)}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 rounded-xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
