'use client';

import React, { useState, useCallback } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge } from '@/components/ui-components';
import { mockRevenueData } from '@/lib/mock-data';
import { formatCurrency, formatNumber, sleep, generateId } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';

const retentionData = [
  { month: 'Jan', '30d': 98, '60d': 94, '90d': 88, '180d': 78 },
  { month: 'Feb', '30d': 97, '60d': 93, '90d': 87, '180d': 77 },
  { month: 'Mar', '30d': 98.5, '60d': 95, '90d': 89, '180d': 81 },
  { month: 'Apr', '30d': 97, '60d': 94, '90d': 88, '180d': 79 },
  { month: 'May', '30d': 99, '60d': 96, '90d': 91, '180d': 83 },
  { month: 'Jun', '30d': 98, '60d': 95, '90d': 90, '180d': 82 },
  { month: 'Jul', '30d': 98.8, '60d': 96, '90d': 91, '180d': 84 },
];

const channelData = [
  { name: 'Direct', value: 32, color: '#00E676' },
  { name: 'Organic', value: 24, color: '#3B82F6' },
  { name: 'Paid', value: 19, color: '#8B5CF6' },
  { name: 'Referral', value: 15, color: '#F59E0B' },
  { name: 'Email', value: 10, color: '#06B6D4' },
];

const nlQueries = [
  'Why did revenue fall last month?',
  'Which customer segment has the highest churn risk?',
  'What is the LTV by acquisition channel?',
  'Show me retention trends by cohort',
  'Which products drive the most expansion revenue?',
];

interface NLResult {
  id: string;
  query: string;
  sql: string;
  explanation: string;
  chartType: 'bar' | 'line' | 'area' | 'pie';
}

