"""X-Bridge AI - Monitoring Route"""
from fastapi import APIRouter
from datetime import datetime, timedelta
import random

router = APIRouter()


@router.get("/health")
async def system_health():
    return {
        "api": {"status": "healthy", "uptime": 99.98, "requests_today": 48291, "p95_ms": 124},
        "agents": {"status": "healthy", "active": 8, "total": 9, "degraded": 1},
        "database": {"status": "healthy", "connections": 8, "pool_size": 20, "query_p95_ms": 12},
        "integrations": {"status": "degraded", "connected": 5, "total": 6},
        "kafka": {"status": "healthy", "message_rate": 2847, "consumer_lag": 0, "partitions": 24},
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/alerts")
async def get_alerts():
    return {"alerts": [
        {
            "id": "a1",
            "severity": "warning",
            "title": "Integration Agent p95 latency > 500ms",
            "message": "HubSpot API response times exceeding threshold. Investigating rate limits.",
            "source": "integration_agent",
            "acknowledged": False,
            "created_at": (datetime.utcnow() - timedelta(minutes=6)).isoformat(),
        },
        {
            "id": "a2",
            "severity": "info",
            "title": "HubSpot sync degraded — investigating",
            "message": "Sync frequency reduced to every 30m while issue is resolved.",
            "source": "integration_hub",
            "acknowledged": False,
            "created_at": (datetime.utcnow() - timedelta(minutes=12)).isoformat(),
        },
        {
            "id": "a3",
            "severity": "success",
            "title": "Kafka consumer lag resolved",
            "message": "Consumer group caught up. Lag returned to 0.",
            "source": "kafka",
            "acknowledged": True,
            "created_at": (datetime.utcnow() - timedelta(minutes=30)).isoformat(),
        },
    ]}


@router.patch("/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    return {"alert_id": alert_id, "acknowledged": True, "acknowledged_at": datetime.utcnow().isoformat()}


@router.get("/metrics/latency")
async def latency_metrics():
    return {
        "p50_ms": round(50 + random.random() * 30, 1),
        "p95_ms": round(100 + random.random() * 80, 1),
        "p99_ms": round(200 + random.random() * 150, 1),
        "requests_per_sec": round(600 + random.random() * 300),
        "error_rate": round(random.random() * 0.5, 3),
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/metrics/agents")
async def agent_metrics():
    agents = [
        {"id": "master", "tasks_today": 47, "success_rate": 98.2, "latency_ms": 120, "status": "active"},
        {"id": "data", "tasks_today": 312, "success_rate": 99.1, "latency_ms": 45, "status": "active"},
        {"id": "analytics", "tasks_today": 89, "success_rate": 96.4, "latency_ms": 380, "status": "active"},
        {"id": "campaign", "tasks_today": 24, "success_rate": 94.8, "latency_ms": 210, "status": "active"},
        {"id": "workflow", "tasks_today": 156, "success_rate": 97.6, "latency_ms": 88, "status": "active"},
        {"id": "integration", "tasks_today": 78, "success_rate": 91.2, "latency_ms": 560, "status": "degraded"},
        {"id": "knowledge", "tasks_today": 203, "success_rate": 98.7, "latency_ms": 290, "status": "active"},
        {"id": "monitoring", "tasks_today": 8400, "success_rate": 99.9, "latency_ms": 12, "status": "active"},
        {"id": "executive", "tasks_today": 6, "success_rate": 100.0, "latency_ms": 1200, "status": "idle"},
    ]
    return {"agents": agents, "timestamp": datetime.utcnow().isoformat()}
