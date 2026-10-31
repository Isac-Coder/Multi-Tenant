import React from 'react';

// variants: primary | secondary | ghost | danger
export const Button = ({ variant = 'secondary', size = 'md', children, className = '', ...props }: any) => {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-lg transition-all';
  const sizes: any = { sm: 'px-2.5 py-1 text-xs', md: 'px-3.5 py-1.5 text-sm', lg: 'px-4 py-2 text-sm' };
  const variants: any = {
    primary:   'bg-accent text-white border border-accent hover:opacity-90',
    secondary: 'bg-surface-2 text-brand-text border border-brand-border-strong hover:bg-surface-1',
    ghost:     'bg-transparent text-brand-muted border-transparent hover:bg-surface-1 hover:text-brand-text',
    danger:    'bg-danger-bg text-danger border border-red-200',
  };
  
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};
