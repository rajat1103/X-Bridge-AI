'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const commands: Omit<CommandItem, 'action'>[] = [
  { id: 'dashboard', label: 'Go to Dashboard', description: 'Enterprise overview', icon: '📊', category: 'Navigation', shortcut: 'G D' },
  { id: 'command-center', label: 'AI Command Center', description: 'Run multi-agent tasks', icon: '🤖', category: 'Navigation', shortcut: 'G A' },
  { id: 'agents', label: 'Multi-Agent System', description: 'Manage and monitor AI agents', icon: '🧠', category: 'Navigation', shortcut: 'G G' },
  { id: 'customers', label: 'Customer 360', description: 'Customer intelligence', icon: '👥', category: 'Navigation', shortcut: 'G C' },
  { id: 'analytics', label: 'Analytics Center', description: 'Natural language analytics', icon: '📈', category: 'Navigation', shortcut: 'G N' },
  { id: 'workflows', label: 'Workflow Builder', description: 'Visual automation', icon: '⚡', category: 'Navigation', shortcut: 'G W' },
  { id: 'integrations', label: 'Integration Builder', description: 'Connect data sources', icon: '🔗', category: 'Navigation', shortcut: 'G I' },
  { id: 'campaigns', label: 'Campaign Center', description: 'AI-powered campaigns', icon: '📣', category: 'Navigation', shortcut: 'G M' },
  { id: 'monitoring', label: 'Monitoring Center', description: 'System health & alerts', icon: '🔍', category: 'Navigation', shortcut: 'G O' },
  { id: 'knowledge', label: 'Knowledge Base', description: 'RAG document system', icon: '📚', category: 'Navigation', shortcut: 'G K' },
  { id: 'graph', label: 'Knowledge Graph', description: 'D3 relationship visualization', icon: '🕸️', category: 'Navigation' },
  { id: 'settings', label: 'Settings', description: 'Platform configuration', icon: '⚙️', category: 'Navigation' },
  { id: 'churn-analysis', label: 'Run Churn Analysis', description: 'Analyze at-risk customers', icon: '⚠️', category: 'Actions' },
  { id: 'revenue-report', label: 'Generate Revenue Report', description: 'AI-powered revenue insights', icon: '💰', category: 'Actions' },
  { id: 'create-campaign', label: 'Create AI Campaign', description: 'Launch targeted campaign', icon: '✨', category: 'Actions' },
  { id: 'new-workflow', label: 'New Workflow', description: 'Build automation flow', icon: '➕', category: 'Actions' },
  { id: 'dark-mode', label: 'Toggle Theme', description: 'Switch color scheme', icon: '🌙', category: 'Settings' },
  { id: 'docs', label: 'Documentation', description: 'View platform docs', icon: '📖', category: 'Help' },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const routes: Record<string, string> = {
    'dashboard': '/app/dashboard',
    'command-center': '/app/command-center',
    'agents': '/app/agents',
    'customers': '/app/customers',
    'analytics': '/app/analytics',
    'workflows': '/app/workflows',
    'integrations': '/app/integrations',
    'campaigns': '/app/campaigns',
    'monitoring': '/app/monitoring',
    'knowledge': '/app/knowledge',
    'graph': '/app/graph',
    'settings': '/app/settings',
  };

  const commandItems: CommandItem[] = commands.map(cmd => ({
    ...cmd,
    action: () => {
      if (routes[cmd.id]) router.push(routes[cmd.id]);
      onClose();
    }
  }));

  const filtered = query
    ? commandItems.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commandItems;

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const flat = Object.values(grouped).flat();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, flat.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); flat[selected]?.action(); }
    if (e.key === 'Escape') onClose();
  }, [flat, selected, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="cmd-palette-overlay" onClick={onClose} />
      <div className="cmd-palette animate-fade-in">
        {/* Search input */}
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-muted)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, pages, actions..."
            style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--color-text)', fontSize: '0.9rem', width: '100%', fontFamily: 'inherit' }}
          />
          <span style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>ESC</span>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} style={{ marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.25rem 0.75rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {category}
              </div>
              {items.map((item) => {
                const globalIdx = flat.findIndex(f => f.id === item.id);
                const isSelected = globalIdx === selected;
                return (
                  <div
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelected(globalIdx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.625rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                      background: isSelected ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
                      border: isSelected ? '1px solid rgba(0, 230, 118, 0.2)' : '1px solid transparent',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>{item.label}</div>
                      {item.description && <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '1px' }}>{item.description}</div>}
                    </div>
                    {item.shortcut && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {item.shortcut.split(' ').map((k, i) => (
                          <span key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '1px 6px', fontSize: '0.65rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>{k}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-muted)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
              <div style={{ fontSize: '0.875rem' }}>No results for &quot;{query}&quot;</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '1.5rem', fontSize: '0.7rem', color: 'var(--color-muted)' }}>
          {[['↑↓', 'navigate'], ['↵', 'select'], ['ESC', 'close']].map(([key, label]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '3px', padding: '1px 5px', fontFamily: 'monospace' }}>{key}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
