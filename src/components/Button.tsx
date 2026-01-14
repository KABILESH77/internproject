import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] active:bg-[var(--color-primary-800)] focus:ring-[var(--color-primary-500)]',
    secondary: 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-300)] active:bg-[var(--color-neutral-400)] focus:ring-[var(--color-neutral-500)]',
    outline: 'bg-transparent border-2 border-[var(--color-primary-600)] text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] active:bg-[var(--color-primary-100)] focus:ring-[var(--color-primary-500)]',
    ghost: 'bg-transparent text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)] active:bg-[var(--color-neutral-200)] focus:ring-[var(--color-neutral-400)]',
    accent: 'bg-[var(--color-accent-500)] text-white hover:bg-[var(--color-accent-600)] active:bg-[var(--color-accent-700)] focus:ring-[var(--color-accent-400)]'
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
    </button>
  );
}
