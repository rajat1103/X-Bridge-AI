'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge } from '@/components/ui-components';
import { mockCustomers } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';

const TIER_COLORS: Record<string, string> = {
  Enterprise: '#8B5CF6', Pro: '#3B82F6', Starter: '#6B7280',
};

const SEGMENT_COLORS: Record<string, string> = {
  Champion: '#22C55E', Loyal: '#06B6D4', 'At Risk': '#F59E0B', Churning: '#EF4444',
};

const SEGMENT_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
  Champion: 'success', Loyal: 'info', 'At Risk': 'warning', Churning: 'error',
};

const activityHistory = [
  { date: '2024-01-18', event: 'Email opened: Q1 Renewal Campaign', channel: 'Email' },
  { date: '2024-01-15', event: 'Purchase: Enterprise Plan Renewal', channel: 'Product', amount: '$2,400' },
  { date: '2024-01-10', event: 'Support ticket resolved: API integration', channel: 'Support' },
  { date: '2024-01-05', event: 'Feature used: AI Command Center (47 times)', channel: 'Product' },
  { date: '2023-12-22', event: 'WhatsApp message opened: Year-end review', channel: 'WhatsApp' },
];

const aiRecommendations = [
  { icon: '🎯', title: 'Upsell Opportunity', desc: 'Customer shows high engagement with Advanced Analytics. Recommend upgrading to Enterprise+ tier.', confidence: 94 },
  { icon: '⚡', title: 'Feature Adoption', desc: 'Customer has not used Workflow Builder in 14 days. Send targeted tutorial email.', confidence: 87 },
  { icon: '💎', title: 'Loyalty Reward', desc: 'Customer has been active 2+ years. Qualify for VIP loyalty program benefits.', confidence: 99 },
];

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const churnColor = selectedCustomer.churnScore > 70 ? '#EF4444' : selectedCustomer.churnScore > 40 ? '#F59E0B' : '#22C55E';

  return (
    <AppLayout title="Customer 360" subtitle="Unified customer intelligence profiles">
      <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', minHeight: 'calc(100vh - 56px)' }}>
        {/* Customer List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="input"
              style={{ fontSize: '0.85rem' }}
            />
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 600 }}>{filtered.length} CUSTOMERS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
            {filtered.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                style={{
                  padding: '0.875rem', borderRadius: '10px', cursor: 'pointer',
                  background: selectedCustomer.id === c.id ? 'var(--color-primary-dim)' : 'var(--bg-card)',
                  border: `1px solid ${selectedCustomer.id === c.id ? 'rgba(0,230,118,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${TIER_COLORS[c.tier]}30`, border: `1px solid ${TIER_COLORS[c.tier]}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: TIER_COLORS[c.tier], flexShrink: 0 }}>{c.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.company}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', background: `${SEGMENT_COLORS[c.segment]}18`, color: SEGMENT_COLORS[c.segment], border: `1px solid ${SEGMENT_COLORS[c.segment]}35`, borderRadius: '999px', padding: '1px 8px', fontWeight: 700 }}>{c.segment}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{formatCurrency(c.ltv)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${TIER_COLORS[selectedCustomer.tier]}25`, border: `2px solid ${TIER_COLORS[selectedCustomer.tier]}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: TIER_COLORS[selectedCustomer.tier], flexShrink: 0 }}>{selectedCustomer.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedCustomer.name}</h2>
                  <span style={{ background: `${TIER_COLORS[selectedCustomer.tier]}18`, color: TIER_COLORS[selectedCustomer.tier], border: `1px solid ${TIER_COLORS[selectedCustomer.tier]}40`, borderRadius: '999px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{selectedCustomer.tier}</span>
                  <span style={{ background: `${SEGMENT_COLORS[selectedCustomer.segment]}18`, color: SEGMENT_COLORS[selectedCustomer.segment], border: `1px solid ${SEGMENT_COLORS[selectedCustomer.segment]}40`, borderRadius: '999px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{selectedCustomer.segment}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>{selectedCustomer.email} · {selectedCustomer.company}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-dim)' }}>Customer since {formatDate(selectedCustomer.joinDate)} · Last active {formatDate(selectedCustomer.lastActive)}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-ghost" style={{ fontSize: '0.8rem' }}>✉ Email</button>
                <button className="btn-primary" style={{ fontSize: '0.8rem' }}>📣 Campaign</button>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Lifetime Value', value: formatCurrency(selectedCustomer.ltv), color: 'var(--color-primary)' },
              { label: 'Total Orders', value: selectedCustomer.orders.toString(), color: '#3B82F6' },
              { label: 'Churn Score', value: `${selectedCustomer.churnScore}/100`, color: churnColor },
              { label: 'Customer ID', value: selectedCustomer.id.toUpperCase(), color: 'var(--color-muted)' },
            ].map(m => (
              <div key={m.label} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{m.label}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Churn Risk Gauge */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="card">
              <SectionHeader title="Churn Risk Assessment" />
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={churnColor} strokeWidth="8"
                      strokeDasharray={`${2.64 * selectedCustomer.churnScore} 264`}
                      strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 1s ease' }} />
                    <text x="50" y="46" textAnchor="middle" fill={churnColor} fontSize="18" fontWeight="800">{selectedCustomer.churnScore}</text>
                    <text x="50" y="60" textAnchor="middle" fill="#6B7280" fontSize="9">/ 100</text>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: churnColor, marginBottom: '0.25rem' }}>
                    {selectedCustomer.churnScore > 70 ? '🔴 High Risk' : selectedCustomer.churnScore > 40 ? '🟡 Moderate Risk' : '🟢 Low Risk'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                    {selectedCustomer.churnScore > 70 ? 'Immediate intervention recommended. Schedule executive QBR.' : selectedCustomer.churnScore > 40 ? 'Monitor closely. Trigger re-engagement sequence.' : 'Customer is healthy and engaged. Upsell opportunity.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="card">
              <SectionHeader title="Recent Activity" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '180px' }}>
                {activityHistory.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.625rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', flexShrink: 0 }}>
                      {a.channel === 'Email' ? '📧' : a.channel === 'Product' ? '🖥' : a.channel === 'Support' ? '🎧' : '💬'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text)' }}>{a.event}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>{a.date} · {a.channel} {a.amount ? `· ${a.amount}` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="card">
            <SectionHeader title="AI Recommendations" subtitle="Powered by customer intelligence engine" action={<Badge variant="primary">AI</Badge>} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
              {aiRecommendations.map(r => (
                <div key={r.title} style={{ padding: '1rem', background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.12)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{r.icon}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.375rem', color: 'var(--color-text)' }}>{r.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{r.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Confidence</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#22C55E' }}>{r.confidence}%</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: '0.25rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${r.confidence}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
