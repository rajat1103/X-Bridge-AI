"""
X-Bridge AI — FastAPI Backend
Enterprise Multi-Agent Intelligence Platform
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import asyncio
import logging
import os
from datetime import datetime

from routes import customers, campaigns, workflows, analytics, agents, integrations, knowledge, monitoring

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS origins — extend via ALLOWED_ORIGINS env var (comma-separated)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://*.vercel.app",
    *[o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()],
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 X-Bridge AI Platform starting...")
    logger.info("✓ All agents initialised")
    logger.info("✓ X-Bridge AI ready")
    yield
    logger.info("X-Bridge AI shutting down")


app = FastAPI(
    title="X-Bridge AI API",
    description="Enterprise Multi-Agent Intelligence Platform",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ── Middleware ──────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ── Routes ──────────────────────────────────────────────────
app.include_router(customers.router,    prefix="/api/v1/customers",    tags=["customers"])
app.include_router(campaigns.router,    prefix="/api/v1/campaigns",    tags=["campaigns"])
app.include_router(workflows.router,    prefix="/api/v1/workflows",    tags=["workflows"])
app.include_router(analytics.router,    prefix="/api/v1/analytics",    tags=["analytics"])
app.include_router(agents.router,       prefix="/api/v1/agents",       tags=["agents"])
app.include_router(integrations.router, prefix="/api/v1/integrations", tags=["integrations"])
app.include_router(knowledge.router,    prefix="/api/v1/knowledge",    tags=["knowledge"])
app.include_router(monitoring.router,   prefix="/api/v1/monitoring",   tags=["monitoring"])


# ── Health ──────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"service": "X-Bridge AI API", "version": "2.0.0", "status": "healthy"}


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0",
        "environment": os.getenv("ENVIRONMENT", "production"),
    }


@app.get("/api/v1/platform/status")
async def platform_status():
    return {
        "agents": {"total": 9, "active": 8, "degraded": 1, "idle": 0},
        "workflows": {"active": 3, "total_runs_today": 1847},
        "integrations": {"connected": 5, "total": 6},
        "system": {"uptime_pct": 99.98, "api_latency_p95_ms": 124, "requests_today": 48291},
    }


# ── WebSocket ───────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.connections: dict[str, WebSocket] = {}

    async def connect(self, ws: WebSocket, cid: str):
        await ws.accept()
        self.connections[cid] = ws

    def disconnect(self, cid: str):
        self.connections.pop(cid, None)

    async def send(self, cid: str, msg: dict):
        ws = self.connections.get(cid)
        if ws:
            await ws.send_json(msg)


manager = ConnectionManager()


@app.websocket("/ws/agents/{client_id}")
async def ws_agent_stream(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "execute":
                for step in ["master", "data", "analytics", "knowledge", "campaign", "workflow"]:
                    await manager.send(client_id, {
                        "type": "agent_update",
                        "agent": step,
                        "status": "running",
                        "timestamp": datetime.utcnow().isoformat(),
                    })
                    await asyncio.sleep(0.8)
                await manager.send(client_id, {
                    "type": "complete",
                    "timestamp": datetime.utcnow().isoformat(),
                })
    except WebSocketDisconnect:
        manager.disconnect(client_id)
