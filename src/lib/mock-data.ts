// Mock data generators for X-Bridge AI platform
import { generateId } from './utils';

export const mockKPIs = {
  revenue: { value: 4280000, change: 18.2, trend: 'up' },
  customers: { value: 12847, change: 7.4, trend: 'up' },
  churnRate: { value: 2.8, change: -0.6, trend: 'down' },
  nps: { value: 72, change: 4, trend: 'up' },
  ltv: { value: 3240, change: 12.1, trend: 'up' },
  cac: { value: 280, change: -8.3, trend: 'down' },
  activeAgents: { value: 9, change: 2, trend: 'up' },
  workflowsRun: { value: 1847, change: 24.5, trend: 'up' },
};

export const mockRevenueData = [
  { month: 'Jan', revenue: 2400000, target: 2200000, customers: 8200 },
  { month: 'Feb', revenue: 2800000, target: 2500000, customers: 9100 },
  { month: 'Mar', revenue: 3100000, target: 2900000, customers: 9800 },
  { month: 'Apr', revenue: 2900000, target: 3100000, customers: 10200 },
  { month: 'May', revenue: 3600000, target: 3400000, customers: 11400 },
  { month: 'Jun', revenue: 3900000, target: 3700000, customers: 12100 },
  { month: 'Jul', revenue: 4280000, target: 4000000, customers: 12847 },
];

export const mockAgents = [
  { id: 'master', name: 'Master Agent', role: 'Orchestrator', status: 'active', tasksToday: 47, successRate: 98.2, latency: 120, color: '#00E676' },
  { id: 'data', name: 'Data Agent', role: 'Data Pipeline', status: 'active', tasksToday: 312, successRate: 99.1, latency: 45, color: '#3B82F6' },
  { id: 'analytics', name: 'Analytics Agent', role: 'ML Analysis', status: 'active', tasksToday: 89, successRate: 96.4, latency: 380, color: '#8B5CF6' },
  { id: 'campaign', name: 'Campaign Agent', role: 'Marketing AI', status: 'active', tasksToday: 24, successRate: 94.8, latency: 210, color: '#F59E0B' },
  { id: 'workflow', name: 'Workflow Agent', role: 'Automation', status: 'active', tasksToday: 156, successRate: 97.6, latency: 88, color: '#06B6D4' },
  { id: 'integration', name: 'Integration Agent', role: 'API Bridge', status: 'degraded', tasksToday: 78, successRate: 91.2, latency: 560, color: '#F97316' },
  { id: 'knowledge', name: 'Knowledge Agent', role: 'RAG Engine', status: 'active', tasksToday: 203, successRate: 98.7, latency: 290, color: '#EC4899' },
  { id: 'monitoring', name: 'Monitoring Agent', role: 'Observability', status: 'active', tasksToday: 8400, successRate: 99.9, latency: 12, color: '#22C55E' },
  { id: 'executive', name: 'Executive Agent', role: 'Reporting AI', status: 'idle', tasksToday: 6, successRate: 100, latency: 1200, color: '#A78BFA' },
];

export const mockCustomers = [
  { id: 'c001', name: 'Sarah Chen', email: 'sarah.chen@techcorp.com', company: 'TechCorp Inc', tier: 'Enterprise', ltv: 48200, churnScore: 12, orders: 47, joinDate: '2022-03-15', lastActive: '2024-01-18', segment: 'Champion', avatar: 'SC' },
  { id: 'c002', name: 'Marcus Williams', email: 'mwilliams@dataflow.io', company: 'DataFlow Systems', tier: 'Pro', ltv: 18600, churnScore: 67, orders: 23, joinDate: '2022-08-22', lastActive: '2024-01-10', segment: 'At Risk', avatar: 'MW' },
  { id: 'c003', name: 'Elena Rodriguez', email: 'elena@cloudpeak.co', company: 'CloudPeak Solutions', tier: 'Enterprise', ltv: 124000, churnScore: 8, orders: 189, joinDate: '2021-11-01', lastActive: '2024-01-19', segment: 'Champion', avatar: 'ER' },
  { id: 'c004', name: 'James Park', email: 'jpark@innovate.ai', company: 'Innovate.ai', tier: 'Starter', ltv: 4200, churnScore: 84, orders: 8, joinDate: '2023-06-10', lastActive: '2023-12-28', segment: 'Churning', avatar: 'JP' },
  { id: 'c005', name: 'Aisha Okonkwo', email: 'aokonkwo@nexgen.com', company: 'NexGen Labs', tier: 'Pro', ltv: 31800, churnScore: 23, orders: 64, joinDate: '2022-01-05', lastActive: '2024-01-17', segment: 'Loyal', avatar: 'AO' },
  { id: 'c006', name: 'David Kim', email: 'dkim@velocity.tech', company: 'Velocity Tech', tier: 'Enterprise', ltv: 88500, churnScore: 15, orders: 142, joinDate: '2021-07-20', lastActive: '2024-01-19', segment: 'Champion', avatar: 'DK' },
];

