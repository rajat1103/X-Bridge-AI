"""X-Bridge AI - Analytics Route"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import re

router = APIRouter()

class NLQueryRequest(BaseModel):
    query: str
    org_id: str = "demo-org"

@router.post("/query")
async def natural_language_query(request: NLQueryRequest):
    """Convert natural language to SQL and return insights"""
    query = request.query.lower()
    
    # Simple intent detection
    if "revenue" in query or "mrr" in query or "arr" in query:
        sql = "SELECT date_trunc('month', created_at) AS month, SUM(amount) AS revenue FROM orders GROUP BY 1 ORDER BY 1 DESC LIMIT 12"
        explanation = "Revenue analysis shows 18.2% YoY growth driven by enterprise expansion. APAC region is a key growth driver at +31% QoQ."
        chart_type = "area"
    elif "churn" in query:
        sql = "SELECT segment, AVG(churn_score) as avg_score, COUNT(*) as count FROM customers WHERE churn_score > 50 GROUP BY segment"
        explanation = "2.8% overall churn rate, with highest risk in Pro tier inactive accounts (>60 days). Immediate intervention recommended for 1,247 accounts."
        chart_type = "bar"
    elif "customer" in query:
        sql = "SELECT tier, COUNT(*) as count, AVG(ltv) as avg_ltv FROM customers GROUP BY tier ORDER BY avg_ltv DESC"
        explanation = "Enterprise customers drive 67% of revenue with 3.2x higher LTV than Pro tier. Focus acquisition on enterprise-grade prospects."
        chart_type = "pie"
    else:
        sql = "SELECT * FROM analytics_snapshots WHERE snapshot_date >= NOW() - INTERVAL '90 days' ORDER BY snapshot_date DESC"
        explanation = "Platform showing consistent growth across all key metrics. Q3 performance exceeds targets by 12.4%."
        chart_type = "line"
    
    return {
        "query": request.query,
        "sql": sql,
        "chart_type": chart_type,
        "explanation": explanation,
        "execution_time_ms": 124,
        "rows_returned": 7,
        "cached": False,
    }

@router.get("/kpis")
async def get_kpis():
    return {
        "kpis": {
            "revenue": {"value": 4280000, "change": 18.2, "trend": "up"},
            "customers": {"value": 12847, "change": 7.4, "trend": "up"},
            "churn_rate": {"value": 2.8, "change": -0.6, "trend": "down"},
            "nps": {"value": 72, "change": 4, "trend": "up"},
            "ltv": {"value": 3240, "change": 12.1, "trend": "up"},
            "cac": {"value": 280, "change": -8.3, "trend": "down"},
        }
    }

@router.get("/revenue/monthly")
async def monthly_revenue():
    return {
        "data": [
            {"month": "Jan", "revenue": 2400000, "target": 2200000},
            {"month": "Feb", "revenue": 2800000, "target": 2500000},
            {"month": "Mar", "revenue": 3100000, "target": 2900000},
            {"month": "Apr", "revenue": 2900000, "target": 3100000},
            {"month": "May", "revenue": 3600000, "target": 3400000},
            {"month": "Jun", "revenue": 3900000, "target": 3700000},
            {"month": "Jul", "revenue": 4280000, "target": 4000000},
        ]
    }

@router.get("/retention")
async def retention_analysis():
    return {
        "cohorts": [
            {"month": "Jan", "d30": 98, "d60": 94, "d90": 88, "d180": 78},
            {"month": "Feb", "d30": 97, "d60": 93, "d90": 87, "d180": 77},
            {"month": "Mar", "d30": 98.5, "d60": 95, "d90": 89, "d180": 81},
            {"month": "Apr", "d30": 97, "d60": 94, "d90": 88, "d180": 79},
            {"month": "May", "d30": 99, "d60": 96, "d90": 91, "d180": 83},
        ]
    }
