'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const features = [
  { icon: '🤖', title: 'Multi-Agent Orchestration', desc: 'LangGraph-powered agents that collaborate, delegate, and execute complex enterprise workflows autonomously.' },
  { icon: '📊', title: 'Customer Data Platform', desc: 'Unified 360° customer profiles with real-time behavioral scoring, churn prediction, and lifetime value modeling.' },
  { icon: '⚡', title: 'Visual Workflow Builder', desc: 'Drag-and-drop automation with conditional logic, webhooks, and AI-powered decision nodes.' },
  { icon: '🔗', title: 'Integration Ecosystem', desc: 'Connect 200+ enterprise tools via React Flow canvas with intelligent data transformation rules.' },
  { icon: '📚', title: 'RAG Knowledge Engine', desc: 'ChromaDB-powered vector search with semantic document querying and enterprise SOP management.' },
  { icon: '🕸️', title: 'Knowledge Graph', desc: 'D3.js interactive graph visualization showing deep relationships between customers, products, and campaigns.' },
  { icon: '📣', title: 'AI Campaign Engine', desc: 'Generate personalized email, WhatsApp, and SMS campaigns using behavioral signals and churn risk scores.' },
  { icon: '🔍', title: 'Real-Time Monitoring', desc: 'Agent health, API uptime, workflow performance, and data pipeline observability in one unified dashboard.' },
];

const agents = [
  { id: 'master', name: 'Master Agent', role: 'Orchestrator', color: '#00E676', x: 50, y: 10 },
  { id: 'data', name: 'Data Agent', role: 'Pipeline', color: '#3B82F6', x: 20, y: 40 },
  { id: 'analytics', name: 'Analytics Agent', role: 'ML Analysis', color: '#8B5CF6', x: 50, y: 40 },
  { id: 'campaign', name: 'Campaign Agent', role: 'Marketing', color: '#F59E0B', x: 80, y: 40 },
  { id: 'workflow', name: 'Workflow Agent', role: 'Automation', color: '#06B6D4', x: 35, y: 70 },
  { id: 'knowledge', name: 'Knowledge Agent', role: 'RAG Engine', color: '#EC4899', x: 65, y: 70 },
];

const pricing = [
  { name: 'Starter', price: 299, period: 'month', users: '5 seats', agents: '3 agents', workflows: '50 workflows', highlight: false, cta: 'Start Free Trial' },
  { name: 'Professional', price: 999, period: 'month', users: '25 seats', agents: '9 agents', workflows: 'Unlimited', highlight: true, cta: 'Get Started', badge: 'Most Popular' },
  { name: 'Enterprise', price: null, period: null, users: 'Unlimited', agents: 'Custom', workflows: 'Unlimited', highlight: false, cta: 'Contact Sales', badge: 'Custom' },
];

