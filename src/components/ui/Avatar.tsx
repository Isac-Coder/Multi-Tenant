import React from 'react';

interface AvatarProps {
  initials: string;
  color?: 'purple' | 'teal' | 'accent' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ initials, color = 'purple', size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6 text-[10px]', md: 'w-[30px] h-[30px] text-[11px]', lg: 'w-11 h-11 text-[14px]' };
  const colors = {
    purple: 'bg-purple-bg text-purple',
    teal:   'bg-teal-bg text-teal',
    accent: 'bg-accent-light text-accent',
    warning:'bg-warning-bg text-warning',
    danger: 'bg-danger-bg text-danger',
  };
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
};
