'use client';

import React, { useState, useCallback, useRef } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge, EmptyState } from '@/components/ui-components';
import { mockWorkflows } from '@/lib/mock-data';
import { formatRelativeTime, getStatusColor, generateId } from '@/lib/utils';

type NodeType = 'trigger' | 'condition' | 'action' | 'ai' | 'notification';

interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  config?: string;
}

interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

const NODE_CONFIG: Record<NodeType, { color: string; icon: string; bg: string }> = {
  trigger: { color: '#06B6D4', icon: '⚡', bg: 'rgba(6,182,212,0.1)' },
  condition: { color: '#F59E0B', icon: '🔀', bg: 'rgba(245,158,11,0.1)' },
  action: { color: '#3B82F6', icon: '▶', bg: 'rgba(59,130,246,0.1)' },
  ai: { color: '#00E676', icon: '🤖', bg: 'rgba(0,230,118,0.1)' },
  notification: { color: '#8B5CF6', icon: '🔔', bg: 'rgba(139,92,246,0.1)' },
};

const TEMPLATES = [
  { id: 'churn', name: 'Churn Prevention', nodes: 6, description: 'Detect and intervene with at-risk customers' },
  { id: 'onboarding', name: 'Customer Onboarding', nodes: 8, description: 'Automated welcome and activation sequence' },
  { id: 'lead-scoring', name: 'Lead Scoring', nodes: 5, description: 'AI-powered lead qualification pipeline' },
  { id: 'win-back', name: 'Win-back Campaign', nodes: 7, description: 'Re-engage churned customers automatically' },
];

const defaultNodes: WorkflowNode[] = [
  { id: 'n1', type: 'trigger', label: 'Churn Score > 70', x: 300, y: 60, config: 'Trigger when AI model detects high churn risk' },
  { id: 'n2', type: 'condition', label: 'Days Inactive?', x: 300, y: 160, config: 'Check if customer was active in last 30 days' },
  { id: 'n3', type: 'ai', label: 'Generate Message', x: 160, y: 265, config: 'AI generates personalized retention message' },
  { id: 'n4', type: 'action', label: 'Send Email', x: 160, y: 370, config: 'Deliver via SendGrid with tracking' },
  { id: 'n5', type: 'action', label: 'CRM Update', x: 440, y: 265, config: 'Flag in Salesforce for SDR follow-up' },
  { id: 'n6', type: 'notification', label: 'Alert Sales Rep', x: 440, y: 370, config: 'Slack notification to account owner' },
];

const defaultEdges: WorkflowEdge[] = [
  { id: 'e1', from: 'n1', to: 'n2' },
  { id: 'e2', from: 'n2', to: 'n3', label: '< 30 days' },
  { id: 'e3', from: 'n2', to: 'n5', label: '>= 30 days' },
  { id: 'e4', from: 'n3', to: 'n4' },
  { id: 'e5', from: 'n5', to: 'n6' },
];

function WorkflowNodeComponent({ node, isSelected, onSelect }: { node: WorkflowNode; isSelected: boolean; onSelect: (id: string) => void }) {
  const cfg = NODE_CONFIG[node.type];
  return (
    <g transform={`translate(${node.x}, ${node.y})`} onClick={() => onSelect(node.id)} style={{ cursor: 'pointer' }}>
      <rect x={-80} y={-24} width={160} height={48} rx={10} fill={isSelected ? cfg.color + '20' : cfg.bg} stroke={isSelected ? cfg.color : cfg.color + '50'} strokeWidth={isSelected ? 2 : 1} />
      {isSelected && <rect x={-82} y={-26} width={164} height={52} rx={11} fill="none" stroke={cfg.color} strokeWidth={0.5} opacity={0.5} />}
      <text x={-60} y={4} fill={cfg.color} fontSize={14}>{cfg.icon}</text>
      <text x={-40} y={5} fill="#F9FAFB" fontSize={11} fontWeight={600} fontFamily="Inter, sans-serif">{node.label}</text>
      {/* Port */}
      <circle cx={0} cy={-24} r={4} fill={cfg.color} opacity={0.6} />
      <circle cx={0} cy={24} r={4} fill={cfg.color} opacity={0.6} />
    </g>
  );
}

function EdgeComponent({ edge, nodes }: { edge: WorkflowEdge; nodes: WorkflowNode[] }) {
  const fromNode = nodes.find(n => n.id === edge.from);
  const toNode = nodes.find(n => n.id === edge.to);
  if (!fromNode || !toNode) return null;
  const x1 = fromNode.x, y1 = fromNode.y + 24;
  const x2 = toNode.x, y2 = toNode.y - 24;
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <path d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} markerEnd="url(#arrow)" />
      {edge.label && (
        <text x={(x1 + x2) / 2} y={midY} textAnchor="middle" fill="#9CA3AF" fontSize={10} dy={-4} fontFamily="Inter, sans-serif">{edge.label}</text>
      )}
    </g>
  );
}

