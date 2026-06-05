'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge, EmptyState } from '@/components/ui-components';
import { mockIntegrations } from '@/lib/mock-data';
import { getStatusColor } from '@/lib/utils';

type NodeType = 'source' | 'transform' | 'destination' | 'filter';

interface CanvasNode {
  id: string;
  type: NodeType;
  label: string;
  icon: string;
  x: number;
  y: number;
  status?: string;
}

const NODE_STYLES: Record<NodeType, { color: string; bg: string }> = {
  source: { color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
  transform: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  destination: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  filter: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
};

const defaultCanvas: CanvasNode[] = [
  { id: 'c1', type: 'source', label: 'Shopify', icon: '🛍️', x: 80, y: 200 },
  { id: 'c2', type: 'source', label: 'Stripe', icon: '💳', x: 80, y: 310 },
  { id: 'c3', type: 'filter', label: 'Filter: Amount > $100', icon: '🔀', x: 280, y: 255 },
  { id: 'c4', type: 'transform', label: 'Enrich Customer', icon: '⚙️', x: 480, y: 200 },
  { id: 'c5', type: 'transform', label: 'Map Fields', icon: '🗺️', x: 480, y: 310 },
  { id: 'c6', type: 'destination', label: 'Salesforce CRM', icon: '☁️', x: 680, y: 200 },
  { id: 'c7', type: 'destination', label: 'AI Agents', icon: '🤖', x: 680, y: 310 },
];

const canvasEdges = [
  { from: 'c1', to: 'c3' }, { from: 'c2', to: 'c3' },
  { from: 'c3', to: 'c4' }, { from: 'c3', to: 'c5' },
  { from: 'c4', to: 'c6' }, { from: 'c5', to: 'c7' },
];

const availableConnectors = [
  { name: 'Shopify', icon: '🛍️', category: 'E-commerce' },
  { name: 'Salesforce', icon: '☁️', category: 'CRM' },
  { name: 'Stripe', icon: '💳', category: 'Payments' },
  { name: 'HubSpot', icon: '🎯', category: 'Marketing' },
  { name: 'Segment', icon: '📊', category: 'Analytics' },
  { name: 'BigQuery', icon: '🗄️', category: 'Database' },
  { name: 'Slack', icon: '💬', category: 'Notifications' },
  { name: 'SendGrid', icon: '📧', category: 'Email' },
  { name: 'Postgres', icon: '🐘', category: 'Database' },
  { name: 'Webhook', icon: '🔗', category: 'Custom' },
];

function IntegrationNode({ node, isSelected, onClick }: { node: CanvasNode; isSelected: boolean; onClick: () => void }) {
  const style = NODE_STYLES[node.type];
  return (
    <g transform={`translate(${node.x}, ${node.y})`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <rect x={-56} y={-30} width={112} height={60} rx={10} fill={style.bg} stroke={isSelected ? style.color : style.color + '50'} strokeWidth={isSelected ? 2 : 1} />
      <text x={-36} y={4} fill={style.color} fontSize={16} textAnchor="middle">{node.icon}</text>
      <text x={10} y={-6} fill="#F9FAFB" fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif">{node.label}</text>
      <text x={10} y={10} fill="#6B7280" fontSize={9} fontFamily="Inter, sans-serif" textTransform="capitalize">{node.type}</text>
      {/* Ports */}
      <circle cx={-56} cy={0} r={4} fill={style.color} opacity={0.7} />
      <circle cx={56} cy={0} r={4} fill={style.color} opacity={0.7} />
    </g>
  );
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'connectors'>('canvas');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodes] = useState<CanvasNode[]>(defaultCanvas);

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <AppLayout title="Integration Builder" subtitle="Visual data pipeline canvas" actions={
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn-ghost">Import Schema</button>
        <button className="btn-primary">Deploy Pipeline</button>
      </div>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
        {/* Tabs */}
        <div style={{ padding: '0 1.5rem', display: 'flex', gap: '0.375rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {[{ id: 'canvas', label: '🗺️ Visual Canvas' }, { id: 'connectors', label: '🔌 Connectors' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as 'canvas' | 'connectors')} style={{
              padding: '0.75rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600, color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-muted)',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'transparent'}`,
              marginBottom: '-1px', transition: 'all 0.15s',
            }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'canvas' && (
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 260px', flex: 1, overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1rem', overflow: 'auto' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Node Types</div>
              {(Object.entries(NODE_STYLES) as [NodeType, typeof NODE_STYLES[NodeType]][]).map(([type, s]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: '6px', background: s.bg, border: `1px solid ${s.color}30`, marginBottom: '0.4rem', cursor: 'pointer' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: '0.8rem', color: s.color, fontWeight: 600, textTransform: 'capitalize' }}>{type}</span>
                </div>
              ))}
              <div style={{ marginTop: '1.5rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Pipeline Stats</div>
              {[['Nodes', '7'], ['Connections', '6'], ['Data/hr', '2.4M'], ['Errors', '0']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--color-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Canvas */}
            <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-primary)' }}>
              <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.25 }} />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                <Badge variant="success">● Live</Badge>
                <Badge variant="info">6 active connections</Badge>
              </div>
              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                <defs>
                  <marker id="intArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(255,255,255,0.2)" />
                  </marker>
                </defs>
                {canvasEdges.map((e, i) => {
                  const from = nodes.find(n => n.id === e.from);
                  const to = nodes.find(n => n.id === e.to);
                  if (!from || !to) return null;
                  const midX = (from.x + to.x) / 2;
                  return (
                    <path key={i} d={`M ${from.x + 56} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x - 56} ${to.y}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} markerEnd="url(#intArrow)" />
                  );
                })}
                {nodes.map(n => <IntegrationNode key={n.id} node={n} isSelected={selectedNode === n.id} onClick={() => setSelectedNode(selectedNode === n.id ? null : n.id)} />)}
              </svg>
            </div>

            {/* Properties */}
            <div style={{ background: 'var(--bg-sidebar)', borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', overflow: 'auto' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>Node Properties</div>
              {selectedNodeData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ padding: '0.75rem', background: NODE_STYLES[selectedNodeData.type].bg, border: `1px solid ${NODE_STYLES[selectedNodeData.type].color}30`, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{selectedNodeData.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{selectedNodeData.label}</div>
                      <div style={{ fontSize: '0.72rem', color: NODE_STYLES[selectedNodeData.type].color, textTransform: 'capitalize' }}>{selectedNodeData.type}</div>
                    </div>
                  </div>
                  {[['API Endpoint', 'https://api.shopify.com/v1'], ['Auth Type', 'OAuth 2.0'], ['Sync Mode', 'Real-time'], ['Field Mapping', 'Auto-detected']].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{k}</div>
                      <div style={{ fontSize: '0.83rem', color: 'var(--color-text)', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '0.375rem 0.625rem', fontFamily: k === 'API Endpoint' ? 'monospace' : 'inherit' }}>{v}</div>
                    </div>
                  ))}
                  <div style={{ padding: '0.625rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', fontSize: '0.78rem', color: '#22C55E' }}>
                    ✓ Connection healthy · Last sync 2m ago
                  </div>
                </div>
              ) : (
                <EmptyState icon="🔗" title="Select a node" description="Click any node in the canvas to view its configuration" />
              )}
            </div>
          </div>
        )}

        {activeTab === 'connectors' && (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
            <SectionHeader title="Connected Integrations" subtitle={`${mockIntegrations.filter(i => i.status === 'connected').length} active`} action={<button className="btn-primary">+ Add Integration</button>} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {mockIntegrations.map(int => (
                <div key={int.id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{int.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{int.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{int.category}</div>
                    </div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(int.status), boxShadow: `0 0 6px ${getStatusColor(int.status)}` }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    {[['Sync Rate', int.syncRate], ['Last Sync', int.lastSync], ['Records', int.records.toLocaleString()], ['Status', int.status]].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                        <div style={{ fontSize: '0.83rem', fontWeight: 600, color: k === 'Status' ? getStatusColor(String(v)) : 'var(--color-text)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ flex: 1, padding: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--color-muted)' }}>Configure</button>
                    <button style={{ flex: 1, padding: '0.4rem', background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--color-primary)' }}>Sync Now</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Available Connectors */}
            <SectionHeader title="Add New Connector" subtitle="200+ integrations available" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {availableConnectors.map(c => (
                <div key={c.name} style={{ padding: '0.875rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,230,118,0.25)'; e.currentTarget.style.background = 'rgba(0,230,118,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{c.icon}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>{c.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
