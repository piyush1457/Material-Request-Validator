import type { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium font-sans font-medium rounded-[8px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-page-ink disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-white text-page-ink hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-page-ink',
    secondary: 'bg-transparent border border-graphite text-white hover:bg-white/5 active:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-page-ink',
    ghost: 'bg-transparent text-white hover:bg-white/5 active:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-page-ink',
    danger: 'bg-transparent border border-danger text-danger hover:bg-danger/10 active:bg-danger/20 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-page-ink',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-body-sm gap-1.5',
    md: 'px-4 py-2.5 text-body gap-2',
    lg: 'px-6 py-3 text-subheading gap-2',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}