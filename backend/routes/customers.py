"""X-Bridge AI - Customers Route"""
from fastapi import APIRouter, Query
from typing import Optional
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

class Customer(BaseModel):
    id: str
    name: str
    email: str
    company: str
    tier: str
    segment: str
    churn_score: float
    ltv: float
    total_orders: int
    last_active: str

MOCK_CUSTOMERS = [
    Customer(id="c001", name="Sarah Chen", email="sarah.chen@techcorp.com", company="TechCorp Inc", tier="enterprise", segment="champion", churn_score=12, ltv=48200, total_orders=47, last_active="2024-01-18"),
    Customer(id="c002", name="Marcus Williams", email="mwilliams@dataflow.io", company="DataFlow Systems", tier="pro", segment="at_risk", churn_score=67, ltv=18600, total_orders=23, last_active="2024-01-10"),
    Customer(id="c003", name="Elena Rodriguez", email="elena@cloudpeak.co", company="CloudPeak Solutions", tier="enterprise", segment="champion", churn_score=8, ltv=124000, total_orders=189, last_active="2024-01-19"),
]

@router.get("/")
async def list_customers(
    segment: Optional[str] = None,
    tier: Optional[str] = None,
    min_churn_score: Optional[float] = None,
    limit: int = Query(50, le=500),
    offset: int = 0,
):
    customers = MOCK_CUSTOMERS
    if segment:
        customers = [c for c in customers if c.segment == segment]
    if tier:
        customers = [c for c in customers if c.tier == tier]
    if min_churn_score is not None:
        customers = [c for c in customers if c.churn_score >= min_churn_score]
    return {"customers": customers[offset:offset+limit], "total": len(customers)}

@router.get("/{customer_id}")
async def get_customer(customer_id: str):
    customer = next((c for c in MOCK_CUSTOMERS if c.id == customer_id), None)
    if not customer:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.get("/segments/summary")
async def segment_summary():
    return {
        "segments": [
            {"name": "champion", "count": 2847, "pct": 22, "avg_ltv": 48200},
            {"name": "loyal", "count": 4231, "pct": 33, "avg_ltv": 22100},
            {"name": "at_risk", "count": 1892, "pct": 15, "avg_ltv": 12400},
            {"name": "churning", "count": 984, "pct": 8, "avg_ltv": 6800},
            {"name": "new", "count": 2893, "pct": 22, "avg_ltv": 2100},
        ]
    }
