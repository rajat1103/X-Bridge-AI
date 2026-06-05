'use client';

import React, { useState, useEffect, useRef } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import { usePlatformStore } from '@/lib/store';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onCommandPalette?: () => void;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, onCommandPalette, actions }: TopbarProps) {
  const [time, setTime] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAllRead } = usePlatformStore();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const NOTIF_COLORS = {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  };

  const NOTIF_ICONS = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <header style={{
      height: '56px',
      background: 'rgba(17,24,39,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
      gap: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </h1>
          {subtitle && (
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              — {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Actions slot */}
      {actions && <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>{actions}</div>}

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', flexShrink: 0 }}>
        {/* Clock */}
        <div style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--color-muted)', letterSpacing: '0.03em' }}>
          {time}
        </div>

        {/* System status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '999px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E', animation: 'pulse-glow 2s infinite' }} />
          <span style={{ fontSize: '0.72rem', color: '#22C55E', fontWeight: 600 }}>All Systems Nominal</span>
        </div>

        {/* Search button */}
        <button
          onClick={onCommandPalette}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.375rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '0.78rem', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,230,118,0.3)'; e.currentTarget.style.color = 'var(--color-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--color-muted)'; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span>Search</span>
          <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', padding: '0 4px', fontSize: '0.65rem', fontFamily: 'monospace' }}>⌘K</span>
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs && unreadCount > 0) markAllRead(); }}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: '0.375rem', borderRadius: '8px', transition: 'all 0.15s', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--color-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-muted)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount > 0 && (
              <div style={{ position: 'absolute', top: '1px', right: '1px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-error)', border: '2px solid var(--bg-sidebar)', boxSizing: 'content-box' }} />
            )}
          </button>

          {showNotifs && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: '360px', background: '#161f2e',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)', overflow: 'hidden', zIndex: 1000,
              animation: 'fadeIn 0.15s ease',
            }}>
              <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notifications</span>
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--color-primary)' }}>Mark all read</button>
              </div>
              <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.875rem' }}>No notifications</div>
                ) : notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '0.875rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                    background: n.read ? 'transparent' : 'rgba(255,255,255,0.02)',
                    transition: 'background 0.15s',
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      background: `${NOTIF_COLORS[n.type]}18`,
                      border: `1px solid ${NOTIF_COLORS[n.type]}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', color: NOTIF_COLORS[n.type], fontWeight: 700,
                    }}>
                      {NOTIF_ICONS[n.type]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.83rem', fontWeight: 600, marginBottom: '2px', color: n.read ? 'var(--color-muted)' : 'var(--color-text)' }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', lineHeight: 1.4, marginBottom: '4px' }}>{n.message}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-muted-dim)' }}>{formatRelativeTime(n.timestamp)}</div>
                    </div>
                    {!n.read && (
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: '4px' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white', cursor: 'pointer', flexShrink: 0, border: '2px solid rgba(139,92,246,0.4)', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          AE
        </div>
      </div>
    </header>
  );
}
