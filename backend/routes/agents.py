"""
X-Bridge AI - Agent Execution Route
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import json
import uuid
from datetime import datetime
from typing import Optional

from agents.orchestrator import run_agents

router = APIRouter()


class AgentExecuteRequest(BaseModel):
    prompt: str
    org_id: str = "demo-org"
    user_id: str = "demo-user"
    session_id: Optional[str] = None


class AgentStatusResponse(BaseModel):
    agent_id: str
    name: str
    role: str
    status: str
    tasks_today: int
    success_rate: float
    latency_ms: int


AGENT_REGISTRY = [
    AgentStatusResponse(agent_id="master", name="Master Agent", role="Orchestrator", status="active", tasks_today=47, success_rate=98.2, latency_ms=120),
    AgentStatusResponse(agent_id="data", name="Data Agent", role="Data Pipeline", status="active", tasks_today=312, success_rate=99.1, latency_ms=45),
    AgentStatusResponse(agent_id="analytics", name="Analytics Agent", role="ML Analysis", status="active", tasks_today=89, success_rate=96.4, latency_ms=380),
    AgentStatusResponse(agent_id="campaign", name="Campaign Agent", role="Marketing AI", status="active", tasks_today=24, success_rate=94.8, latency_ms=210),
    AgentStatusResponse(agent_id="workflow", name="Workflow Agent", role="Automation", status="active", tasks_today=156, success_rate=97.6, latency_ms=88),
    AgentStatusResponse(agent_id="integration", name="Integration Agent", role="API Bridge", status="degraded", tasks_today=78, success_rate=91.2, latency_ms=560),
    AgentStatusResponse(agent_id="knowledge", name="Knowledge Agent", role="RAG Engine", status="active", tasks_today=203, success_rate=98.7, latency_ms=290),
    AgentStatusResponse(agent_id="monitoring", name="Monitoring Agent", role="Observability", status="active", tasks_today=8400, success_rate=99.9, latency_ms=12),
    AgentStatusResponse(agent_id="executive", name="Executive Agent", role="Reporting AI", status="idle", tasks_today=6, success_rate=100.0, latency_ms=1200),
]


@router.get("/")
async def list_agents():
    """List all available AI agents and their status"""
    return {"agents": AGENT_REGISTRY}


@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    """Get specific agent details"""
    agent = next((a for a in AGENT_REGISTRY if a.agent_id == agent_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
    return agent


@router.post("/execute")
async def execute_agents(request: AgentExecuteRequest):
    """Execute the multi-agent system with a natural language prompt"""
    
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    session_id = request.session_id or str(uuid.uuid4())
    
    async def event_stream():
        yield f"data: {json.dumps({'type': 'started', 'session_id': session_id, 'timestamp': datetime.utcnow().isoformat()})}\n\n"
        
        async for event in run_agents(
            prompt=request.prompt,
            org_id=request.org_id,
            user_id=request.user_id,
            session_id=session_id,
        ):
            yield f"data: {json.dumps(event)}\n\n"
            await asyncio.sleep(0.1)  # Prevent overwhelming the client
        
        yield f"data: {json.dumps({'type': 'stream_end'})}\n\n"
    
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


@router.get("/executions/recent")
async def recent_executions():
    """Get recent agent execution history"""
    return {
        "executions": [
            {
                "id": str(uuid.uuid4()),
                "prompt": "Find churn risk customers and generate retention campaign",
                "status": "completed",
                "agents": ["master", "data", "analytics", "knowledge", "campaign", "workflow"],
                "duration_ms": 4200,
                "started_at": datetime.utcnow().isoformat(),
            }
        ]
    }
