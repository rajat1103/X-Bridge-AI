'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge } from '@/components/ui-components';
import { mockAgents } from '@/lib/mock-data';
import { sleep, generateId } from '@/lib/utils';

interface AgentStep {
  agentId: string;
  agentName: string;
  action: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  result?: string;
  startTime?: number;
  endTime?: number;
}

interface ExecutionLog {
  id: string;
  timestamp: Date;
  agent: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

const examplePrompts = [
  'Find churn risk customers and generate a retention campaign',
  'Analyze revenue decline in APAC region last month',
  'Create a win-back campaign for customers inactive 60+ days',
  'Score all leads from last week and prioritize outreach',
  'Generate a weekly executive performance report',
  'Find upsell opportunities for Pro tier customers',
];

const AGENT_COLORS: Record<string, string> = {
  master: '#00E676', data: '#3B82F6', analytics: '#8B5CF6',
  campaign: '#F59E0B', workflow: '#06B6D4', knowledge: '#EC4899',
  integration: '#F97316', monitoring: '#22C55E', executive: '#A78BFA',
};

function getAgentStepsForPrompt(prompt: string): AgentStep[] {
  const p = prompt.toLowerCase();
  if (p.includes('churn') || p.includes('retention')) {
    return [
      { agentId: 'master', agentName: 'Master Agent', action: 'Parsing instruction and orchestrating agent team', status: 'pending' },
      { agentId: 'data', agentName: 'Data Agent', action: 'Querying customer database for churn signals', status: 'pending' },
      { agentId: 'analytics', agentName: 'Analytics Agent', action: 'Running ML churn prediction model (XGBoost)', status: 'pending' },
      { agentId: 'knowledge', agentName: 'Knowledge Agent', action: 'Retrieving retention playbook from knowledge base', status: 'pending' },
      { agentId: 'campaign', agentName: 'Campaign Agent', action: 'Generating personalized retention messages', status: 'pending' },
      { agentId: 'workflow', agentName: 'Workflow Agent', action: 'Scheduling campaign delivery sequences', status: 'pending' },
    ];
  } else if (p.includes('revenue') || p.includes('decline') || p.includes('analysis')) {
    return [
      { agentId: 'master', agentName: 'Master Agent', action: 'Decomposing analytics task across specialist agents', status: 'pending' },
      { agentId: 'data', agentName: 'Data Agent', action: 'Extracting revenue data from all sources', status: 'pending' },
      { agentId: 'analytics', agentName: 'Analytics Agent', action: 'Running anomaly detection and root cause analysis', status: 'pending' },
      { agentId: 'executive', agentName: 'Executive Agent', action: 'Composing business narrative and recommendations', status: 'pending' },
    ];
  } else if (p.includes('report') || p.includes('executive')) {
    return [
      { agentId: 'master', agentName: 'Master Agent', action: 'Initiating executive report generation workflow', status: 'pending' },
      { agentId: 'data', agentName: 'Data Agent', action: 'Aggregating KPI data from all integrations', status: 'pending' },
      { agentId: 'analytics', agentName: 'Analytics Agent', action: 'Computing period-over-period comparisons', status: 'pending' },
      { agentId: 'knowledge', agentName: 'Knowledge Agent', action: 'Pulling strategic context from knowledge base', status: 'pending' },
      { agentId: 'executive', agentName: 'Executive Agent', action: 'Generating board-ready executive summary', status: 'pending' },
    ];
  }
  return [
    { agentId: 'master', agentName: 'Master Agent', action: 'Analyzing request and planning execution', status: 'pending' },
    { agentId: 'data', agentName: 'Data Agent', action: 'Gathering relevant data from connected sources', status: 'pending' },
    { agentId: 'analytics', agentName: 'Analytics Agent', action: 'Processing and analyzing extracted data', status: 'pending' },
    { agentId: 'campaign', agentName: 'Campaign Agent', action: 'Generating actionable output', status: 'pending' },
  ];
}

function getResultForStep(agentId: string, prompt: string): string {
  const results: Record<string, string> = {
    master: `Successfully orchestrated ${Math.floor(Math.random() * 4) + 3} agents · Task decomposed into ${Math.floor(Math.random() * 6) + 4} subtasks`,
    data: `Retrieved ${(Math.random() * 50000 + 5000).toFixed(0)} records from 3 sources · P95 query time: ${(Math.random() * 100 + 20).toFixed(0)}ms`,
    analytics: `Identified ${Math.floor(Math.random() * 500) + 100} high-priority customers · Model confidence: ${(Math.random() * 10 + 88).toFixed(1)}%`,
    campaign: `Generated ${Math.floor(Math.random() * 5) + 3} personalized message variants · Estimated reach: ${(Math.random() * 3000 + 500).toFixed(0)} customers`,
    workflow: `Scheduled delivery sequence across 3 channels · Est. completion: 24h`,
    knowledge: `Retrieved 12 relevant documents · Top match score: 0.94`,
    integration: `Synced data across 4 integrations · 0 errors`,
    monitoring: `All systems nominal · No anomalies detected`,
    executive: `Executive report generated · 8 key insights · 3 action items`,
  };
  return results[agentId] || 'Task completed successfully';
}

export default function CommandCenterPage() {
  const [prompt, setPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [completed, setCompleted] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const logsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const addLog = useCallback((agent: string, level: ExecutionLog['level'], message: string) => {
    setLogs(prev => [...prev, { id: generateId(), timestamp: new Date(), agent, level, message }]);
  }, []);

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  const executeAgents = async (promptText: string) => {
    setIsRunning(true);
    setCompleted(false);
    setLogs([]);
    const agentSteps = getAgentStepsForPrompt(promptText);
    setSteps(agentSteps.map(s => ({ ...s, status: 'pending' })));

    addLog('System', 'info', `Received instruction: "${promptText.slice(0, 60)}..."`);
    await sleep(600);

    for (let i = 0; i < agentSteps.length; i++) {
      setCurrentStepIdx(i);
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running', startTime: Date.now() } : s));

      addLog(agentSteps[i].agentName, 'info', `Starting: ${agentSteps[i].action}`);
      await sleep(300);
      addLog(agentSteps[i].agentName, 'info', `Initializing agent context and loading tools...`);
      await sleep(Math.random() * 1500 + 800);
      addLog(agentSteps[i].agentName, 'info', `Processing data...`);
      await sleep(Math.random() * 1000 + 500);

      const result = getResultForStep(agentSteps[i].agentId, promptText);
      addLog(agentSteps[i].agentName, 'success', `✓ ${result}`);
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'complete', result, endTime: Date.now() } : s));
      await sleep(200);
    }

