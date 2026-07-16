import { ReactNode } from 'react';
import { classNames } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'info';
  height?: string;
}

const colorMap = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  accent: 'bg-accent-500',
  success: 'bg-success-500',
  info: 'bg-info-500',
};

export default function ProgressBar({
  value, max = 100, className, showLabel = false, color = 'primary', height = 'h-2.5',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{pct.toFixed(0)}%</span>
          <span>{max === 100 ? '' : `${value} / ${max}`}</span>
        </div>
      )}
      <div className={classNames('w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden', height)}>
        <div
          className={classNames('h-full rounded-full transition-all duration-700 ease-out', colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'info' | 'warning' | 'error' | 'slate';
  size?: 'sm' | 'md';
}

const badgeColorMap = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300',
  secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-500/15 dark:text-secondary-300',
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300',
  success: 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300',
  info: 'bg-info-100 text-info-700 dark:bg-info-500/15 dark:text-info-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
  error: 'bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export function Badge({ children, color = 'slate', size = 'sm' }: BadgeProps) {
  return (
    <span className={classNames(
      'inline-flex items-center gap-1 rounded-full font-semibold',
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      badgeColorMap[color],
    )}>
      {children}
    </span>
  );
}
