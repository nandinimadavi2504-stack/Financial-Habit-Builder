import { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: { value: string; up: boolean };
  accent?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'error' | 'warning';
  subtitle?: string;
}

const accentMap = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400',
  secondary: 'bg-secondary-50 text-secondary-600 dark:bg-secondary-500/10 dark:text-secondary-400',
  accent: 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400',
  info: 'bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400',
  success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
  error: 'bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400',
};

export default function StatCard({ title, value, icon, trend, accent = 'primary', subtitle }: StatCardProps) {
  return (
    <div className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-white font-display tracking-tight">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>
        <div className={classNames('p-2.5 rounded-xl shrink-0', accentMap[accent])}>{icon}</div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={classNames('font-semibold', trend.up ? 'text-success-600' : 'text-error-500')}>
            {trend.up ? '▲' : '▼'} {trend.value}
          </span>
          <span className="text-slate-400 dark:text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
}
