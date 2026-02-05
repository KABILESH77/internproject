import React from 'react';

export type BadgeVariant = 'beginner' | 'remote' | 'stipend' | 'verified' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantInlineStyles: Record<BadgeVariant, React.CSSProperties> = {
  beginner: { backgroundColor: '#22c55e', color: 'white', border: '1px solid #22c55e' },
  remote: { backgroundColor: '#0d9494', color: 'white', border: '1px solid #0d9494' },
  stipend: { backgroundColor: '#ff9500', color: 'white', border: '1px solid #ff9500' },
  verified: { backgroundColor: '#b3e6e6', color: '#043b3b', border: '1px solid #0d9494' },
  default: { backgroundColor: '#f5f5f5', color: '#404040', border: '1px solid #a3a3a3' }
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        ...variantInlineStyles[variant]
      }}
      className={className}
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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        backgroundColor: '#f5f5f5',
        color: '#404040',
        fontSize: '14px'
      }}
      className={className}
      role="note"
    >
      {icon && <span style={{ flexShrink: 0 }} aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
