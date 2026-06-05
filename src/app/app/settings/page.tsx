'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge } from '@/components/ui-components';

type SettingsTab = 'general' | 'agents' | 'integrations' | 'notifications' | 'security' | 'billing';

const tabs: { id: SettingsTab; label: string; icon: string }[] = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'agents', label: 'AI Agents', icon: '🤖' },
  { id: 'integrations', label: 'API Keys', icon: '🔑' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'security', label: 'Security', icon: '🔐' },
  { id: 'billing', label: 'Billing', icon: '💳' },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: '40px', height: '22px', borderRadius: '999px', border: 'none', cursor: 'pointer',
        background: enabled ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'all 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
        position: 'absolute', top: '3px',
        left: enabled ? '21px' : '3px',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: '2rem' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: description ? '2px' : 0 }}>{label}</div>
        {description && <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>{description}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saved, setSaved] = useState(false);

  // General settings state
  const [orgName, setOrgName] = useState('X-Bridge Demo Corp');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  // Agent settings
  const [agentSettings, setAgentSettings] = useState({
    masterEnabled: true,
    dataEnabled: true,
    analyticsEnabled: true,
    campaignEnabled: true,
    workflowEnabled: true,
    integrationEnabled: true,
    knowledgeEnabled: true,
    monitoringEnabled: true,
    executiveEnabled: false,
    autoRetry: true,
    streamLogs: true,
    maxParallel: '3',
    timeoutSec: '30',
  });

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    agentCompleted: true,
    agentFailed: true,
    churnAlert: true,
    workflowError: true,
    integrationDegraded: true,
    campaignSent: false,
    emailDigest: true,
    slackEnabled: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', padding: '0.5rem 0.875rem', color: 'var(--color-text)',
    fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s',
    width: '200px',
  };

  return (
    <AppLayout title="Settings" subtitle="Platform configuration and preferences" actions={
      <button onClick={handleSave} className="btn-primary" style={{ fontSize: '0.875rem' }}>
        {saved ? '✓ Saved' : 'Save Changes'}
      </button>
    }>
      <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', minHeight: 'calc(100vh - 56px)' }}>
        {/* Tabs sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '0.625rem 0.875rem', background: activeTab === tab.id ? 'rgba(0,230,118,0.08)' : 'none',
              border: `1px solid ${activeTab === tab.id ? 'rgba(0,230,118,0.2)' : 'transparent'}`,
              borderRadius: '8px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.625rem',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-muted)', fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: '0.875rem', transition: 'all 0.15s',
            }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {activeTab === 'general' && (
            <div className="card">
              <SectionHeader title="General Settings" subtitle="Organization profile and preferences" />
              <SettingRow label="Organization Name" description="Your company or team name across the platform">
                <input value={orgName} onChange={e => setOrgName(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(0,230,118,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </SettingRow>
              <SettingRow label="Timezone" description="Used for scheduling and reporting">
                <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ ...inputStyle }}>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Singapore">Singapore</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                </select>
              </SettingRow>
              <SettingRow label="Date Format">
                <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} style={{ ...inputStyle }}>
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </SettingRow>
              <SettingRow label="Language">
                <select style={{ ...inputStyle }}><option>English (US)</option><option>English (UK)</option></select>
              </SettingRow>
              <SettingRow label="Compact Mode" description="Reduce padding and spacing in the interface">
                <Toggle enabled={false} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Show Keyboard Shortcuts" description="Display shortcut hints in navigation">
                <Toggle enabled={true} onChange={() => {}} />
              </SettingRow>
            </div>
          )}

          {activeTab === 'agents' && (
            <>
              <div className="card">
                <SectionHeader title="Agent Activation" subtitle="Enable or disable individual AI agents" />
                {[
                  { key: 'masterEnabled', label: 'Master Agent', desc: 'Required — orchestrates all other agents', required: true },
                  { key: 'dataEnabled', label: 'Data Agent', desc: 'Queries and processes data sources' },
                  { key: 'analyticsEnabled', label: 'Analytics Agent', desc: 'ML inference and business intelligence' },
                  { key: 'campaignEnabled', label: 'Campaign Agent', desc: 'AI content generation for marketing' },
                  { key: 'workflowEnabled', label: 'Workflow Agent', desc: 'Automation and task scheduling' },
                  { key: 'integrationEnabled', label: 'Integration Agent', desc: 'API connections and data sync' },
                  { key: 'knowledgeEnabled', label: 'Knowledge Agent', desc: 'RAG document retrieval' },
                  { key: 'monitoringEnabled', label: 'Monitoring Agent', desc: 'Platform observability and alerts' },
                  { key: 'executiveEnabled', label: 'Executive Agent', desc: 'Board-level reporting and summaries' },
                ].map(a => (
                  <SettingRow key={a.key} label={a.label} description={a.desc}>
                    {a.required ? (
                      <Badge variant="success">Required</Badge>
                    ) : (
                      <Toggle
                        enabled={agentSettings[a.key as keyof typeof agentSettings] as boolean}
                        onChange={v => setAgentSettings(s => ({ ...s, [a.key]: v }))}
                      />
                    )}
                  </SettingRow>
                ))}
              </div>
              <div className="card">
                <SectionHeader title="Agent Execution Settings" />
                <SettingRow label="Auto-retry on failure" description="Automatically retry failed agent tasks up to 3 times">
                  <Toggle enabled={agentSettings.autoRetry} onChange={v => setAgentSettings(s => ({ ...s, autoRetry: v }))} />
                </SettingRow>
                <SettingRow label="Stream execution logs" description="Show real-time logs in Command Center">
                  <Toggle enabled={agentSettings.streamLogs} onChange={v => setAgentSettings(s => ({ ...s, streamLogs: v }))} />
                </SettingRow>
                <SettingRow label="Max parallel agents" description="Maximum simultaneous agent executions">
                  <select value={agentSettings.maxParallel} onChange={e => setAgentSettings(s => ({ ...s, maxParallel: e.target.value }))} style={inputStyle}>
                    <option>1</option><option>2</option><option>3</option><option>5</option><option>10</option>
                  </select>
                </SettingRow>
                <SettingRow label="Execution timeout (seconds)" description="Maximum time for a single agent task">
                  <select value={agentSettings.timeoutSec} onChange={e => setAgentSettings(s => ({ ...s, timeoutSec: e.target.value }))} style={inputStyle}>
                    <option>15</option><option>30</option><option>60</option><option>120</option><option>300</option>
                  </select>
                </SettingRow>
              </div>
            </>
          )}

          {activeTab === 'integrations' && (
            <div className="card">
              <SectionHeader title="API Keys" subtitle="Manage API credentials and webhooks" action={<button className="btn-primary" style={{ fontSize: '0.83rem' }}>+ Generate Key</button>} />
              <div style={{ marginBottom: '1.5rem' }}>
                {[
                  { name: 'Production API Key', key: 'xb_prod_••••••••••••••••4f2a', created: '2024-01-01', perms: 'Full Access' },
                  { name: 'Analytics Read Key', key: 'xb_read_••••••••••••••••8c1b', created: '2024-01-10', perms: 'Read Only' },
                  { name: 'Webhook Secret', key: 'xb_wh_••••••••••••••••3d7e', created: '2024-01-15', perms: 'Webhook' },
                ].map(k => (
                  <div key={k.name} style={{ padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{k.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontFamily: 'monospace', marginTop: '2px' }}>{k.key}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-dim)', marginTop: '2px' }}>Created {k.created} · {k.perms}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ padding: '0.375rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--color-muted)' }}>Copy</button>
                      <button style={{ padding: '0.375rem 0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', color: '#EF4444' }}>Revoke</button>
                    </div>
                  </div>
                ))}
              </div>
              <SectionHeader title="AI Model Configuration" />
              <SettingRow label="Gemini API Key" description="Used for all AI generation tasks">
                <input type="password" defaultValue="AIzaSy••••••••••••••••••••••" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(0,230,118,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </SettingRow>
              <SettingRow label="Default LLM Model">
                <select style={{ ...inputStyle }}>
                  <option>gemini-1.5-pro</option>
                  <option>gemini-1.5-flash</option>
                  <option>gemini-2.0-flash</option>
                </select>
              </SettingRow>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <SectionHeader title="Notification Preferences" subtitle="Control when and how you receive alerts" />
              {[
                { key: 'agentCompleted', label: 'Agent execution completed', desc: 'Notify when a multi-agent task finishes successfully' },
                { key: 'agentFailed', label: 'Agent execution failed', desc: 'Immediate alert on agent failure or timeout' },
                { key: 'churnAlert', label: 'High churn risk detected', desc: 'When AI identifies new at-risk customers' },
                { key: 'workflowError', label: 'Workflow errors', desc: 'Alert when any workflow encounters errors' },
                { key: 'integrationDegraded', label: 'Integration degraded', desc: 'When a data source connection degrades' },
                { key: 'campaignSent', label: 'Campaign dispatched', desc: 'Confirmation when campaigns are deployed' },
                { key: 'emailDigest', label: 'Daily email digest', desc: 'Summary of platform activity sent each morning' },
                { key: 'slackEnabled', label: 'Slack notifications', desc: 'Send alerts to a connected Slack workspace' },
              ].map(n => (
                <SettingRow key={n.key} label={n.label} description={n.desc}>
                  <Toggle
                    enabled={notifSettings[n.key as keyof typeof notifSettings]}
                    onChange={v => setNotifSettings(s => ({ ...s, [n.key]: v }))}
                  />
                </SettingRow>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <SectionHeader title="Security & Access" />
              <SettingRow label="Two-Factor Authentication" description="Require 2FA for all team members">
                <Toggle enabled={true} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="SSO (Single Sign-On)" description="Enable SAML 2.0 / OIDC authentication">
                <Badge variant="warning">Enterprise Only</Badge>
              </SettingRow>
              <SettingRow label="Session Timeout" description="Automatically sign out after inactivity">
                <select style={inputStyle}>
                  <option>1 hour</option><option>4 hours</option><option>8 hours</option><option>Never</option>
                </select>
              </SettingRow>
              <SettingRow label="IP Allowlist" description="Restrict access to specific IP ranges">
                <Toggle enabled={false} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Audit Log Retention" description="How long to retain activity logs">
                <select style={inputStyle}>
                  <option>90 days</option><option>180 days</option><option>1 year</option><option>Forever</option>
                </select>
              </SettingRow>
              <SettingRow label="Data Encryption" description="All data encrypted at rest (AES-256)">
                <Badge variant="success">✓ Active</Badge>
              </SettingRow>
            </div>
          )}

          {activeTab === 'billing' && (
            <>
              <div className="card" style={{ background: 'rgba(0,230,118,0.04)', borderColor: 'rgba(0,230,118,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Enterprise Plan</span>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                      Unlimited agents · Unlimited workflows · 10M events/month<br />
                      Priority support · SSO · Custom integrations
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)' }}>$2,400</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>/month · Billed annually</div>
                  </div>
                </div>
              </div>
              <div className="card">
                <SectionHeader title="Usage This Period" />
                {[
                  { label: 'Agent Executions', used: 48291, limit: 'Unlimited', pct: null },
                  { label: 'Data Events', used: 2847291, limit: '10,000,000', pct: 28 },
                  { label: 'API Calls', used: 124847, limit: '1,000,000', pct: 12 },
                  { label: 'Storage', used: '4.2 GB', limit: '100 GB', pct: 4 },
                  { label: 'Team Members', used: 8, limit: 'Unlimited', pct: null },
                ].map(u => (
                  <div key={u.label} style={{ padding: '0.875rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <span style={{ fontSize: '0.875rem' }}>{u.label}</span>
                      <span style={{ fontSize: '0.83rem', color: 'var(--color-muted)' }}>
                        {typeof u.used === 'number' ? u.used.toLocaleString() : u.used} / {u.limit}
                      </span>
                    </div>
                    {u.pct !== null && (
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${u.pct}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