    addLog('System', 'success', `✓ All agents completed · Task execution successful`);
    setCurrentStepIdx(-1);
    setIsRunning(false);
    setCompleted(true);
  };

  const handleSubmit = () => {
    if (!prompt.trim() || isRunning) return;
    executeAgents(prompt.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const reset = () => {
    setSteps([]);
    setLogs([]);
    setCompleted(false);
    setPrompt('');
    setCurrentStepIdx(-1);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const totalTime = steps.filter(s => s.endTime && s.startTime).reduce((acc, s) => acc + (s.endTime! - s.startTime!), 0);

  return (
    <AppLayout title="AI Command Center" subtitle="Natural language → autonomous agent orchestration">
      <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: 'calc(100vh - 56px)' }}>
        {/* Left: Input + Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Prompt Input */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-primary-dim)', border: '1px solid var(--border-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Natural Language Command</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Describe what you want to achieve</div>
              </div>
              {isRunning && <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 1, 2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)' }}>Executing...</span>
              </div>}
            </div>

            <textarea
              ref={inputRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRunning}
              placeholder="e.g. Find churn risk customers and generate a retention campaign..."
              style={{
                width: '100%', minHeight: '120px', resize: 'vertical',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '0.875rem', color: 'var(--color-text)',
                fontSize: '0.9rem', lineHeight: 1.6, fontFamily: 'inherit',
                outline: 'none', transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(0,230,118,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />

            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim() || isRunning}
                style={{
                  flex: 1, padding: '0.75rem', background: prompt.trim() && !isRunning ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                  color: prompt.trim() && !isRunning ? '#000' : 'var(--color-muted)',
                  border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: prompt.trim() && !isRunning ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                {isRunning ? '⏳ Executing...' : '⚡ Execute Agents'} <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>⌘↵</span>
              </button>
              {(completed || steps.length > 0) && (
                <button onClick={reset} style={{ padding: '0.75rem 1rem', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '0.875rem' }}>Reset</button>
              )}
            </div>

            {/* Example prompts */}
            {!isRunning && steps.length === 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Example commands</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {examplePrompts.map(p => (
                    <button key={p} onClick={() => setPrompt(p)} style={{ padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', fontSize: '0.75rem', color: 'var(--color-muted)', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(0,230,118,0.3)'; (e.target as HTMLElement).style.color = 'var(--color-primary)'; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.target as HTMLElement).style.color = 'var(--color-muted)'; }}
                    >{p.slice(0, 45)}...</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Agent Execution Steps */}
          {steps.length > 0 && (
            <div className="card">
              <SectionHeader
                title="Agent Execution Pipeline"
                subtitle={completed ? `Completed in ${(totalTime / 1000).toFixed(1)}s` : 'Running...'}
                action={completed ? <Badge variant="success">✓ Complete</Badge> : <Badge variant="primary">Running</Badge>}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {steps.map((step, i) => {
                  const color = AGENT_COLORS[step.agentId] || '#9CA3AF';
                  return (
                    <div key={step.agentId} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                      {/* Timeline */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${step.status === 'running' ? color : step.status === 'complete' ? color : 'rgba(255,255,255,0.1)'}`,
                          background: step.status === 'running' ? `${color}20` : step.status === 'complete' ? `${color}15` : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
                          boxShadow: step.status === 'running' ? `0 0 16px ${color}60` : 'none',
                          transition: 'all 0.3s',
                          animation: step.status === 'running' ? 'pulse-glow 2s infinite' : 'none',
                        }}>
                          {step.status === 'complete' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                           : step.status === 'running' ? <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                           : <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>{i + 1}</span>}
                        </div>
                        {i < steps.length - 1 && <div style={{ width: '2px', height: '20px', background: step.status === 'complete' ? `${color}40` : 'rgba(255,255,255,0.06)', transition: 'all 0.5s' }} />}
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? '0.5rem' : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: step.status !== 'pending' ? 'var(--color-text)' : 'var(--color-muted)', transition: 'color 0.3s' }}>{step.agentName}</span>
                          <span style={{ fontSize: '0.7rem', background: `${color}18`, color, border: `1px solid ${color}40`, borderRadius: '999px', padding: '1px 6px', fontWeight: 700 }}>
                            {step.status === 'running' ? 'ACTIVE' : step.status === 'complete' ? 'DONE' : 'WAITING'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: step.result ? '0.25rem' : 0 }}>{step.action}</div>
                        {step.result && <div style={{ fontSize: '0.78rem', color: color, fontFamily: 'monospace', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: '6px', padding: '0.375rem 0.625rem' }}>→ {step.result}</div>}
                        {step.status === 'running' && (
                          <div className="progress-bar" style={{ marginTop: '0.375rem' }}>
                            <div className="progress-bar-fill" style={{ width: '60%', animation: 'progress-bar 2s ease infinite', background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {completed && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>✅</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '0.9rem' }}>All agents completed successfully</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{steps.length} agents · {(totalTime / 1000).toFixed(1)}s total · 100% success rate</div>
                  </div>
                  <button style={{ marginLeft: 'auto', padding: '0.5rem 1rem', background: 'var(--color-primary)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer' }}>View Results →</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Agent Overview + Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Agent Fleet */}
          <div className="card">
            <SectionHeader title="Agent Fleet" subtitle="9 specialized AI agents" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
              {mockAgents.map(agent => {
                const isActive = steps.find(s => s.agentId === agent.id)?.status === 'running';
                const isDone = steps.find(s => s.agentId === agent.id)?.status === 'complete';
                return (
                  <div key={agent.id} style={{
                    padding: '0.75rem', borderRadius: '10px',
                    background: isActive ? `${agent.color}12` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? agent.color + '40' : isDone ? agent.color + '25' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.3s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isActive ? agent.color : isDone ? agent.color : 'rgba(255,255,255,0.15)', boxShadow: isActive ? `0 0 8px ${agent.color}` : 'none', transition: 'all 0.3s' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isActive ? agent.color : isDone ? 'var(--color-text)' : 'var(--color-muted)', transition: 'color 0.3s' }}>{agent.name}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{agent.role}</div>
                    <div style={{ marginTop: '0.4rem', fontSize: '0.68rem' }}>
                      <span style={{ color: isActive ? agent.color : isDone ? 'var(--color-success)' : 'var(--color-muted-dim)' }}>
                        {isActive ? '⚡ Running' : isDone ? '✓ Complete' : `${agent.tasksToday} tasks today`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Logs */}
          <div className="card" style={{ flex: 1 }}>
            <SectionHeader title="Execution Logs" subtitle="Real-time agent communication" action={logs.length > 0 ? <Badge variant="primary">{logs.length} entries</Badge> : undefined} />
            <div ref={logsRef} className="terminal" style={{ height: '280px', overflowY: 'auto' }}>
              {logs.length === 0 ? (
                <div style={{ color: '#4B5563', padding: '1rem 0' }}>
                  <div style={{ color: '#00E676', marginBottom: '0.5rem' }}>X-Bridge AI Command Center v2.0</div>
                  <div>Awaiting instruction. Enter a command above to begin agent orchestration.</div>
                  <div style={{ marginTop: '0.5rem', color: '#374151' }}>$ _</div>
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} style={{ marginBottom: '0.25rem', lineHeight: 1.5, fontSize: '0.78rem' }}>
                    <span style={{ color: '#4B5563' }}>[{log.timestamp.toLocaleTimeString()}] </span>
                    <span style={{ color: log.level === 'success' ? '#00E676' : log.level === 'warning' ? '#F59E0B' : log.level === 'error' ? '#EF4444' : '#3B82F6' }}>
                      [{log.agent}]
                    </span>
                    <span style={{ color: log.level === 'success' ? '#22C55E' : '#9CA3AF' }}> {log.message}</span>
                  </div>
                ))
              )}
              {isRunning && <div className="animate-blink" style={{ color: '#00E676' }}>_</div>}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
