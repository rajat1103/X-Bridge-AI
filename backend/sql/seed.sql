-- X-Bridge AI Seed Data
-- Realistic enterprise demo data

-- Organization
INSERT INTO organizations (id, name, slug, tier) VALUES
    ('00000000-0000-0000-0000-000000000001', 'X-Bridge Demo Corp', 'xbridge-demo', 'enterprise');

-- Users
INSERT INTO users (id, org_id, email, name, role) VALUES
    ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'alex@xbridge.ai', 'Alex Engineer', 'admin'),
    ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'sarah@xbridge.ai', 'Sarah Chen', 'member');

-- Sample customers
INSERT INTO customers (org_id, email, name, company, tier, segment, churn_score, ltv, total_orders, total_revenue, last_active)
SELECT
    '00000000-0000-0000-0000-000000000001',
    'customer' || i || '@demo.com',
    CASE (i % 10)
        WHEN 0 THEN 'Olivia Johnson'
        WHEN 1 THEN 'Noah Williams'
        WHEN 2 THEN 'Emma Brown'
        WHEN 3 THEN 'Liam Davis'
        WHEN 4 THEN 'Ava Miller'
        WHEN 5 THEN 'William Wilson'
        WHEN 6 THEN 'Sophia Moore'
        WHEN 7 THEN 'James Taylor'
        WHEN 8 THEN 'Isabella Anderson'
        ELSE 'Lucas Thomas'
    END || ' ' || i,
    CASE (i % 5)
        WHEN 0 THEN 'TechCorp Inc'
        WHEN 1 THEN 'DataFlow Systems'
        WHEN 2 THEN 'CloudPeak Solutions'
        WHEN 3 THEN 'Innovate.ai'
        ELSE 'NexGen Labs'
    END,
    CASE
        WHEN i % 7 = 0 THEN 'enterprise'
        WHEN i % 3 = 0 THEN 'pro'
        ELSE 'starter'
    END,
    CASE
        WHEN random() < 0.22 THEN 'champion'
        WHEN random() < 0.55 THEN 'loyal'
        WHEN random() < 0.70 THEN 'at_risk'
        WHEN random() < 0.78 THEN 'churning'
        ELSE 'new'
    END,
    (random() * 100)::DECIMAL(5,2),
    (random() * 50000 + 1000)::DECIMAL(12,2),
    (random() * 100 + 1)::INTEGER,
    (random() * 50000 + 1000)::DECIMAL(12,2),
    NOW() - (random() * 30 || ' days')::INTERVAL
FROM generate_series(1, 500) i;

-- Sample integrations
INSERT INTO integrations (org_id, name, provider, category, status, records_synced) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Shopify Production', 'shopify', 'ecommerce', 'connected', 48291),
    ('00000000-0000-0000-0000-000000000001', 'Salesforce CRM', 'salesforce', 'crm', 'connected', 24847),
    ('00000000-0000-0000-0000-000000000001', 'Stripe Payments', 'stripe', 'payments', 'connected', 187432),
    ('00000000-0000-0000-0000-000000000001', 'Segment Analytics', 'segment', 'analytics', 'connected', 2847291),
    ('00000000-0000-0000-0000-000000000001', 'HubSpot Marketing', 'hubspot', 'marketing', 'degraded', 9847),
    ('00000000-0000-0000-0000-000000000001', 'SendGrid Email', 'sendgrid', 'email', 'connected', 481029);

-- Sample workflows
INSERT INTO workflows (org_id, name, status, trigger_type, total_runs, successful_runs) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Customer Churn Prevention', 'active', 'scheduled', 1247, 1174),
    ('00000000-0000-0000-0000-000000000001', 'Lead Scoring Pipeline', 'active', 'event', 3891, 3842),
    ('00000000-0000-0000-0000-000000000001', 'Revenue Attribution Model', 'active', 'webhook', 482, 463),
    ('00000000-0000-0000-0000-000000000001', 'Customer Onboarding Flow', 'paused', 'event', 2156, 1979),
    ('00000000-0000-0000-0000-000000000001', 'Campaign Auto-Send', 'active', 'scheduled', 89, 70);

-- Analytics snapshots (last 7 months)
INSERT INTO analytics_snapshots (org_id, snapshot_date, metric_type, value)
SELECT
    '00000000-0000-0000-0000-000000000001',
    (NOW() - (i || ' months')::INTERVAL)::DATE,
    'mrr',
    CASE i
        WHEN 6 THEN 200000
        WHEN 5 THEN 233333
        WHEN 4 THEN 258333
        WHEN 3 THEN 241667
        WHEN 2 THEN 300000
        WHEN 1 THEN 325000
        ELSE 356667
    END
FROM generate_series(0, 6) i;
