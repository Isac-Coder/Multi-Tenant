import React from 'react';

interface ProgressBarProps {
  value: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = 'bg-accent-mid' }) => (
  <div className="h-1 bg-brand-border rounded-full overflow-hidden">
    <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
  </div>
);
