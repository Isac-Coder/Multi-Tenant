import * as React from "react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-xs font-medium text-brand-muted">{label}</label>}
        <select
          className={`w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                     text-brand-text focus:outline-none focus:border-accent-mid focus:ring-2
                     focus:ring-accent-light transition-colors ${className}`}
          ref={ref}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
