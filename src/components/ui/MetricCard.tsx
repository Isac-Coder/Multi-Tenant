import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, sub, subColor = 'text-brand-hint' }) => (
  <div className="bg-surface-1 rounded-lg p-3.5 border border-brand-border">
    <p className="text-xs text-brand-muted mb-1">{label}</p>
    <p className="text-[22px] font-medium text-brand-text">{value}</p>
    {sub && <p className={`text-[11px] mt-0.5 ${subColor}`}>{sub}</p>}
  </div>
);