export default function WorkflowsPage() {
  const [activeView, setActiveView] = useState<'list' | 'builder'>('list');
  const [nodes, setNodes] = useState<WorkflowNode[]>(defaultNodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(defaultEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [builderName, setBuilderName] = useState('Churn Prevention v2');

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  const addNode = (type: NodeType) => {
    const newNode: WorkflowNode = {
      id: generateId(),
      type,
      label: `New ${type} node`,
      x: 200 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    };
    setNodes(prev => [...prev, newNode]);
  };

  return (
    <AppLayout title="Workflow Builder" subtitle="Visual automation without code" actions={
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setActiveView(v => v === 'list' ? 'builder' : 'list')} className="btn-ghost">
          {activeView === 'list' ? '+ New Workflow' : '← Back to List'}
        </button>
        {activeView === 'builder' && <button className="btn-primary">▶ Deploy</button>}
      </div>
    }>
      {activeView === 'list' ? (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Templates */}
          <div>
            <SectionHeader title="Quick Templates" subtitle="Start from a proven workflow" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
              {TEMPLATES.map(t => (
                <div key={t.id} onClick={() => setActiveView('builder')} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,230,118,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.375rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.625rem', lineHeight: 1.5 }}>{t.description}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)' }}>{t.nodes} nodes</div>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Workflows */}
          <div>
            <SectionHeader title="Active Workflows" subtitle={`${mockWorkflows.filter(w => w.status === 'active').length} running`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockWorkflows.map(wf => (
                <div key={wf.id} className="card" style={{ cursor: 'pointer', padding: '1rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', alignItems: 'center', gap: '1rem', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getStatusColor(wf.status), boxShadow: `0 0 6px ${getStatusColor(wf.status)}` }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{wf.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{wf.trigger} · {wf.nodes} nodes · Last run {formatRelativeTime(wf.lastRun)}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800 }}>{wf.runs.toLocaleString()}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>runs</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: wf.successRate > 95 ? '#22C55E' : wf.successRate > 80 ? '#F59E0B' : '#EF4444' }}>{wf.successRate}%</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>success</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => setActiveView('builder')} style={{ padding: '0.375rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--color-muted)' }}>Edit</button>
                    <span style={{ background: getStatusColor(wf.status) + '15', color: getStatusColor(wf.status), border: `1px solid ${getStatusColor(wf.status)}35`, borderRadius: '999px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>{wf.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Visual Builder */
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', height: 'calc(100vh - 56px)' }}>
          {/* Node Palette */}
          <div style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Drag to Canvas</div>
            {(Object.entries(NODE_CONFIG) as [NodeType, typeof NODE_CONFIG[NodeType]][]).map(([type, cfg]) => (
              <button key={type} onClick={() => addNode(type)} style={{ padding: '0.625rem 0.875rem', background: cfg.bg, border: `1px solid ${cfg.color}40`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.625rem', transition: 'all 0.15s', textAlign: 'left' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = cfg.color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = cfg.color + '40')}
              >
                <span style={{ fontSize: '1rem' }}>{cfg.icon}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: cfg.color, textTransform: 'capitalize' }}>{type}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>Click to add</div>
                </div>
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div style={{ background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>
            <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
            {/* Canvas header */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 10 }}>
              <input value={builderName} onChange={e => setBuilderName(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.375rem 0.75rem', color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit', outline: 'none' }} />
              <Badge variant="success">6 nodes</Badge>
              <Badge variant="primary">Unsaved</Badge>
            </div>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(255,255,255,0.2)" />
                </marker>
              </defs>
              {edges.map(e => <EdgeComponent key={e.id} edge={e} nodes={nodes} />)}
              {nodes.map(n => <WorkflowNodeComponent key={n.id} node={n} isSelected={selectedNode === n.id} onSelect={setSelectedNode} />)}
            </svg>
          </div>

          {/* Properties Panel */}
          <div style={{ background: 'var(--bg-sidebar)', borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', overflow: 'auto' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>Node Properties</div>
            {selectedNodeData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 700, marginBottom: '0.375rem', textTransform: 'uppercase' }}>Type</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: NODE_CONFIG[selectedNodeData.type].bg, border: `1px solid ${NODE_CONFIG[selectedNodeData.type].color}40`, borderRadius: '6px', padding: '0.25rem 0.625rem', fontSize: '0.8rem', color: NODE_CONFIG[selectedNodeData.type].color }}>
                    {NODE_CONFIG[selectedNodeData.type].icon} {selectedNodeData.type}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 700, marginBottom: '0.375rem', textTransform: 'uppercase' }}>Label</div>
                  <input value={selectedNodeData.label} onChange={e => setNodes(prev => prev.map(n => n.id === selectedNodeData.id ? { ...n, label: e.target.value } : n))} className="input" style={{ fontSize: '0.85rem' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 700, marginBottom: '0.375rem', textTransform: 'uppercase' }}>Configuration</div>
                  <textarea value={selectedNodeData.config || ''} onChange={e => setNodes(prev => prev.map(n => n.id === selectedNodeData.id ? { ...n, config: e.target.value } : n))} className="input" style={{ fontSize: '0.85rem', minHeight: '80px', resize: 'vertical', lineHeight: 1.5 }} />
                </div>
                <button onClick={() => { setNodes(prev => prev.filter(n => n.id !== selectedNodeData.id)); setSelectedNode(null); }} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.82rem' }}>🗑 Delete Node</button>
              </div>
            ) : (
              <EmptyState icon="🖱️" title="No node selected" description="Click a node in the canvas to edit its properties" />
            )}

            {/* Workflow stats */}
            <div style={{ marginTop: '2rem', padding: '0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>Workflow Stats</div>
              {[['Nodes', nodes.length], ['Edges', edges.length], ['Estimated time', '~2.4s'], ['Cost/run', '$0.003']].map(([k, v]) => (
                <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--color-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
