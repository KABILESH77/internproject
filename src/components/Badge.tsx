import React from 'react';

export type BadgeVariant = 'beginner' | 'remote' | 'stipend' | 'verified' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    beginner: 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[var(--color-success-500)]',
    remote: 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-[var(--color-primary-500)]',
    stipend: 'bg-[var(--color-accent-50)] text-[var(--color-accent-700)] border-[var(--color-accent-500)]',
    verified: 'bg-[var(--color-primary-100)] text-[var(--color-primary-800)] border-[var(--color-primary-600)]',
    default: 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] border-[var(--color-neutral-400)]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
      role="status"
      aria-label={`${variant} badge`}
    >
      {children}
    </span>
  );
}

interface ReasonTagProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ReasonTag({ icon, children, className = '' }: ReasonTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] text-sm ${className}`}
      role="note"
    >
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
