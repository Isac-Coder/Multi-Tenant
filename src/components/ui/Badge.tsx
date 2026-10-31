import React from 'react';

// variants: success | danger | accent | purple | teal | warning | neutral
export const Badge = ({ variant = 'neutral', children }: { variant?: 'success' | 'danger' | 'accent' | 'purple' | 'teal' | 'warning' | 'neutral', children: React.ReactNode }) => {
  const styles: any = {
    success: 'bg-success-bg text-success',
    danger:  'bg-danger-bg text-danger',
    accent:  'bg-accent-light text-accent',
    purple:  'bg-purple-bg text-purple',
    teal:    'bg-teal-bg text-teal',
    warning: 'bg-warning-bg text-warning',
    neutral: 'bg-surface-1 text-brand-muted',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};
