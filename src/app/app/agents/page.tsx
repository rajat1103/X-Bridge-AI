'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge, StatRow } from '@/components/ui-components';
import { mockAgents } from '@/lib/mock-data';
import { getStatusColor, formatNumber } from '@/lib/utils';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

type Agent = typeof mockAgents[0];

// Generate simulated task stream
function generateTaskFeed(agentId: string) {
  const tasks = [
    'Analyzing customer churn signals across 847 records',
    'Running ML inference on lead scoring model',
    'Querying Shopify for order data (last 30 days)',
    'Generating personalized email for segment #3',
    'Syncing data with Salesforce CRM',
    'Searching knowledge base: "churn prevention"',
    'Executing workflow: Customer Onboarding Step 4',
    'Computing revenue attribution for Campaign #12',
    'Detecting anomalies in API latency metrics',
    'Enriching 124 customer profiles from LinkedIn',
  ];
  return tasks[Math.floor(Math.random() * tasks.length)];
}

function generateLatency() {
  return Array.from({ length: 20 }, (_, i) => ({ t: i, v: Math.random() * 100 + 50 }));
}

const AGENT_DESCRIPTIONS: Record<string, string> = {
  master: 'Coordinates the entire agent ecosystem. Receives user instructions, decomposes tasks, delegates to specialist agents, and synthesizes final output. The central intelligence hub.',
  data: 'Connects to all data sources (PostgreSQL, Shopify, Stripe, Salesforce). Executes optimized queries, handles ETL pipelines, and feeds clean data to other agents.',
  analytics: 'Runs ML models for churn prediction, lead scoring, revenue attribution, and anomaly detection. Powered by scikit-learn and custom XGBoost models.',
  campaign: 'Generates AI-personalized campaign content using Gemini Pro. Handles email, WhatsApp, and SMS copy with dynamic variables and A/B variant generation.',
  workflow: 'Automates multi-step business processes. Schedules tasks, manages retries, handles errors, and orchestrates cross-system operations.',
  integration: 'Manages real-time API connections to 200+ external systems. Handles authentication, rate limiting, webhook processing, and data transformation.',
  knowledge: 'RAG-powered document intelligence. Chunks and embeds documents in ChromaDB, performs semantic search, and retrieves relevant context for other agents.',
  monitoring: 'Continuously monitors all platform metrics, detects anomalies, triggers alerts, and maintains system health dashboards in real time.',
  executive: 'Generates board-ready executive reports, investor decks, and strategic summaries by synthesizing data from all other agents.',
};

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(mockAgents[0]);
  const [latencyData, setLatencyData] = useState(generateLatency());
  const [taskFeed, setTaskFeed] = useState<{ id: number; task: string; ts: Date }[]>([
    { id: 1, task: generateTaskFeed(mockAgents[0].id), ts: new Date() },
    { id: 2, task: generateTaskFeed(mockAgents[0].id), ts: new Date(Date.now() - 4000) },
    { id: 3, task: generateTaskFeed(mockAgents[0].id), ts: new Date(Date.now() - 9000) },
  ]);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setLatencyData(prev => [...prev.slice(1), { t: prev[prev.length - 1].t + 1, v: Math.random() * 100 + 50 }]);
      setTaskFeed(prev => [{ id: Date.now(), task: generateTaskFeed(selectedAgent.id), ts: new Date() }, ...prev.slice(0, 9)]);
    }, 2500);
    return () => clearInterval(interval);
  }, [isRunning, selectedAgent.id]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) return (
      <div style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.75rem' }}>
        <span style={{ color: selectedAgent.color }}>{payload[0].value.toFixed(1)}ms</span>
      </div>
    );
    return null;
  };

  return (
    <AppLayout title="Multi-Agent System" subtitle="9 specialized AI agents · Real-time orchestration">
      <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', minHeight: 'calc(100vh - 56px)' }}>

        {/* Agent Roster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
            Agent Fleet — {mockAgents.filter(a => a.status === 'active').length} Active
          </div>
          {mockAgents.map(agent => {
            const isSelected = selectedAgent.id === agent.id;
            const statusColor = getStatusColor(agent.status);
            return (
              <button
                key={agent.id}
                onClick={() => { setSelectedAgent(agent); setLatencyData(generateLatency()); }}
                style={{
                  padding: '0.875rem', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                  background: isSelected ? `${agent.color}10` : 'var(--bg-card)',
                  border: `1px solid ${isSelected ? agent.color + '40' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: `${agent.color}18`,
                  border: `1.5px solid ${agent.color}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 800, color: agent.color,
                  boxShadow: isSelected ? `0 0 12px ${agent.color}40` : 'none',
                }}>
                  {agent.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.83rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? agent.color : 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {agent.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{agent.role}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, boxShadow: agent.status === 'active' ? `0 0 6px ${statusColor}` : 'none' }} />
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>{agent.latency}ms</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Agent Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          {/* Header card */}
          <div className="card" style={{ borderColor: `${selectedAgent.color}30` }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
                background: `${selectedAgent.color}18`, border: `2px solid ${selectedAgent.color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 800, color: selectedAgent.color,
                boxShadow: `0 0 20px ${selectedAgent.color}30`,
              }}>
                {selectedAgent.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedAgent.name}</h2>
                  <span style={{
                    background: `${getStatusColor(selectedAgent.status)}15`,
                    color: getStatusColor(selectedAgent.status),
                    border: `1px solid ${getStatusColor(selectedAgent.status)}35`,
                    borderRadius: '999px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700,
                    textTransform: 'capitalize',
                  }}>{selectedAgent.status}</span>
                  <span style={{ background: `${selectedAgent.color}18`, color: selectedAgent.color, border: `1px solid ${selectedAgent.color}35`, borderRadius: '999px', padding: '2px 10px', fontSize: '0.72px', fontWeight: 600, fontSize: '0.72rem' }}>
                    v2.1.0
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>{selectedAgent.role}</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--color-muted)', lineHeight: 1.6, maxWidth: '640px' }}>
                  {AGENT_DESCRIPTIONS[selectedAgent.id]}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => setIsRunning(v => !v)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer',
                    background: isRunning ? 'rgba(239,68,68,0.1)' : 'rgba(0,230,118,0.1)',
                    color: isRunning ? '#EF4444' : 'var(--color-primary)',
                    border: `1px solid ${isRunning ? 'rgba(239,68,68,0.3)' : 'rgba(0,230,118,0.3)'}`,
                    transition: 'all 0.15s',
                  }}
                >
                  {isRunning ? '⏸ Pause' : '▶ Resume'}
                </button>
                <button className="btn-primary" style={{ fontSize: '0.83rem' }}>⚡ Run Now</button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.875rem' }}>
            {[
              { label: 'Tasks Today', value: formatNumber(selectedAgent.tasksToday), color: selectedAgent.color },
              { label: 'Success Rate', value: `${selectedAgent.successRate}%`, color: selectedAgent.successRate > 95 ? '#22C55E' : '#F59E0B' },
              { label: 'Avg Latency', value: `${selectedAgent.latency}ms`, color: selectedAgent.latency < 200 ? '#22C55E' : selectedAgent.latency < 500 ? '#F59E0B' : '#EF4444' },
              { label: 'Queue Depth', value: `${Math.floor(Math.random() * 20)}`, color: '#3B82F6' },
              { label: 'Uptime', value: '99.98%', color: '#22C55E' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>{s.label}</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="card">
              <SectionHeader title="Response Latency" subtitle="Live (ms)" action={<Badge variant="primary">Live</Badge>} />
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={latencyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="agentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedAgent.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={selectedAgent.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <YAxis stroke="transparent" tick={{ fill: '#6B7280', fontSize: 9 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="v" name="Latency" stroke={selectedAgent.color} strokeWidth={2} fill="url(#agentGrad)" isAnimationActive={false} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <SectionHeader title="Agent Configuration" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'LLM Model', value: 'Gemini 1.5 Pro' },
                  { label: 'Temperature', value: '0.1' },
                  { label: 'Max Tokens', value: '8,192' },
                  { label: 'Memory', value: 'LangGraph MemorySaver' },
                  { label: 'Tools', value: selectedAgent.id === 'data' ? '6 connected' : selectedAgent.id === 'knowledge' ? 'ChromaDB + Gemini' : '4 registered' },
                  { label: 'Timeout', value: '30s' },
                ].map(c => (
                  <StatRow key={c.label} label={c.label} value={c.value} />
                ))}
              </div>
            </div>
          </div>

          {/* Live Task Feed */}
          <div className="card">
            <SectionHeader
              title="Live Task Feed"
              subtitle="Real-time execution stream"
              action={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isRunning && <div style={{ display: 'flex', gap: '3px' }}>{[0, 1, 2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}</div>}
                  <Badge variant={isRunning ? 'primary' : 'default'}>
                    {isRunning ? '● Streaming' : '⏸ Paused'}
                  </Badge>
                </div>
              }
            />
            <div style={{ background: '#060d18', borderRadius: '10px', padding: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.76rem', minHeight: '180px' }}>
              {taskFeed.map((t, i) => (
                <div key={t.id} style={{ marginBottom: '0.375rem', lineHeight: 1.6, opacity: 1 - (i * 0.08), animation: i === 0 ? 'fadeIn 0.3s ease' : 'none' }}>
                  <span style={{ color: '#4B5563' }}>[{t.ts.toLocaleTimeString()}] </span>
                  <span style={{ color: selectedAgent.color }}>[{selectedAgent.name.toUpperCase()}] </span>
                  <span style={{ color: '#9CA3AF' }}>{t.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
