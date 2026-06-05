'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge } from '@/components/ui-components';
import { mockAgents, mockSystemHealth, mockActivityFeed } from '@/lib/mock-data';
import { formatRelativeTime, formatNumber, getStatusColor } from '@/lib/utils';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Generate live latency data
function generateLatencyData(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    t: `${i}s`,
    p50: Math.random() * 30 + 50,
    p95: Math.random() * 80 + 100,
    p99: Math.random() * 150 + 200,
  }));
}

function generateRequestData(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    t: `${i}s`,
    requests: Math.floor(Math.random() * 300 + 600),
    errors: Math.floor(Math.random() * 10),
  }));
}

export default function MonitoringPage() {
  const [latencyData, setLatencyData] = useState(generateLatencyData());
  const [requestData, setRequestData] = useState(generateRequestData());
  const [alerts, setAlerts] = useState([
    { id: '1', severity: 'warning', message: 'Integration Agent p95 latency > 500ms', time: new Date(Date.now() - 340000), acknowledged: false },
    { id: '2', severity: 'info', message: 'HubSpot sync degraded — investigating', time: new Date(Date.now() - 720000), acknowledged: false },
    { id: '3', severity: 'success', message: 'Kafka consumer lag resolved', time: new Date(Date.now() - 1800000), acknowledged: true },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyData(prev => [...prev.slice(1), { t: 'now', p50: Math.random() * 30 + 50, p95: Math.random() * 80 + 100, p99: Math.random() * 150 + 200 }]);
      setRequestData(prev => [...prev.slice(1), { t: 'now', requests: Math.floor(Math.random() * 300 + 600), errors: Math.floor(Math.random() * 10) }]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) return (
      <div style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.625rem 0.875rem', fontSize: '0.78rem' }}>
        {payload.map((p: any) => <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</div>)}
      </div>
    );
    return null;
  };

  return (
    <AppLayout title="Monitoring Center" subtitle="Real-time platform observability" actions={
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', color: 'var(--color-success)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)' }} />
          Live
        </div>
        <button className="btn-ghost">Configure Alerts</button>
      </div>
    }>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* System Health Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {Object.entries(mockSystemHealth).map(([key, data]) => {
            const color = getStatusColor(data.status);
            return (
              <div key={key} className="card" style={{ padding: '1.25rem', borderColor: data.status === 'degraded' ? 'rgba(245,158,11,0.3)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted)' }}>{key}</span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color, textTransform: 'capitalize', marginBottom: '0.25rem' }}>{data.status}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  {'uptime' in data && `${data.uptime}% uptime`}
                  {'activeCount' in data && `${data.activeCount}/${data.activeCount + data.failedCount} online`}
                  {'running' in data && `${data.running} running`}
                  {'messageRate' in data && `${formatNumber(data.messageRate)}/s`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="card">
            <SectionHeader title="API Latency" subtitle="Real-time percentiles (ms)" action={<Badge variant="primary">Live</Badge>} />
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={latencyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="t" stroke="transparent" tick={{ fill: '#6B7280', fontSize: 9 }} interval={4} />
                <YAxis stroke="transparent" tick={{ fill: '#6B7280', fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="p50" name="P50" stroke="#22C55E" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="p95" name="P95" stroke="#F59E0B" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="p99" name="P99" stroke="#EF4444" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <SectionHeader title="Request Volume" subtitle="Requests/s and error rate" action={<Badge variant="primary">Live</Badge>} />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={requestData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="t" stroke="transparent" tick={{ fill: '#6B7280', fontSize: 9 }} interval={4} />
                <YAxis stroke="transparent" tick={{ fill: '#6B7280', fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="requests" name="Requests" stroke="#3B82F6" strokeWidth={2} fill="url(#reqGrad)" isAnimationActive={false} />
                <Area type="monotone" dataKey="errors" name="Errors" stroke="#EF4444" strokeWidth={1.5} fill="none" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Health Grid */}
        <div className="card">
          <SectionHeader title="Agent Health Matrix" subtitle="All agents real-time status" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
            {mockAgents.map(agent => {
              const statusColor = getStatusColor(agent.status);
              return (
                <div key={agent.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: `1px solid ${agent.status === 'degraded' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${agent.color}18`, border: `1px solid ${agent.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: agent.color, flexShrink: 0 }}>
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.83rem', fontWeight: 700, marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{agent.role}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: statusColor, textTransform: 'capitalize' }}>{agent.status}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>{agent.latency}ms · {agent.successRate}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts + Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="card">
            <SectionHeader title="Active Alerts" subtitle={`${alerts.filter(a => !a.acknowledged).length} unacknowledged`} action={<Badge variant="warning">{alerts.filter(a => !a.acknowledged).length}</Badge>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {alerts.map(alert => (
                <div key={alert.id} style={{ padding: '0.875rem', background: alert.severity === 'warning' ? 'rgba(245,158,11,0.06)' : alert.severity === 'success' ? 'rgba(34,197,94,0.06)' : 'rgba(59,130,246,0.06)', border: `1px solid ${alert.severity === 'warning' ? 'rgba(245,158,11,0.2)' : alert.severity === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)'}`, borderRadius: '8px', opacity: alert.acknowledged ? 0.5 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.83rem', fontWeight: 600, marginBottom: '2px' }}>{alert.message}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{formatRelativeTime(alert.time)}</div>
                    </div>
                    {!alert.acknowledged && (
                      <button onClick={() => acknowledgeAlert(alert.id)} style={{ padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>Ack</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <SectionHeader title="Execution Logs" subtitle="Last 1h events" />
            <div style={{ background: '#060d18', borderRadius: '8px', padding: '0.875rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', height: '220px', overflowY: 'auto' }}>
              {mockActivityFeed.map(e => (
                <div key={e.id} style={{ marginBottom: '0.375rem', lineHeight: 1.5 }}>
                  <span style={{ color: '#4B5563' }}>[{e.time.toISOString().slice(11, 19)}] </span>
                  <span style={{ color: e.severity === 'success' ? '#22C55E' : e.severity === 'warning' ? '#F59E0B' : e.severity === 'error' ? '#EF4444' : '#3B82F6' }}>[{e.type.toUpperCase()}] </span>
                  <span style={{ color: '#9CA3AF' }}>{e.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
