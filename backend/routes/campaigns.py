"""X-Bridge AI - Campaigns Route"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()


@router.get("/")
async def list_campaigns():
    return {"campaigns": [
        {"id": "cam1", "name": "Q2 Churn Recovery Initiative", "type": "email", "status": "active",
         "sent": 2847, "opened": 1947, "clicked": 812, "converted": 142, "revenue": 304800, "ai": True},
        {"id": "cam2", "name": "Enterprise Upsell — AI Add-on", "type": "email", "status": "completed",
         "sent": 486, "opened": 389, "clicked": 201, "converted": 47, "revenue": 112800, "ai": True},
        {"id": "cam3", "name": "VIP Loyalty Program Invite", "type": "whatsapp", "status": "active",
         "sent": 1247, "opened": 1089, "clicked": 487, "converted": 0, "revenue": 0, "ai": False},
        {"id": "cam4", "name": "Onboarding Day 3 Touchpoint", "type": "email", "status": "scheduled",
         "sent": 0, "opened": 0, "clicked": 0, "converted": 0, "revenue": 0, "ai": True},
    ]}


@router.get("/{campaign_id}/metrics")
async def campaign_metrics(campaign_id: str):
    return {
        "campaign_id": campaign_id,
        "open_rate": 68.4,
        "click_rate": 28.5,
        "conversion_rate": 4.99,
        "roi": 340,
        "revenue": 304800,
    }


class CampaignCreateRequest(BaseModel):
    name: str
    type: str
    segment: Optional[str] = None
    ai_generate: bool = True


@router.post("/")
async def create_campaign(request: CampaignCreateRequest):
    return {
        "id": "cam_new",
        "name": request.name,
        "type": request.type,
        "status": "draft",
        "created_at": datetime.utcnow().isoformat(),
        "ai_generated": request.ai_generate,
    }
