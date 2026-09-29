import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon?: ReactNode;
  className?: string;
}

export function KPICard({ title, value, subtitle, trend, icon, className = '' }: KPICardProps) {
  let trendIcon: ReactNode = null;
  let trendClass = '';
  
  if (trend) {
    if (trend.value > 0) {
      trendIcon = <TrendingUp className="h-3.5 w-3.5" />;
      trendClass = 'text-green-400';
    } else if (trend.value < 0) {
      trendIcon = <TrendingDown className="h-3.5 w-3.5" />;
      trendClass = 'text-red-400';
    } else {
      trendIcon = <Minus className="h-3.5 w-3.5" />;
      trendClass = 'text-ash';
    }
  }

  return (
    <div className={`bg-card-carbon border border-steel-border rounded-[8px] p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm text-ash">{title}</p>
          <p className="mt-2 text-heading font-semibold text-white">{value}</p>
          {subtitle && <p className="mt-1 text-body-sm text-ash">{subtitle}</p>}
        </div>
        {icon && <div className="text-blue-cornflower">{icon}</div>}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-body-sm font-medium">
          <span className={trendClass}>{trendIcon}</span>
          <span className={trendClass}>{Math.abs(trend.value)}%</span>
          <span className="text-ash">{trend.label}</span>
        </div>
      )}
    </div>
  );
}