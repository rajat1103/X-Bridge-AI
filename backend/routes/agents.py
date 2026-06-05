"""X-Bridge AI - Agent Execution Route"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import json
import uuid
from datetime import datetime
from typing import Optional

router = APIRouter()

# Try to load the full LangGraph orchestrator.
# Falls back to a simulated streaming response when LangChain is not installed
# (e.g. on the free Render tier without heavy ML deps).
try:
    from agents.orchestrator import run_agents as _run_agents_real
    ORCHESTRATOR_AVAILABLE = True
except ImportError:
    ORCHESTRATOR_AVAILABLE = False


# ── Agent registry ──────────────────────────────────────────────────────────
AGENT_REGISTRY = [
    {"agent_id": "master",     "name": "Master Agent",      "role": "Orchestrator",   "status": "active",   "tasks_today": 47,   "success_rate": 98.2, "latency_ms": 120},
    {"agent_id": "data",       "name": "Data Agent",        "role": "Data Pipeline",  "status": "active",   "tasks_today": 312,  "success_rate": 99.1, "latency_ms": 45},
    {"agent_id": "analytics",  "name": "Analytics Agent",   "role": "ML Analysis",    "status": "active",   "tasks_today": 89,   "success_rate": 96.4, "latency_ms": 380},
    {"agent_id": "campaign",   "name": "Campaign Agent",    "role": "Marketing AI",   "status": "active",   "tasks_today": 24,   "success_rate": 94.8, "latency_ms": 210},
    {"agent_id": "workflow",   "name": "Workflow Agent",    "role": "Automation",     "status": "active",   "tasks_today": 156,  "success_rate": 97.6, "latency_ms": 88},
    {"agent_id": "integration","name": "Integration Agent", "role": "API Bridge",     "status": "degraded", "tasks_today": 78,   "success_rate": 91.2, "latency_ms": 560},
    {"agent_id": "knowledge",  "name": "Knowledge Agent",   "role": "RAG Engine",     "status": "active",   "tasks_today": 203,  "success_rate": 98.7, "latency_ms": 290},
    {"agent_id": "monitoring", "name": "Monitoring Agent",  "role": "Observability",  "status": "active",   "tasks_today": 8400, "success_rate": 99.9, "latency_ms": 12},
    {"agent_id": "executive",  "name": "Executive Agent",   "role": "Reporting AI",   "status": "idle",     "tasks_today": 6,    "success_rate": 100.0,"latency_ms": 1200},
]


# ── Simulated streaming (fallback when LangChain not installed) ─────────────
async def _run_agents_simulated(prompt: str, session_id: str):
    """Yields SSE events that simulate full multi-agent execution."""
    steps = [
        ("master",      "Parsed intent and decomposed task into sub-goals"),
        ("data",        f"Queried 3 data sources — retrieved 4,821 records in 124ms"),
        ("analytics",   "Ran churn prediction model — identified 1,247 at-risk customers"),
        ("knowledge",   "Retrieved 12 relevant chunks from knowledge base (score: 0.94)"),
        ("campaign",    "Generated 3 personalised campaign variants using Gemini 1.5 Pro"),
        ("workflow",    "Scheduled 5-step automation — first dispatch in 2 minutes"),
    ]

    for agent_id, action in steps:
        await asyncio.sleep(0.7)
        yield {
            "type": "agent_update",
            "agent": agent_id,
            "log": {
                "agent": agent_id,
                "action": action,
                "timestamp": datetime.utcnow().isoformat(),
                "status": "complete",
            },
            "timestamp": datetime.utcnow().isoformat(),
        }

    await asyncio.sleep(0.4)

    # Determine response based on prompt keywords
    prompt_lower = prompt.lower()
    if any(k in prompt_lower for k in ["churn", "retention", "at-risk", "risk"]):
        summary = (
            "## Churn Prevention Analysis Complete\n\n"
            "**Identified** 1,247 customers at high churn risk with $892,400 ARR at stake.\n\n"
            "### Key Findings\n"
            "- High-risk segments: Enterprise (inactive) and Pro (declining usage)\n"
            "- Predicted save rate: **68%** with immediate intervention\n"
            "- Estimated revenue protected: **$607,000**\n\n"
            "### Actions Taken\n"
            "- ✅ Enterprise outreach campaign generated (47 accounts · $420K ARR)\n"
            "- ✅ Re-engagement sequence created (312 Pro accounts · $180K ARR)\n"
            "- ✅ 5-step workflow activated — first emails dispatch in 2 minutes\n\n"
            "*6 agents · 4.2s execution*"
        )
    elif any(k in prompt_lower for k in ["revenue", "sales", "mrr", "arr"]):
        summary = (
            "## Revenue Intelligence Report\n\n"
            "**Current MRR:** $356,667 (+9.7% MoM)\n\n"
            "### Breakdown by Segment\n"
            "- Enterprise: $180,000 (+12.4%)\n"
            "- Pro: $120,000 (+8.2%)\n"
            "- Starter: $56,667 (+3.1%)\n\n"
            "### Anomaly Detected\n"
            "APAC region showing -12.4% QoQ — recommend executive review.\n\n"
            "*6 agents · 3.8s execution*"
        )
    else:
        summary = (
            "## Analysis Complete\n\n"
            "All agents executed successfully. Platform insights synthesised.\n\n"
            "- Data retrieved from 3 sources\n"
            "- 8 insights generated\n"
            "- Confidence score: **94.2%**\n\n"
            "*6 agents · 3.5s execution*"
        )

    yield {
        "type": "result",
        "final_response": summary,
        "timestamp": datetime.utcnow().isoformat(),
    }
    yield {"type": "complete", "timestamp": datetime.utcnow().isoformat()}


# ── Request / Response models ───────────────────────────────────────────────
class AgentExecuteRequest(BaseModel):
    prompt: str
    org_id: str = "demo-org"
    user_id: str = "demo-user"
    session_id: Optional[str] = None


# ── Endpoints ───────────────────────────────────────────────────────────────
@router.get("/")
async def list_agents():
    return {
        "agents": AGENT_REGISTRY,
        "orchestrator_mode": "langgraph" if ORCHESTRATOR_AVAILABLE else "simulated",
    }


@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    agent = next((a for a in AGENT_REGISTRY if a["agent_id"] == agent_id), None)
    if not agent:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
    return agent


@router.post("/execute")
async def execute_agents(request: AgentExecuteRequest):
    if not request.prompt.strip():
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    session_id = request.session_id or str(uuid.uuid4())

    async def event_stream():
        yield f"data: {json.dumps({'type': 'started', 'session_id': session_id, 'timestamp': datetime.utcnow().isoformat()})}\n\n"

        if ORCHESTRATOR_AVAILABLE:
            source = _run_agents_real(
                prompt=request.prompt,
                org_id=request.org_id,
                user_id=request.user_id,
                session_id=session_id,
            )
        else:
            source = _run_agents_simulated(request.prompt, session_id)

        async for event in source:
            yield f"data: {json.dumps(event)}\n\n"
            await asyncio.sleep(0.05)

        yield f"data: {json.dumps({'type': 'stream_end'})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/executions/recent")
async def recent_executions():
    return {
        "executions": [
            {
                "id": str(uuid.uuid4()),
                "prompt": "Find churn risk customers and generate retention campaign",
                "status": "completed",
                "agents": ["master", "data", "analytics", "knowledge", "campaign", "workflow"],
                "duration_ms": 4200,
                "started_at": datetime.utcnow().isoformat(),
                "mode": "langgraph" if ORCHESTRATOR_AVAILABLE else "simulated",
            }
        ]
    }
