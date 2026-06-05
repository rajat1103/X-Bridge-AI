# X-Bridge AI — Enterprise Multi-Agent Intelligence Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi" />
  <img src="https://img.shields.io/badge/LangGraph-0.2-FF4B4B" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" />
</div>

---

## Overview

X-Bridge AI is a production-grade **Enterprise Multi-Agent Intelligence Platform** that combines Agentic AI orchestration, a Customer Data Platform (CDP), Workflow Automation, Business Analytics, and real-time Monitoring in a single unified interface.

## ✨ Key Modules

| Module | Description |
|---|---|
| 🏠 **Dashboard** | Real-time KPIs, revenue charts, agent status, live activity feed |
| 🤖 **AI Command Center** | Natural language → multi-agent execution with live streaming |
| 🧠 **Multi-Agent System** | 9 specialist agents with live metrics and configuration |
| 👥 **Customer 360** | Unified profiles with churn scoring, activity, AI recommendations |
| 📈 **Analytics Center** | Revenue, retention, NLQ-to-SQL with Gemini-powered insights |
| ⚡ **Workflow Builder** | Visual SVG canvas, drag-and-drop node editor, templates |
| 🔗 **Integration Builder** | Visual data pipeline canvas + connector management |
| 📣 **Campaign Center** | Multi-channel campaigns (Email/WhatsApp/SMS) with AI generation |
| 🔍 **Monitoring Center** | Live charts, agent health matrix, real-time alert management |
| 📚 **Knowledge Base** | RAG-powered Q&A, document upload, semantic search |
| 🕸️ **Knowledge Graph** | D3.js force-directed entity relationship visualization |
| ⚙️ **Settings** | Agents, API keys, notifications, security, billing |

## 🚀 Quick Start

### Frontend (Next.js)
```bash
cd xbridge
npm install --legacy-peer-deps
npm run dev
# → http://localhost:3000
```

### Full Stack (Docker)
```bash
# Copy and configure environment
cp .env.example .env.local

# Start all services
docker-compose up -d

# Services:
# Frontend  → http://localhost:3000
# Backend   → http://localhost:8000
# API Docs  → http://localhost:8000/api/docs
# ChromaDB  → http://localhost:8001
```

## 🏗️ Architecture

```
x-bridge ai/
├── xbridge/                    # Next.js 15 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page
│   │   │   └── app/            # Application routes
│   │   │       ├── dashboard/
│   │   │       ├── command-center/
│   │   │       ├── agents/
│   │   │       ├── customers/
│   │   │       ├── analytics/
│   │   │       ├── workflows/
│   │   │       ├── integrations/
│   │   │       ├── campaigns/
│   │   │       ├── monitoring/
│   │   │       ├── knowledge/
│   │   │       ├── graph/
│   │   │       └── settings/
│   │   ├── components/         # Shared UI components
│   │   └── lib/                # Utilities, mock data, Zustand store
│   └── docker-compose.yml
│
└── backend/                    # FastAPI backend
    ├── main.py                 # Application entry point
    ├── agents/
    │   └── orchestrator.py     # LangGraph multi-agent system
    ├── routes/                 # API route handlers
    │   ├── agents.py
    │   ├── customers.py
    │   └── analytics.py
    ├── core/
    │   └── config.py           # Application configuration
    ├── sql/
    │   ├── schema.sql          # Complete PostgreSQL schema
    │   └── seed.sql            # 500-customer demo dataset
    └── requirements.txt
```

## 🤖 Multi-Agent System

The platform orchestrates 9 specialist AI agents via **LangGraph**:

| Agent | Role | Capability |
|---|---|---|
| **Master Agent** | Orchestrator | Parses intent, delegates tasks, synthesizes output |
| **Data Agent** | Pipeline | Queries PostgreSQL, Shopify, Salesforce in parallel |
| **Analytics Agent** | ML/BI | XGBoost churn prediction, anomaly detection |
| **Campaign Agent** | Marketing | Gemini-powered personalized content generation |
| **Workflow Agent** | Automation | Schedules and executes multi-step processes |
| **Integration Agent** | API Bridge | Manages 200+ external system connections |
| **Knowledge Agent** | RAG | ChromaDB semantic search over documents |
| **Monitoring Agent** | Observability | Real-time metric collection and alert management |
| **Executive Agent** | Reporting | Board-ready summaries and investor decks |

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, D3.js, Recharts, Framer Motion, Zustand

**Backend:** FastAPI, LangGraph, LangChain, Gemini 1.5 Pro, SQLAlchemy (async), Pydantic v2

**Infrastructure:** PostgreSQL 16, Redis 7, ChromaDB, Docker Compose, optional Kafka

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#0B1220` |
| Primary | `#00E676` |
| Sidebar | `#111827` |
| Card | `#1F2937` |
| Typography | Inter + JetBrains Mono |

## 📡 API

Base URL: `http://localhost:8000/api/v1`

| Endpoint | Description |
|---|---|
| `POST /agents/execute` | Stream multi-agent execution via SSE |
| `GET /agents/` | List all agents and status |
| `GET /customers/` | List customers with filtering |
| `POST /analytics/query` | Natural language → SQL |
| `GET /analytics/kpis` | Platform KPI metrics |
| `GET /monitoring/health` | System health status |
| `WS /ws/agents/{id}` | Real-time WebSocket stream |

---

Built with ❤️ by the X-Bridge AI team
