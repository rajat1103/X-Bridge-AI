'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    group: 'CORE',
    items: [
      { href: '/app/dashboard', label: 'Dashboard', icon: GridIcon, shortcut: 'G D' },
      { href: '/app/command-center', label: 'AI Command Center', icon: BrainIcon, shortcut: 'G A', badge: 'NEW' },
      { href: '/app/agents', label: 'Multi-Agent System', icon: AgentsIcon, shortcut: 'G G' },
    ]
  },
  {
    group: 'INTELLIGENCE',
    items: [
      { href: '/app/customers', label: 'Customer 360', icon: UsersIcon, shortcut: 'G C' },
      { href: '/app/analytics', label: 'Analytics Center', icon: ChartIcon, shortcut: 'G N' },
      { href: '/app/graph', label: 'Knowledge Graph', icon: GraphIcon },
    ]
  },
  {
    group: 'AUTOMATION',
    items: [
      { href: '/app/workflows', label: 'Workflows', icon: FlowIcon, shortcut: 'G W' },
      { href: '/app/integrations', label: 'Integrations', icon: LinkIcon, shortcut: 'G I' },
      { href: '/app/campaigns', label: 'Campaigns', icon: MegaphoneIcon, shortcut: 'G M' },
    ]
  },
  {
    group: 'PLATFORM',
    items: [
      { href: '/app/knowledge', label: 'Knowledge Base', icon: BookIcon, shortcut: 'G K' },
      { href: '/app/monitoring', label: 'Monitoring', icon: MonitorIcon, shortcut: 'G O', badge: '1' },
      { href: '/app/settings', label: 'Settings', icon: SettingsIcon },
    ]
  }
];

function GridIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}
function BrainIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.66Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.66Z"/></svg>;
}
function UsersIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function ChartIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function GraphIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/><line x1="7" y1="19" x2="17" y2="19"/></svg>;
}
function FlowIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/><rect x="16" y="16" width="5" height="5" rx="1"/><rect x="3" y="16" width="5" height="5" rx="1"/><path d="M8 5.5h8M18.5 8v8M16 18.5H8M5.5 16V8"/></svg>;
}
function LinkIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
}
function MegaphoneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="m3 11 19-9-9 19-2-8-8-2z"/></svg>;
}
function BookIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}
function MonitorIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
}
function AgentsIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="8" r="3"/><path d="M6.8 21a6 6 0 0 1 10.4 0"/><circle cx="4" cy="13" r="2"/><path d="M2 21a4 4 0 0 1 6.4-3.2"/><circle cx="20" cy="13" r="2"/><path d="M21.6 21a4 4 0 0 0-6.4-3.2"/></svg>;
}
function SettingsIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}


interface SidebarProps {
  onCommandPalette: () => void;
}

export function Sidebar({ onCommandPalette }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? '64px' : '240px',
        minHeight: '100vh',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #00E676 0%, #00BCD4 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: '1rem', fontWeight: 800, color: '#000',
          boxShadow: '0 4px 12px rgba(0, 230, 118, 0.4)',
        }}>X</div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>X-Bridge</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-primary)', letterSpacing: '0.1em', fontWeight: 600 }}>AI PLATFORM</div>
          </div>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/> : <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Search / Command */}
      {!collapsed && (
        <div style={{ padding: '0.75rem' }}>
          <button
            onClick={onCommandPalette}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: 'pointer', color: 'var(--color-muted)', fontSize: '0.8rem', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).closest('button')!.style.borderColor = 'rgba(0, 230, 118, 0.3)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).closest('button')!.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span style={{ flex: 1, textAlign: 'left' }}>Search...</span>
            <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', padding: '1px 5px', fontSize: '0.65rem', fontFamily: 'monospace' }}>⌘K</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(group => (
          <div key={group.group} style={{ marginBottom: '0.75rem' }}>
            {!collapsed && (
              <div style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-muted-dim)', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>
                {group.group}
              </div>
            )}
            {group.items.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: collapsed ? '0.75rem' : '0.5rem 0.625rem',
                    borderRadius: '8px', textDecoration: 'none',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: isActive ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(0, 230, 118, 0.2)' : 'transparent'}`,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.background = 'rgba(255,255,255,0.05)';
                      el.style.color = 'var(--color-text)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      const el = e.currentTarget;
                      el.style.background = 'transparent';
                      el.style.color = 'var(--color-muted)';
                    }
                  }}
                >
                  {isActive && !collapsed && (
                    <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '16px', background: 'var(--color-primary)', borderRadius: '0 3px 3px 0' }} />
                  )}
                  <Icon />
                  {!collapsed && (
                    <span style={{ fontSize: '0.845rem', fontWeight: isActive ? 600 : 400, flex: 1 }}>{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span style={{
                      background: item.badge === '1' ? 'var(--color-error)' : 'var(--color-primary-dim)',
                      color: item.badge === '1' ? 'white' : 'var(--color-primary)',
                      borderRadius: '999px', padding: '1px 6px', fontSize: '0.65rem', fontWeight: 700,
                      border: item.badge === '1' ? 'none' : '1px solid rgba(0,230,118,0.3)',
                    }}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom user section */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>AE</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Alex Engineer</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>Enterprise Admin</div>
            </div>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)', flexShrink: 0 }} />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>AE</div>
          </div>
        )}
      </div>
    </aside>
  );
}
