import React from 'react';

export const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-brand-muted">{label}</label>}
    <input
      className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                 text-brand-text placeholder:text-brand-hint
                 focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light
                 transition-colors"
      {...props}
    />
  </div>
);
