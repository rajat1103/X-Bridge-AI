'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { KPICard, SectionHeader, Badge } from '@/components/ui-components';
import { mockKPIs, mockAgents, mockWorkflows, mockActivityFeed, mockSystemHealth, mockRevenueData } from '@/lib/mock-data';
import { formatRelativeTime, formatNumber, getStatusColor } from '@/lib/utils';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const sparkRevenue = mockRevenueData.map(d => d.revenue);
const sparkCustomers = mockRevenueData.map(d => d.customers);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
        <div style={{ color: 'var(--color-muted)', marginBottom: '0.25rem' }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {typeof p.value === 'number' && p.value > 1000 ? `$${formatNumber(p.value)}` : p.value}</div>
        ))}
      </div>
    );
  }
  return null;
};

const agentStatusData = [
  { name: 'Active', value: 8, color: '#22C55E' },
  { name: 'Degraded', value: 1, color: '#F59E0B' },
  { name: 'Idle', value: 0, color: '#6B7280' },
];

export default function DashboardPage() {
  const [liveActivity, setLiveActivity] = useState(mockActivityFeed);
  const [agentTick, setAgentTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgentTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout title="Dashboard" subtitle="Enterprise Overview">
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* KPI Row */}
        <div>
          <SectionHeader title="Key Performance Indicators" subtitle={`Last updated: ${new Date().toLocaleTimeString()}`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <KPICard label="Annual Recurring Revenue" value={mockKPIs.revenue.value} change={mockKPIs.revenue.change} format="currency" color="var(--color-primary)" sparkline={sparkRevenue}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
            <KPICard label="Total Customers" value={mockKPIs.customers.value} change={mockKPIs.customers.change} format="number" color="#3B82F6" sparkline={sparkCustomers}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
            <KPICard label="Churn Rate" value={mockKPIs.churnRate.value} change={mockKPIs.churnRate.change} format="percent" color="#22C55E"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} />
            <KPICard label="Net Promoter Score" value={mockKPIs.nps.value} change={mockKPIs.nps.change} format="raw" color="#8B5CF6" suffix="/100"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>} />
            <KPICard label="Customer LTV" value={mockKPIs.ltv.value} change={mockKPIs.ltv.change} format="currency" color="#F59E0B"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} />
            <KPICard label="Active AI Agents" value={mockKPIs.activeAgents.value} change={mockKPIs.activeAgents.change} format="raw" color="#06B6D4"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44"/></svg>} />
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
          {/* Revenue Chart */}
          <div className="card">
            <SectionHeader title="Revenue vs Target" subtitle="Monthly performance" action={<Badge variant="primary">Live</Badge>} />
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockRevenueData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={v => `$${formatNumber(v)}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="target" name="Target" stroke="#3B82F6" strokeWidth={1.5} fill="url(#targetGrad)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#00E676" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Agent Status */}
          <div className="card">
            <SectionHeader title="Agent Health" subtitle={`${mockKPIs.activeAgents.value}/9 active`} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <PieChart width={120} height={120}>
                <Pie data={agentStatusData} cx={60} cy={60} innerRadius={40} outerRadius={56} paddingAngle={3} dataKey="value">
                  {agentStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mockAgents.slice(0, 5).map(agent => (
                <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(agent.status), boxShadow: `0 0 4px ${getStatusColor(agent.status)}`, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.78rem', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.name}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: getStatusColor(agent.status) }}>{agent.tasksToday}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Workflows + Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Workflows */}
          <div className="card">
            <SectionHeader title="Active Workflows" subtitle={`${mockWorkflows.filter(w => w.status === 'active').length} running`} action={
              <a href="/app/workflows" style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>View all →</a>
            } />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {mockWorkflows.slice(0, 4).map(wf => (
                <div key={wf.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(wf.status), flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.83rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wf.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{wf.trigger} · {wf.runs.toLocaleString()} runs</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: wf.successRate > 95 ? 'var(--color-success)' : wf.successRate > 80 ? 'var(--color-warning)' : 'var(--color-error)' }}>{wf.successRate}%</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>success</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="card">
            <SectionHeader title="Live Activity" subtitle="Real-time platform events" action={<Badge variant="primary">Live</Badge>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {liveActivity.slice(0, 5).map(event => (
                <div key={event.id} style={{ display: 'flex', gap: '0.625rem', padding: '0.625rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: event.severity === 'success' ? 'rgba(34,197,94,0.1)' : event.severity === 'warning' ? 'rgba(245,158,11,0.1)' : event.severity === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>
                    {event.type === 'agent' ? '🤖' : event.type === 'workflow' ? '⚡' : event.type === 'alert' ? '⚠️' : event.type === 'campaign' ? '📣' : '📚'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', lineHeight: 1.4, color: 'var(--color-text)' }}>{event.message}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '1px' }}>{formatRelativeTime(event.time)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="card">
          <SectionHeader title="System Health" subtitle="Infrastructure & service status" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {Object.entries(mockSystemHealth).map(([key, data]) => (
              <div key={key} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-muted)' }}>{key}</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(data.status), boxShadow: `0 0 6px ${getStatusColor(data.status)}` }} />
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: getStatusColor(data.status), marginBottom: '0.25rem', textTransform: 'capitalize' }}>{data.status}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>
                  {'uptime' in data ? `${data.uptime}% uptime` :
                   'activeCount' in data ? `${data.activeCount} active` :
                   'running' in data ? `${data.running} running` :
                   'messageRate' in data ? `${formatNumber(data.messageRate)}/s` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
