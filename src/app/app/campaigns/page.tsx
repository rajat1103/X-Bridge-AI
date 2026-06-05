'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge } from '@/components/ui-components';
import { mockCampaigns } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';

type CampaignType = 'email' | 'whatsapp' | 'sms';

const CAMPAIGN_ICONS: Record<CampaignType, string> = { email: '📧', whatsapp: '💬', sms: '📱' };

const segments = [
  { id: 'churn', label: 'High Churn Risk', count: 1247, color: '#EF4444', description: 'Churn score > 70' },
  { id: 'inactive', label: 'Inactive 60d+', count: 892, color: '#F59E0B', description: 'No activity in 60 days' },
  { id: 'champions', label: 'Champions', count: 2847, color: '#22C55E', description: 'Top 20% by LTV' },
  { id: 'newusers', label: 'New Users (7d)', count: 421, color: '#3B82F6', description: 'Joined last 7 days' },
];

const emailPreview = {
  subject: 'We miss you, {{first_name}} — and we have something special for you',
  preview: 'Exclusive offer inside: 30% off your next renewal, just for you',
  body: `Hi {{first_name}},

We noticed you haven't been as active on X-Bridge lately, and we wanted to reach out personally.

Your team at {{company}} has built something incredible, and we want to make sure you're getting the most out of your enterprise plan.

**Here's what you might be missing:**
• 🤖 AI Command Center — run natural language queries across all your data
• ⚡ New Workflow Templates — 24 pre-built automations added this quarter
• 📊 Customer Intelligence — predictive churn scores for your entire database

**As a valued Enterprise customer, we're offering you:**
→ 30% off your next renewal (expires in 7 days)
→ Free 1:1 platform walkthrough with our solutions team
→ Early access to Knowledge Graph (launching next month)

[Claim Your Offer →]

Best,
Alex Chen
Customer Success — X-Bridge AI`,
};

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedType, setSelectedType] = useState<CampaignType>('email');
  const [selectedSegment, setSelectedSegment] = useState(segments[0]);
  const [campaignName, setCampaignName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(false);

  const generateWithAI = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsGenerating(false);
    setGeneratedContent(true);
  };

  const statusColor: Record<string, string> = {
    active: '#22C55E', completed: '#3B82F6', scheduled: '#F59E0B', draft: '#6B7280',
  };

  return (
    <AppLayout title="Campaign Center" subtitle="AI-powered multi-channel campaigns" actions={
      <button onClick={() => setActiveTab(t => t === 'list' ? 'create' : 'list')} className="btn-primary">
        {activeTab === 'list' ? '+ Create Campaign' : '← Back'}
      </button>
    }>
      {activeTab === 'list' ? (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Active Campaigns', value: '3', icon: '📣', color: '#00E676' },
              { label: 'Emails Sent (30d)', value: '48.2K', icon: '📧', color: '#3B82F6' },
              { label: 'Avg Open Rate', value: '68.4%', icon: '👁️', color: '#8B5CF6' },
              { label: 'Revenue Attributed', value: '$305K', icon: '💰', color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                  <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Campaign List */}
          <div className="card">
            <SectionHeader title="Campaigns" subtitle={`${mockCampaigns.length} total`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.625rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>Campaign</span><span>Sent</span><span>Opened</span><span>Clicked</span><span>Converted</span><span>Revenue</span>
              </div>
              {mockCampaigns.map(c => (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.875rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                      <span>{CAMPAIGN_ICONS[c.type as CampaignType]}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</span>
                      {c.ai && <span style={{ background: 'var(--color-primary-dim)', color: 'var(--color-primary)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: '999px', padding: '1px 6px', fontSize: '0.65rem', fontWeight: 700 }}>AI</span>}
                    </div>
                    <span style={{ background: statusColor[c.status] + '18', color: statusColor[c.status], border: `1px solid ${statusColor[c.status]}35`, borderRadius: '999px', padding: '1px 8px', fontSize: '0.68rem', fontWeight: 700 }}>{c.status}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{c.sent > 0 ? formatNumber(c.sent) : '—'}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{c.opened > 0 ? `${((c.opened / c.sent) * 100).toFixed(1)}%` : '—'}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{c.clicked > 0 ? `${((c.clicked / c.sent) * 100).toFixed(1)}%` : '—'}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{c.converted > 0 ? c.converted : '—'}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>{c.revenue > 0 ? `$${formatNumber(c.revenue)}` : '—'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Create Campaign */
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem' }}>
          {/* Config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <SectionHeader title="Campaign Setup" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>Campaign Name</label>
                  <input value={campaignName} onChange={e => setCampaignName(e.target.value)} className="input" placeholder="Q2 Re-engagement Campaign" />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>Channel</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['email', 'whatsapp', 'sms'] as CampaignType[]).map(type => (
                      <button key={type} onClick={() => setSelectedType(type)} style={{ flex: 1, padding: '0.625rem', background: selectedType === type ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedType === type ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', transition: 'all 0.15s' }}>
                        <span style={{ fontSize: '1.1rem' }}>{CAMPAIGN_ICONS[type]}</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: selectedType === type ? 'var(--color-primary)' : 'var(--color-muted)', textTransform: 'capitalize' }}>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.375rem' }}>Target Segment</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {segments.map(s => (
                      <div key={s.id} onClick={() => setSelectedSegment(s)} style={{ padding: '0.625rem 0.875rem', background: selectedSegment.id === s.id ? `${s.color}10` : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedSegment.id === s.id ? s.color + '35' : 'rgba(255,255,255,0.06)'}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s' }}>
                        <div>
                          <div style={{ fontSize: '0.83rem', fontWeight: 600, color: selectedSegment.id === s.id ? s.color : 'var(--color-text)' }}>{s.label}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{s.description}</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: s.color }}>{s.count.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={generateWithAI} disabled={isGenerating} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
                  {isGenerating ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '3px' }}>{[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}</div>
                      Generating with AI...
                    </span>
                  ) : '🤖 Generate with AI'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="card">
            <SectionHeader title="Campaign Preview" action={generatedContent ? <Badge variant="success">AI Generated</Badge> : <Badge variant="info">Preview</Badge>} />
            {selectedType === 'email' && (
              <div style={{ background: '#f8fafc', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                {/* Email header */}
                <div style={{ background: '#1a1a2e', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.25rem' }}>Subject: {emailPreview.subject}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>Preview: {emailPreview.preview}</div>
                </div>
                {/* Email body */}
                <div style={{ padding: '2rem', background: '#ffffff', color: '#1a1a2e' }}>
                  <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid #00E676' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#000', letterSpacing: '-0.02em' }}>X-Bridge <span style={{ color: '#00E676' }}>AI</span></div>
                  </div>
                  <pre style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: '#374151' }}>
                    {generatedContent ? emailPreview.body : 'Click "Generate with AI" to create personalized campaign content based on your segment data and historical engagement patterns.'}
                  </pre>
                  {generatedContent && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-block', padding: '0.875rem 2rem', background: '#00E676', color: '#000', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                        Claim Your Offer →
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {selectedType !== 'email' && (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{CAMPAIGN_ICONS[selectedType]}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{selectedType === 'whatsapp' ? 'WhatsApp' : 'SMS'} Campaign Preview</div>
                <div style={{ color: 'var(--color-muted)', fontSize: '0.875rem', maxWidth: '300px', margin: '0 auto', padding: '1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', lineHeight: 1.6 }}>
                  {generatedContent ? `Hi {{first_name}}! 👋\n\nWe miss you at X-Bridge. Your account shows some opportunities we'd love to show you.\n\nClick here for an exclusive 30% renewal offer: xbrid.ge/offer-{{token}}\n\nReply STOP to unsubscribe.` : 'Generate content with AI to see preview...'}
                </div>
              </div>
            )}
            {generatedContent && (
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>⬅ Regenerate</button>
                <button className="btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '0.75rem' }}>📣 Launch Campaign ({selectedSegment.count.toLocaleString()} recipients)</button>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