const mockNLResults: Record<string, Omit<NLResult, 'id' | 'query'>> = {
  default: {
    sql: `SELECT 
  date_trunc('month', created_at) AS month,
  SUM(amount) AS revenue,
  COUNT(DISTINCT customer_id) AS customers,
  AVG(amount) AS avg_order_value
FROM orders
WHERE created_at >= NOW() - INTERVAL '7 months'
GROUP BY 1
ORDER BY 1;`,
    explanation: 'Revenue showed a 12.4% decline in May due to reduced enterprise deal closures. Analysis indicates delayed procurement cycles in APAC region (-31% vs prior year) and slower expansion revenue from existing accounts (-8.2%). Churn in the Pro tier contributed 4.1% additional headwind. Recommended actions: (1) Accelerate APAC pipeline reviews, (2) Launch Pro-to-Enterprise upsell campaign, (3) Deploy retention playbook for at-risk accounts.',
    chartType: 'area',
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
      <div style={{ color: 'var(--color-muted)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p: any) => <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>)}
    </div>
  );
  return null;
};

type TabType = 'revenue' | 'retention' | 'customers' | 'nlq';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('revenue');
  const [nlQuery, setNlQuery] = useState('');
  const [nlResult, setNlResult] = useState<NLResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  const processNLQuery = useCallback(async (q: string) => {
    if (!q.trim() || isProcessing) return;
    setIsProcessing(true);
    setNlResult(null);
    
    setProcessingStep('🔍 Parsing natural language query...');
    await sleep(600);
    setProcessingStep('🧠 Converting to SQL with LLM...');
    await sleep(800);
    setProcessingStep('⚡ Executing query on PostgreSQL...');
    await sleep(700);
    setProcessingStep('📊 Generating visualization...');
    await sleep(500);
    setProcessingStep('💬 Generating business explanation...');
    await sleep(600);
    
    setNlResult({ id: generateId(), query: q, ...mockNLResults.default });
    setIsProcessing(false);
    setProcessingStep('');
  }, [isProcessing]);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'retention', label: 'Retention', icon: '🔄' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'nlq', label: 'Ask AI', icon: '🤖' },
  ];

  return (
    <AppLayout title="Analytics Center" subtitle="Natural language business intelligence">
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.375rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.625rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-muted)',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'transparent'}`,
                transition: 'all 0.15s', marginBottom: '-1px',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { label: 'Total ARR', value: '$4.28M', change: '+18.2%', positive: true },
                { label: 'MRR', value: '$356.7K', change: '+5.4%', positive: true },
                { label: 'Expansion MRR', value: '$48.2K', change: '+32.1%', positive: true },
                { label: 'Churn MRR', value: '$12.4K', change: '-8.3%', positive: false },
              ].map(m => (
                <div key={m.label} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{m.label}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{m.value}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: m.positive ? 'var(--color-success)' : 'var(--color-error)' }}>{m.change} vs last period</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
              <div className="card">
                <SectionHeader title="Revenue Trend" subtitle="MRR growth over 7 months" action={<Badge variant="primary">Live</Badge>} />
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={mockRevenueData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E676" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <YAxis stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={v => `$${formatNumber(v)}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#00E676" strokeWidth={2.5} fill="url(#areaGrad)" />
                    <Area type="monotone" dataKey="target" name="Target" stroke="#3B82F6" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <SectionHeader title="Revenue by Channel" />
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <PieChart width={160} height={160}>
                    <Pie data={channelData} cx={80} cy={80} outerRadius={72} dataKey="value" paddingAngle={2}>
                      {channelData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
                {channelData.map(c => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '0.8rem' }}>{c.name}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Retention Tab */}
        {activeTab === 'retention' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <SectionHeader title="Customer Retention Curves" subtitle="Retention by time cohort" />
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={retentionData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} />
                  <YAxis stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} domain={[70, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#9CA3AF' }} />
                  <Line type="monotone" dataKey="30d" name="30-day" stroke="#00E676" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="60d" name="60-day" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="90d" name="90-day" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="180d" name="180-day" stroke="#F59E0B" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="card">
                <SectionHeader title="Customer Growth" subtitle="New vs churned monthly" />
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={mockRevenueData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <YAxis stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={v => formatNumber(v)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="customers" name="Customers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <SectionHeader title="Segment Distribution" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginTop: '0.5rem' }}>
                  {[
                    { label: 'Champions', count: 2847, pct: 22, color: '#22C55E' },
                    { label: 'Loyal', count: 4231, pct: 33, color: '#06B6D4' },
                    { label: 'At Risk', count: 1892, pct: 15, color: '#F59E0B' },
                    { label: 'Churning', count: 984, pct: 8, color: '#EF4444' },
                    { label: 'New', count: 2893, pct: 22, color: '#8B5CF6' },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '0.875rem', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.72rem', color: s.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{s.label}</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '2px' }}>{s.count.toLocaleString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{s.pct}% of total</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NLQ Tab */}
        {activeTab === 'nlq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤖</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Ask Your Data</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Natural language → SQL → Insight</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  value={nlQuery}
                  onChange={e => setNlQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && processNLQuery(nlQuery)}
                  placeholder="Ask any question about your business data..."
                  className="input"
                  style={{ flex: 1, fontSize: '0.9rem' }}
                />
                <button onClick={() => processNLQuery(nlQuery)} className="btn-primary" disabled={isProcessing || !nlQuery.trim()}>
                  {isProcessing ? '⏳' : '⚡ Analyze'}
                </button>
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {nlQueries.map(q => (
                  <button key={q} onClick={() => { setNlQuery(q); processNLQuery(q); }} style={{ padding: '0.3rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', fontSize: '0.75rem', color: 'var(--color-muted)', cursor: 'pointer' }}>
                    {q.slice(0, 40)}...
                  </button>
                ))}
              </div>
            </div>

            {isProcessing && (
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '4px' }}>{[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}</div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{processingStep}</span>
              </div>
            )}

            {nlResult && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="card">
                    <SectionHeader title="Generated SQL" action={<Badge variant="success">Executed</Badge>} />
                    <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#9CA3AF', background: '#060d18', borderRadius: '8px', padding: '1rem', overflowX: 'auto', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {nlResult.sql.split('\n').map((line, i) => {
                        const isKeyword = /^\s*(SELECT|FROM|WHERE|GROUP BY|ORDER BY|AND|OR|HAVING|LIMIT|JOIN|LEFT|RIGHT|INNER|ON|AS|WITH)\b/i.test(line);
                        return <span key={i} style={{ color: isKeyword ? '#00E676' : line.includes('--') ? '#4B5563' : '#9CA3AF' }}>{line}{'\n'}</span>;
                      })}
                    </pre>
                  </div>
                  <div className="card">
                    <SectionHeader title="Visualization" />
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={mockRevenueData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                        <defs>
                          <linearGradient id="nlGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="month" stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} />
                        <YAxis stroke="transparent" tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={v => `$${formatNumber(v)}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8B5CF6" strokeWidth={2} fill="url(#nlGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card" style={{ background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                    <div style={{ fontSize: '1.25rem' }}>💡</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>AI Business Insight</div>
                    <Badge variant="primary">Gemini Pro</Badge>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.7 }}>{nlResult.explanation}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