export const mockWorkflows = [
  { id: 'wf001', name: 'Customer Churn Prevention', status: 'active', runs: 1247, successRate: 94.2, lastRun: new Date(Date.now() - 180000), trigger: 'Scheduled', nodes: 8 },
  { id: 'wf002', name: 'Lead Scoring Pipeline', status: 'active', runs: 3891, successRate: 98.7, lastRun: new Date(Date.now() - 45000), trigger: 'Event', nodes: 12 },
  { id: 'wf003', name: 'Revenue Attribution Model', status: 'active', runs: 482, successRate: 96.1, lastRun: new Date(Date.now() - 7200000), trigger: 'Webhook', nodes: 6 },
  { id: 'wf004', name: 'Customer Onboarding Flow', status: 'paused', runs: 2156, successRate: 91.8, lastRun: new Date(Date.now() - 86400000), trigger: 'Event', nodes: 15 },
  { id: 'wf005', name: 'Campaign Auto-Send', status: 'error', runs: 89, successRate: 78.4, lastRun: new Date(Date.now() - 3600000), trigger: 'Scheduled', nodes: 9 },
];

export const mockIntegrations = [
  { id: 'int001', name: 'Shopify', category: 'E-commerce', status: 'connected', syncRate: '99.8%', lastSync: '2m ago', records: 48291, icon: '🛍️' },
  { id: 'int002', name: 'Salesforce', category: 'CRM', status: 'connected', syncRate: '98.2%', lastSync: '5m ago', records: 24847, icon: '☁️' },
  { id: 'int003', name: 'Stripe', category: 'Payments', status: 'connected', syncRate: '99.9%', lastSync: '1m ago', records: 187432, icon: '💳' },
  { id: 'int004', name: 'Segment', category: 'Analytics', status: 'connected', syncRate: '97.6%', lastSync: '3m ago', records: 2847291, icon: '📊' },
  { id: 'int005', name: 'HubSpot', category: 'Marketing', status: 'degraded', syncRate: '84.1%', lastSync: '12m ago', records: 9847, icon: '🎯' },
  { id: 'int006', name: 'SendGrid', category: 'Email', status: 'connected', syncRate: '99.4%', lastSync: '2m ago', records: 481029, icon: '📧' },
];

export const mockActivityFeed = [
  { id: generateId(), type: 'agent', message: 'Master Agent completed churn analysis for 847 customers', time: new Date(Date.now() - 45000), severity: 'success' },
  { id: generateId(), type: 'workflow', message: 'Lead Scoring Pipeline triggered for 124 new leads', time: new Date(Date.now() - 120000), severity: 'info' },
  { id: generateId(), type: 'alert', message: 'Integration Agent latency exceeded 500ms threshold', time: new Date(Date.now() - 340000), severity: 'warning' },
  { id: generateId(), type: 'campaign', message: 'Retention campaign sent to 2,847 at-risk customers', time: new Date(Date.now() - 600000), severity: 'success' },
  { id: generateId(), type: 'agent', message: 'Analytics Agent detected revenue anomaly in APAC region', time: new Date(Date.now() - 900000), severity: 'warning' },
  { id: generateId(), type: 'integration', message: 'HubSpot sync degraded - investigating API rate limits', time: new Date(Date.now() - 1200000), severity: 'error' },
  { id: generateId(), type: 'knowledge', message: 'Knowledge Agent indexed 14 new SOPs from document upload', time: new Date(Date.now() - 1800000), severity: 'success' },
];

export const mockCampaigns = [
  { id: 'camp001', name: 'Q1 Churn Recovery', type: 'email', status: 'active', sent: 2847, opened: 1891, clicked: 842, converted: 124, revenue: 48200, ai: true },
  { id: 'camp002', name: 'Enterprise Upsell Wave', type: 'email', status: 'completed', sent: 486, opened: 412, clicked: 298, converted: 67, revenue: 189400, ai: true },
  { id: 'camp003', name: 'VIP Loyalty Program', type: 'whatsapp', status: 'active', sent: 1247, opened: 1190, clicked: 892, converted: 412, revenue: 67800, ai: false },
  { id: 'camp004', name: 'Re-engagement SMS Blast', type: 'sms', status: 'scheduled', sent: 0, opened: 0, clicked: 0, converted: 0, revenue: 0, ai: true },
];

export const mockSystemHealth = {
  api: { status: 'healthy', uptime: 99.98, p95Latency: 124, requests: 48291 },
  database: { status: 'healthy', uptime: 99.99, connections: 47, queryTime: 12 },
  agents: { status: 'degraded', activeCount: 8, failedCount: 1, queueDepth: 24 },
  workflows: { status: 'healthy', running: 12, completed: 1847, failed: 3 },
  kafka: { status: 'healthy', messageRate: 8471, consumerLag: 0, partitions: 24 },
};

export const mockDocuments = [
  { id: 'doc001', name: 'Customer Success Playbook 2024.pdf', type: 'pdf', size: '2.4 MB', chunks: 48, status: 'indexed', uploadedAt: new Date(Date.now() - 86400000 * 3) },
  { id: 'doc002', name: 'API Integration Guide v3.pdf', type: 'pdf', size: '1.8 MB', chunks: 32, status: 'indexed', uploadedAt: new Date(Date.now() - 86400000 * 7) },
  { id: 'doc003', name: 'Churn Prevention SOP.docx', type: 'docx', size: '892 KB', chunks: 18, status: 'indexed', uploadedAt: new Date(Date.now() - 86400000 * 1) },
  { id: 'doc004', name: 'Revenue Analysis Report Q4.pdf', type: 'pdf', size: '4.2 MB', chunks: 67, status: 'processing', uploadedAt: new Date(Date.now() - 3600000) },
];
