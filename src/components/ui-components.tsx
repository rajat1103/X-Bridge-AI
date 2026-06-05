'use client';

import React from 'react';
import { formatNumber, formatPercent, getStatusColor } from '@/lib/utils';

interface KPICardProps {
  label: string;
  value: number | string;
  change?: number;
  format?: 'number' | 'currency' | 'percent' | 'raw';
  icon?: React.ReactNode;
  color?: string;
  suffix?: string;
  subtitle?: string;
  sparkline?: number[];
}

export function KPICard({ label, value, change, format = 'number', icon, color = 'var(--color-primary)', suffix, subtitle, sparkline }: KPICardProps) {
  const isPositive = (change ?? 0) >= 0;
  const displayValue = typeof value === 'number'
    ? format === 'currency' ? `$${formatNumber(value)}`
      : format === 'percent' ? `${value.toFixed(1)}%`
      : format === 'raw' ? value.toString()
      : formatNumber(value)
    : value;

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden', cursor: 'default' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: color, opacity: 0.06, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
        {icon && (
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--color-text)' }}>{displayValue}</span>
        {suffix && <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginLeft: '4px' }}>{suffix}</span>}
      </div>

      {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>{subtitle}</div>}

      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: isPositive ? 'var(--color-success)' : 'var(--color-error)', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {isPositive ? <path d="m18 15-6-6-6 6"/> : <path d="m6 9 6 6 6-6"/>}
            </svg>
            {Math.abs(change).toFixed(1)}%
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>vs last period</span>
        </div>
      )}

      {/* Mini sparkline */}
      {sparkline && sparkline.length > 0 && (
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '80px', height: '40px', opacity: 0.4 }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${sparkline.length * 8} 40`} preserveAspectRatio="none">
            <polyline
              points={sparkline.map((v, i) => {
                const min = Math.min(...sparkline);
                const max = Math.max(...sparkline);
                const normalized = max === min ? 0.5 : (v - min) / (max - min);
                return `${i * 8 + 4},${40 - normalized * 36}`;
              }).join(' ')}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string | number;
  status?: string;
  bar?: number;
}

export function StatRow({ label, value, status, bar }: StatRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {status && <div className="status-dot" style={{ background: getStatusColor(status), boxShadow: `0 0 6px ${getStatusColor(status)}` }} />}
      <span style={{ flex: 1, fontSize: '0.84rem', color: 'var(--color-text)' }}>{label}</span>
      {bar !== undefined && (
        <div style={{ width: '64px' }}>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${bar}%` }} />
          </div>
        </div>
      )}
      <span style={{ fontSize: '0.84rem', fontWeight: 600, color: status ? getStatusColor(status) : 'var(--color-text)', minWidth: '40px', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: subtitle ? '2px' : 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'purple' | 'default' }) {
  const classMap = {
    success: 'badge-success', warning: 'badge-warning', error: 'badge-error',
    info: 'badge-info', primary: 'badge-primary', purple: 'badge-purple', default: 'badge',
  };
  return <span className={`badge ${classMap[variant]}`}>{children}</span>;
}

export function LoadingSkeleton({ lines = 3, height = '16px' }: { lines?: number; height?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height, width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', gap: '0.75rem', textAlign: 'center' }}>
      {icon && <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{icon}</div>}
      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{title}</div>
      {description && <div style={{ fontSize: '0.83rem', color: 'var(--color-muted)', maxWidth: '280px', lineHeight: 1.5 }}>{description}</div>}
      {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
    </div>
  );
}
