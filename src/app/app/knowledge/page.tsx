'use client';

import React, { useState, useRef, useCallback } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SectionHeader, Badge, EmptyState } from '@/components/ui-components';
import { mockDocuments } from '@/lib/mock-data';
import { formatRelativeTime, generateId, sleep } from '@/lib/utils';

interface QAMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  time: Date;
}

const exampleQuestions = [
  'What is our churn prevention procedure for enterprise accounts?',
  'How do I configure the Shopify integration?',
  'What are the escalation procedures for P1 incidents?',
  'How does the lead scoring model work?',
  'What are the campaign approval requirements?',
];

const mockAnswers: Record<string, { content: string; sources: string[] }> = {
  default: {
    content: `Based on your uploaded documentation, here's what I found:

**Customer Success Playbook 2024** outlines a 3-tier intervention approach for enterprise accounts showing churn signals:

1. **Tier 1 (Churn Score 50-65):** Automated email sequence + CSM check-in within 5 business days
2. **Tier 2 (Churn Score 66-80):** Executive sponsor outreach + QBR scheduling within 3 business days  
3. **Tier 3 (Churn Score 81+):** Immediate escalation to VP Customer Success + retention offer within 24 hours

**Key metrics to monitor:**
- Login frequency (< 3x/week is a warning signal)
- Feature adoption rate (< 40% of purchased features)
- Support ticket volume increase (> 2x baseline)

The document also recommends scheduling a health check call within 48 hours of churn score exceeding 70, with a customized success plan delivered within 7 days.

*Retrieved from: Customer Success Playbook 2024.pdf, Churn Prevention SOP.docx*`,
    sources: ['Customer Success Playbook 2024.pdf', 'Churn Prevention SOP.docx'],
  }
};

export default function KnowledgePage() {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const askQuestion = useCallback(async (q: string) => {
    if (!q.trim() || isSearching) return;
    const userMsg: QAMessage = { id: generateId(), role: 'user', content: q, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsSearching(true);

    await sleep(1800);

    const answer = mockAnswers.default;
    const assistantMsg: QAMessage = {
      id: generateId(), role: 'assistant',
      content: answer.content, sources: answer.sources, time: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);
    setIsSearching(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [isSearching]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      const id = generateId();
      setUploadProgress(prev => ({ ...prev, [id]: 0 }));
      for (let p = 0; p <= 100; p += 10) {
        await sleep(100);
        setUploadProgress(prev => ({ ...prev, [id]: p }));
      }
      await sleep(300);
      setUploadProgress(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  return (
    <AppLayout title="Knowledge Base" subtitle="RAG-powered document intelligence" actions={
      <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
        + Upload Document
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={e => handleFileUpload(e.target.files)} />
      </button>
    }>
      <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', minHeight: 'calc(100vh - 56px)' }}>
        {/* Documents Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: 'Documents', value: mockDocuments.length.toString(), icon: '📄' },
              { label: 'Chunks', value: '165', icon: '🧩' },
              { label: 'Avg Score', value: '0.91', icon: '🎯' },
              { label: 'Queries/d', value: '203', icon: '🔍' },
            ].map(s => (
              <div key={s.label} style={{ padding: '0.875rem', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Upload progress */}
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} style={{ padding: '0.875rem', background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Uploading & indexing...</div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ))}

          {/* Document List */}
          <div className="card" style={{ flex: 1 }}>
            <SectionHeader title="Documents" subtitle={`${mockDocuments.length} indexed`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {mockDocuments.map(doc => (
                <div key={doc.id} style={{ padding: '0.875rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{doc.type === 'pdf' ? '📄' : '📝'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>{doc.size} · {doc.chunks} chunks</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>{formatRelativeTime(doc.uploadedAt)}</span>
                    <span style={{ background: doc.status === 'indexed' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: doc.status === 'indexed' ? '#22C55E' : '#F59E0B', border: `1px solid ${doc.status === 'indexed' ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`, borderRadius: '999px', padding: '1px 8px', fontSize: '0.65rem', fontWeight: 700 }}>{doc.status}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
              style={{ marginTop: '0.875rem', padding: '1.5rem', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,230,118,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>📁</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Drop files or click to upload</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-dim)', marginTop: '2px' }}>PDF, DOCX, TXT supported</div>
            </div>
          </div>
        </div>

        {/* Q&A Interface */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <SectionHeader
            title="Ask Your Knowledge Base"
            subtitle="Semantic search across all documents"
            action={<Badge variant="primary">ChromaDB RAG</Badge>}
          />

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: '400px', maxHeight: '500px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0', marginBottom: '1rem' }}>
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem' }}>📚</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Ask anything about your documents</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--color-muted)', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6 }}>
                  The Knowledge Agent uses RAG to find and synthesize information from your uploaded SOPs, guides, and documentation.
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                  {exampleQuestions.map(q => (
                    <button key={q} onClick={() => askQuestion(q)} style={{ padding: '0.4rem 0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', fontSize: '0.78rem', color: 'var(--color-muted)', cursor: 'pointer', textAlign: 'left' }}>
                      {q.slice(0, 45)}...
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', gap: '0.75rem', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: msg.role === 'user' ? 'linear-gradient(135deg, #8B5CF6, #3B82F6)' : 'rgba(0,230,118,0.15)', border: msg.role === 'assistant' ? '1px solid rgba(0,230,118,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div style={{ maxWidth: '80%' }}>
                    <div style={{
                      padding: '0.875rem 1rem', borderRadius: '12px', fontSize: '0.875rem', lineHeight: 1.6,
                      background: msg.role === 'user' ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                    {msg.sources && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {msg.sources.map(s => (
                          <span key={s} className="tag">📄 {s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isSearching && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🤖</div>
                <div style={{ padding: '0.875rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginRight: '4px' }}>Searching knowledge base</span>
                  {[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askQuestion(query)}
              placeholder="Ask a question about your documentation..."
              className="input"
              style={{ flex: 1, fontSize: '0.9rem' }}
              disabled={isSearching}
            />
            <button onClick={() => askQuestion(query)} disabled={!query.trim() || isSearching} className="btn-primary">
              {isSearching ? '⏳' : 'Ask →'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
