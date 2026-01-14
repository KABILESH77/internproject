import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function AnalyticsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBgColor = 'var(--color-primary-100)',
  iconColor = 'var(--color-primary-600)'
}: AnalyticsCardProps) {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) {
      return <Minus className="w-4 h-4" aria-hidden="true" />;
    }
    return change > 0 
      ? <TrendingUp className="w-4 h-4" aria-hidden="true" />
      : <TrendingDown className="w-4 h-4" aria-hidden="true" />;
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) {
      return 'text-[var(--color-neutral-600)]';
    }
    return change > 0 
      ? 'text-[var(--color-success-600)]'
      : 'text-[var(--color-error-600)]';
  };

  return (
    <div className="bg-white rounded-xl border-2 border-[var(--color-neutral-200)] p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-[var(--color-neutral-600)] text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-[var(--color-neutral-900)]">{value}</p>
        </div>
        {icon && (
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: iconBgColor }}
            aria-hidden="true"
          >
            <div style={{ color: iconColor }}>
              {icon}
            </div>
          </div>
        )}
      </div>

      {(change !== undefined || changeLabel) && (
        <div className={`flex items-center gap-1.5 text-sm ${getTrendColor()}`}>
          {change !== undefined && (
            <>
              {getTrendIcon()}
              <span className="font-medium">
                {change > 0 ? '+' : ''}{change}%
              </span>
            </>
          )}
          {changeLabel && (
            <span className="text-[var(--color-neutral-600)]">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