const faqs = [
  { q: 'How does the multi-agent system work?', a: 'X-Bridge AI uses LangGraph to orchestrate specialized AI agents. A Master Agent receives your natural language instruction, breaks it into subtasks, and delegates to specialized agents (Data, Analytics, Campaign, etc.) which execute in parallel or sequence, then synthesize results.' },
  { q: 'Can I connect my existing data sources?', a: 'Yes. The Integration Builder supports 200+ connectors including Shopify, Salesforce, Stripe, HubSpot, Segment, PostgreSQL, BigQuery, and custom REST APIs via our visual canvas with field mapping and transformation rules.' },
  { q: 'How is customer data secured?', a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC2 Type II certified, GDPR compliant, and support SSO/SAML, RBAC, and data residency requirements for enterprise customers.' },
  { q: 'What makes X-Bridge different from other AI platforms?', a: 'Unlike point solutions, X-Bridge combines a CDP, multi-agent AI, workflow automation, RAG knowledge base, and real-time analytics in one platform. Our agents share context, enabling compound intelligence that siloed tools cannot achieve.' },
  { q: 'How quickly can teams get started?', a: 'Most teams run their first AI workflow within 30 minutes. Our pre-built agent templates for churn prevention, lead scoring, and campaign automation reduce setup time dramatically.' },
];

const metrics = [
  { value: '94%', label: 'Churn Prevention Rate' },
  { value: '3.2x', label: 'Campaign ROI Increase' },
  { value: '10ms', label: 'Agent Response Time' },
  { value: '99.99%', label: 'Platform Uptime SLA' },
];

export default function LandingPage() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [animatedMetrics, setAnimatedMetrics] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setAnimatedMetrics(true);
    }, { threshold: 0.3 });
    if (metricsRef.current) observer.observe(metricsRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate active agent cycling
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setActiveAgent(agents[idx].id);
      idx = (idx + 1) % agents.length;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--color-text)', fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(11, 18, 32, 0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', gap: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginRight: 'auto' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #00E676, #00BCD4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', fontSize: '1rem', boxShadow: '0 4px 12px rgba(0,230,118,0.4)' }}>X</div>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>X-Bridge <span style={{ color: 'var(--color-primary)' }}>AI</span></span>
        </div>
        {['Features', 'Agents', 'Pricing', 'FAQ'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: '0.875rem', color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >{item}</a>
        ))}
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
        <Link href="/app/dashboard" style={{
          background: 'var(--color-primary)', color: '#000', padding: '0.5rem 1.125rem',
          borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
          transition: 'all 0.15s', boxShadow: '0 4px 12px rgba(0,230,118,0.3)',
        }}>Launch App →</Link>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Grid background */}
        <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        
        {/* Radial glow */}
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse at center, rgba(0,230,118,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '900px', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '2rem', letterSpacing: '0.02em' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', animation: 'pulse 2s infinite' }} />
            ENTERPRISE AI PLATFORM v2.0 — NOW IN PRODUCTION
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            The Intelligence Layer
            <br />
            <span className="gradient-text">Your Enterprise Deserves</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--color-muted)', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto 2.5rem' }}>
            Autonomous AI agents, real-time customer intelligence, visual workflow automation, and enterprise integrations — unified in one platform built for the world&apos;s most demanding teams.
          </p>

          {/* CTA Row */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/app/dashboard" style={{
              background: 'var(--color-primary)', color: '#000', padding: '0.875rem 2rem',
              borderRadius: '10px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(0,230,118,0.4)', transition: 'all 0.2s',
            }}>
              Launch Platform <span>→</span>
            </Link>
            <a href="#features" style={{
              background: 'rgba(255,255,255,0.05)', color: 'var(--color-text)', padding: '0.875rem 2rem',
              borderRadius: '10px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              transition: 'all 0.2s',
            }}>
              Watch Demo ▶
            </a>
          </div>

          {/* Trust bar */}
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {['SOC2 Certified', 'GDPR Compliant', 'Enterprise SLA', '99.99% Uptime'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Hero dashboard preview */}
        <div style={{ marginTop: '4rem', maxWidth: '1100px', width: '100%', position: 'relative' }}>
          <div style={{ background: 'var(--bg-sidebar)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,230,118,0.1)' }}>
            {/* Browser chrome */}
            <div style={{ padding: '0.75rem 1rem', background: '#0e1825', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {['#EF4444', '#F59E0B', '#22C55E'].map((c, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '3px 12px', fontSize: '0.72rem', color: 'var(--color-muted)', marginLeft: '1rem', maxWidth: '300px' }}>
                app.xbridge.ai/dashboard
              </div>
            </div>
            {/* Dashboard preview content */}
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { label: 'ARR', value: '$4.28M', change: '+18.2%', color: '#00E676' },
                { label: 'Customers', value: '12,847', change: '+7.4%', color: '#3B82F6' },
                { label: 'Churn Rate', value: '2.8%', change: '-0.6%', color: '#22C55E' },
                { label: 'NPS Score', value: '72', change: '+4pts', color: '#8B5CF6' },
              ].map(card => (
                <div key={card.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>{card.label}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{card.value}</div>
                  <div style={{ fontSize: '0.72rem', color: card.color, fontWeight: 600 }}>{card.change}</div>
                </div>
              ))}
            </div>
            {/* Chart area */}
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', height: '120px', display: 'flex', alignItems: 'flex-end', gap: '4px', overflow: 'hidden' }}>
                {[60, 75, 68, 85, 72, 90, 95, 88, 98, 92, 100, 96].map((h, i) => (
                  <div key={i} style={{ flex: 1, background: `linear-gradient(to top, #00E676, #00BCD4)`, borderRadius: '3px 3px 0 0', height: `${h}%`, opacity: 0.8, transition: 'height 0.5s ease' }} />
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>AGENT STATUS</div>
                {['Master', 'Data', 'Analytics', 'Campaign'].map(a => (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 4px #22C55E' }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{a}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#22C55E' }}>Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom glow */}
          <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '80px', background: 'radial-gradient(ellipse at center, rgba(0,230,118,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        </div>
      </section>

      {/* Metrics */}
      <section ref={metricsRef} style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {metrics.map(m => (
            <div key={m.label}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{m.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-block', background: 'var(--color-primary-dim)', border: '1px solid var(--border-active)', borderRadius: '999px', padding: '0.3rem 1rem', fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>PLATFORM CAPABILITIES</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Enterprise AI, <span className="gradient-text">Fully Assembled</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Stop stitching together 12 tools. X-Bridge delivers every capability your enterprise team needs in one cohesive platform.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {features.map((f, i) => (
            <div key={f.title} className="card" style={{ cursor: 'default', transition: 'all 0.25s ease', animationDelay: `${i * 0.05}s` }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-4px)';
                el.style.borderColor = 'rgba(0,230,118,0.2)';
                el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.borderColor = 'rgba(255,255,255,0.06)';
                el.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>{f.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Ecosystem */}
      <section id="agents" style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '999px', padding: '0.3rem 1rem', fontSize: '0.78rem', color: '#8B5CF6', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '0.05em' }}>MULTI-AGENT SYSTEM</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.1 }}>
              Nine Specialized Agents.<br />
              <span className="gradient-text">One Unified Intelligence.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Each agent is an expert in its domain. When you give X-Bridge a complex instruction, the Master Agent orchestrates the entire team — data retrieval, analysis, campaign creation, and execution — without any manual steps.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {agents.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', borderRadius: '8px', background: activeAgent === a.id ? 'rgba(0,230,118,0.06)' : 'transparent', border: `1px solid ${activeAgent === a.id ? 'rgba(0,230,118,0.2)' : 'transparent'}`, transition: 'all 0.3s ease' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, boxShadow: activeAgent === a.id ? `0 0 12px ${a.color}` : 'none', transition: 'all 0.3s' }} />
                  <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: activeAgent === a.id ? 600 : 400, color: activeAgent === a.id ? 'var(--color-text)' : 'var(--color-muted)', transition: 'all 0.3s' }}>{a.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{a.role}</span>
                  {activeAgent === a.id && <span style={{ fontSize: '0.7rem', background: 'rgba(0,230,118,0.15)', color: 'var(--color-primary)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: '999px', padding: '1px 8px', fontWeight: 700 }}>RUNNING</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Agent network viz */}
          <div style={{ position: 'relative', height: '420px' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,230,118,0.05) 0%, transparent 70%)' }} />
            <svg width="100%" height="100%" viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
              {/* Connection lines */}
              {agents.slice(1).map(a => (
                <line key={a.id}
                  x1={`${agents[0].x}%`} y1={`${agents[0].y + 8}%`}
                  x2={`${a.x}%`} y2={`${a.y - 5}%`}
                  stroke={activeAgent === a.id ? a.color : 'rgba(255,255,255,0.1)'}
                  strokeWidth={activeAgent === a.id ? '1.5' : '0.5'}
                  strokeDasharray={activeAgent === a.id ? '4,4' : '0'}
                  style={{ transition: 'all 0.5s ease' }}
                />
              ))}
              {/* Agent nodes */}
              {agents.map(a => (
                <g key={a.id} transform={`translate(${a.x * 3}, ${a.y * 3})`}>
                  <circle r="22" fill={activeAgent === a.id ? `${a.color}20` : 'rgba(31,41,55,0.8)'} stroke={activeAgent === a.id ? a.color : 'rgba(255,255,255,0.1)'} strokeWidth={activeAgent === a.id ? '2' : '1'} style={{ transition: 'all 0.3s' }} />
                  {activeAgent === a.id && <circle r="28" fill="none" stroke={a.color} strokeWidth="0.5" opacity="0.4" />}
                  <text textAnchor="middle" dy="4" fill={activeAgent === a.id ? a.color : 'rgba(255,255,255,0.6)'} fontSize="10" fontWeight="600" style={{ transition: 'all 0.3s' }}>
                    {a.name.split(' ')[0].slice(0, 4)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Workflow & Integration Preview */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Build Automation That <span className="gradient-text">Actually Works</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Workflow preview */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚡</div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Visual Workflow Builder</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Drag-and-drop automation like n8n</p>
              </div>
            </div>
            {/* Workflow node visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'center' }}>
              {['🎯 Trigger: Churn Score > 70', '🔍 Check: Last Purchase > 30d', '🤖 AI: Generate Message', '📧 Action: Send Email', '✅ Mark: Campaign Sent'].map((step, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div style={{ padding: '0.625rem 1rem', background: i === 2 ? 'rgba(0,230,118,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 2 ? 'rgba(0,230,118,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', fontSize: '0.82rem', fontWeight: i === 2 ? 600 : 400, color: i === 2 ? 'var(--color-primary)' : 'var(--color-text)', width: '80%', textAlign: 'center' }}>{step}</div>
                  {i < 4 && <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />}
                </div>
              ))}
            </div>
          </div>
          {/* Integration preview */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🔗</div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Integration Canvas</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Visual API mapping with React Flow</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
              {[['🛍️ Shopify', '☁️ Salesforce', '💳 Stripe'], ['Transform', 'Enrich', 'Route'], ['📊 Analytics', '🤖 AI Agents', '📣 Campaigns']].map((col, ci) => (
                <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: ci === 1 ? 'center' : ci === 0 ? 'flex-end' : 'flex-start' }}>
                  {col.map(item => (
                    <div key={item} style={{ padding: '0.4rem 0.75rem', background: ci === 1 ? 'rgba(0,230,118,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${ci === 1 ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '6px', fontSize: '0.75rem', color: ci === 1 ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: ci === 1 ? 600 : 400, whiteSpace: 'nowrap' }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--color-muted)', fontFamily: 'monospace', lineHeight: 1.6 }}>
              <span style={{ color: 'var(--color-primary)' }}>→</span> 200+ connectors available<br />
              <span style={{ color: 'var(--color-primary)' }}>→</span> Custom field mapping<br />
              <span style={{ color: 'var(--color-primary)' }}>→</span> Real-time sync logs
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Transparent Pricing</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-muted)' }}>Scale from startup to enterprise without surprises</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
            {pricing.map(plan => (
              <div key={plan.name} style={{
                background: plan.highlight ? 'rgba(0,230,118,0.06)' : 'var(--bg-card)',
                border: `1px solid ${plan.highlight ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '16px', padding: '2rem', position: 'relative',
                transform: plan.highlight ? 'scale(1.04)' : 'scale(1)',
              }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: plan.highlight ? 'var(--color-primary)' : 'var(--bg-card)', color: plan.highlight ? '#000' : 'var(--color-muted)', border: `1px solid ${plan.highlight ? 'transparent' : 'rgba(255,255,255,0.1)'}`, borderRadius: '999px', padding: '3px 14px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{plan.badge}</div>
                )}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: plan.highlight ? 'var(--color-primary)' : 'var(--color-text)' }}>{plan.name}</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  {plan.price ? (
                    <div>
                      <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>${plan.price}</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>/{plan.period}</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>Custom</div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
                  {[plan.users, plan.agents, plan.workflows, 'Priority support', plan.highlight ? '24/7 dedicated CSM' : 'Email support'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? 'var(--color-primary)' : 'var(--color-success)'} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {item}
                    </div>
                  ))}
                </div>
                <Link href={plan.price === null ? '#' : '/app/dashboard'} style={{
                  display: 'block', textAlign: 'center', padding: '0.75rem',
                  background: plan.highlight ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                  color: plan.highlight ? '#000' : 'var(--color-text)',
                  borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
                  border: `1px solid ${plan.highlight ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                  transition: 'all 0.2s',
                }}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>Frequently Asked</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,230,118,0.08) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1.5rem', lineHeight: 1.05 }}>
            Ready to Build the<br /><span className="gradient-text">AI-Powered Enterprise?</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Join leading enterprise teams using X-Bridge AI to automate intelligence, accelerate growth, and eliminate operational silos.
          </p>
          <Link href="/app/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            background: 'var(--color-primary)', color: '#000', padding: '1rem 2.5rem',
            borderRadius: '12px', fontSize: '1.1rem', fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 12px 40px rgba(0,230,118,0.4)',
          }}>
            Launch X-Bridge AI <span style={{ fontSize: '1.2rem' }}>→</span>
          </Link>
          <p style={{ marginTop: '1rem', fontSize: '0.83rem', color: 'var(--color-muted)' }}>No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #00E676, #00BCD4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', fontSize: '0.85rem' }}>X</div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>X-Bridge AI</span>
          <span style={{ color: 'var(--color-muted)', fontSize: '0.8rem', marginLeft: '1rem' }}>© 2024. Enterprise Multi-Agent Platform.</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy', 'Terms', 'Security', 'Status', 'Docs'].map(l => (
            <a key={l} href="#" style={{ fontSize: '0.83rem', color: 'var(--color-muted)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${open ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && <div style={{ padding: '0 1.25rem 1.25rem', fontSize: '0.9rem', color: 'var(--color-muted)', lineHeight: 1.7 }}>{a}</div>}
    </div>
  );
}
