"""
X-Bridge AI - Agent Orchestration with LangGraph
Multi-Agent System Implementation
"""

import asyncio
import json
import logging
from typing import Any, AsyncGenerator, TypedDict, Annotated, List
from datetime import datetime
import operator

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from core.config import settings

logger = logging.getLogger(__name__)


# ============================================================
# State Definition
# ============================================================
class AgentState(TypedDict):
    """Shared state across all agents in the graph"""
    messages: Annotated[List[BaseMessage], operator.add]
    user_prompt: str
    intent: str
    context: dict
    data_result: Any
    analytics_result: Any
    campaign_result: Any
    workflow_result: Any
    knowledge_result: Any
    final_response: str
    execution_log: List[dict]
    current_agent: str
    error: str | None


# ============================================================
# LLM Initialization
# ============================================================
def get_llm(temperature: float = 0.1):
    """Initialize Gemini LLM"""
    return ChatGoogleGenerativeAI(
        model=settings.GEMINI_MODEL,
        google_api_key=settings.GEMINI_API_KEY,
        temperature=temperature,
    )


# ============================================================
# Individual Agents
# ============================================================
async def master_agent(state: AgentState) -> AgentState:
    """Master Agent: Orchestrates all other agents"""
    logger.info("Master Agent: Analyzing user intent...")
    
    # Determine intent from prompt
    prompt = state["user_prompt"].lower()
    if "churn" in prompt or "retention" in prompt or "at-risk" in prompt:
        intent = "churn_prevention"
    elif "revenue" in prompt or "decline" in prompt or "sales" in prompt:
        intent = "revenue_analysis"
    elif "campaign" in prompt or "email" in prompt or "message" in prompt:
        intent = "campaign_generation"
    elif "report" in prompt or "executive" in prompt or "summary" in prompt:
        intent = "executive_report"
    elif "customer" in prompt and ("profile" in prompt or "360" in prompt):
        intent = "customer_intelligence"
    else:
        intent = "general_analysis"
    
    log_entry = {
        "agent": "master",
        "action": f"Parsed intent: {intent}",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "complete"
    }
    
    return {
        **state,
        "intent": intent,
        "current_agent": "master",
        "execution_log": state.get("execution_log", []) + [log_entry],
        "messages": state["messages"] + [
            AIMessage(content=f"Master Agent: Intent classified as '{intent}'. Orchestrating agent team...")
        ]
    }


async def data_agent(state: AgentState) -> AgentState:
    """Data Agent: Retrieves and processes data"""
    logger.info("Data Agent: Querying data sources...")
    
    # Simulate data retrieval based on intent
    intent = state.get("intent", "general_analysis")
    
    if intent == "churn_prevention":
        data_result = {
            "customers_at_risk": 1247,
            "avg_churn_score": 76.4,
            "top_risk_factors": ["low_login_frequency", "high_support_tickets", "declined_renewal"],
            "total_revenue_at_risk": 892400,
            "customers": [
                {"id": "c001", "name": "Marcus Williams", "churn_score": 84, "ltv": 18600},
                {"id": "c002", "name": "James Park", "churn_score": 78, "ltv": 4200},
            ]
        }
    elif intent == "revenue_analysis":
        data_result = {
            "current_mrr": 356667,
            "prev_mrr": 325000,
            "change_pct": 9.74,
            "by_segment": {
                "enterprise": {"mrr": 180000, "change": 12.4},
                "pro": {"mrr": 120000, "change": 8.2},
                "starter": {"mrr": 56667, "change": 3.1}
            }
        }
    else:
        data_result = {
            "records_retrieved": 4821,
            "sources": ["postgresql", "shopify", "salesforce"],
            "query_time_ms": 124
        }
    
    log_entry = {
        "agent": "data",
        "action": f"Retrieved {data_result.get('customers_at_risk', data_result.get('records_retrieved', 'N/A'))} records",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "complete"
    }
    
    return {
        **state,
        "data_result": data_result,
        "current_agent": "data",
        "execution_log": state.get("execution_log", []) + [log_entry],
    }


async def analytics_agent(state: AgentState) -> AgentState:
    """Analytics Agent: ML analysis and insights"""
    logger.info("Analytics Agent: Running ML analysis...")
    
    intent = state.get("intent", "general_analysis")
    data = state.get("data_result", {})
    
    if intent == "churn_prevention":
        analytics_result = {
            "high_risk_segments": ["inactive_enterprise", "declining_usage_pro"],
            "intervention_priority": [
                {"segment": "enterprise_at_risk", "count": 47, "revenue_at_risk": 420000},
                {"segment": "pro_inactive", "count": 312, "revenue_at_risk": 180000},
            ],
            "predicted_save_rate": 0.68,
            "recommended_actions": [
                "Immediate executive outreach for accounts > $10K",
                "Automated re-engagement sequence for Pro tier",
                "Feature adoption coaching for low-usage accounts"
            ]
        }
    else:
        analytics_result = {
            "insights_count": 8,
            "anomalies_detected": 2,
            "confidence": 0.94,
            "key_finding": "Positive trend with 18.2% YoY growth"
        }
    
    log_entry = {
        "agent": "analytics",
        "action": "ML analysis complete, 8 insights generated",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "complete"
    }
    
    return {
        **state,
        "analytics_result": analytics_result,
        "current_agent": "analytics",
        "execution_log": state.get("execution_log", []) + [log_entry],
    }


async def knowledge_agent(state: AgentState) -> AgentState:
    """Knowledge Agent: RAG retrieval from ChromaDB"""
    logger.info("Knowledge Agent: Searching knowledge base...")
    
    # Simulate RAG retrieval
    knowledge_result = {
        "documents_searched": 4,
        "chunks_retrieved": 12,
        "top_match_score": 0.94,
        "relevant_content": [
            "Customer Success Playbook: Tier 1 intervention within 5 business days",
            "Churn Prevention SOP: Executive sponsor outreach for >$10K accounts",
            "Campaign Best Practices: Personalized messaging increases conversion 34%"
        ]
    }
    
    log_entry = {
        "agent": "knowledge",
        "action": f"Retrieved {knowledge_result['chunks_retrieved']} relevant chunks",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "complete"
    }
    
    return {
        **state,
        "knowledge_result": knowledge_result,
        "current_agent": "knowledge",
        "execution_log": state.get("execution_log", []) + [log_entry],
    }


async def campaign_agent(state: AgentState) -> AgentState:
    """Campaign Agent: Generates personalized campaign content"""
    logger.info("Campaign Agent: Generating campaign content...")
    
    analytics = state.get("analytics_result", {})
    
    campaign_result = {
        "campaign_name": "Q2 Churn Recovery Initiative",
        "total_recipients": 1247,
        "channels": ["email", "in-app"],
        "variants_generated": 3,
        "estimated_conversion_rate": 0.14,
        "estimated_revenue_saved": 608000,
        "messages": [
            {
                "segment": "enterprise_at_risk",
                "subject": "Personalized check-in from your Customer Success Manager",
                "type": "executive_outreach"
            },
            {
                "segment": "pro_inactive",
                "subject": "We've added 24 new features you're missing",
                "type": "feature_discovery"
            }
        ]
    }
    
    log_entry = {
        "agent": "campaign",
        "action": f"Generated {campaign_result['variants_generated']} campaign variants for {campaign_result['total_recipients']} recipients",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "complete"
    }
    
    return {
        **state,
        "campaign_result": campaign_result,
        "current_agent": "campaign",
        "execution_log": state.get("execution_log", []) + [log_entry],
    }


async def workflow_agent(state: AgentState) -> AgentState:
    """Workflow Agent: Schedules and automates execution"""
    logger.info("Workflow Agent: Setting up automation...")
    
    campaign = state.get("campaign_result", {})
    
    workflow_result = {
        "workflow_created": "churn_prevention_q2_2024",
        "trigger": "immediate",
        "steps": [
            {"step": 1, "action": "send_email", "timing": "now", "count": 486},
            {"step": 2, "action": "wait", "timing": "3 days"},
            {"step": 3, "action": "send_followup", "timing": "+3d", "count": 761},
            {"step": 4, "action": "crm_update", "timing": "+7d"},
            {"step": 5, "action": "alert_csm", "timing": "+10d"}
        ],
        "estimated_completion": "10 business days"
    }
    
    log_entry = {
        "agent": "workflow",
        "action": f"Workflow scheduled: {workflow_result['workflow_created']}",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "complete"
    }
    
    return {
        **state,
        "workflow_result": workflow_result,
        "current_agent": "workflow",
        "execution_log": state.get("execution_log", []) + [log_entry],
    }


async def synthesize_response(state: AgentState) -> AgentState:
    """Synthesize final response from all agent outputs"""
    logger.info("Synthesizing final response...")
    
    intent = state.get("intent", "general_analysis")
    data = state.get("data_result", {})
    analytics = state.get("analytics_result", {})
    campaign = state.get("campaign_result", {})
    workflow = state.get("workflow_result", {})
    
    if intent == "churn_prevention":
        final_response = f"""
## Churn Prevention Analysis Complete

**Summary:** Identified {data.get('customers_at_risk', 'N/A')} customers at high churn risk with ${data.get('total_revenue_at_risk', 0):,.0f} revenue at stake.

### Key Insights
- High-risk segments: Enterprise (inactive) and Pro (declining usage)
- Predicted save rate: {analytics.get('predicted_save_rate', 0):.0%} with immediate intervention
- Estimated revenue protection: ${campaign.get('estimated_revenue_saved', 0):,.0f}

### Campaigns Generated
- **Enterprise Tier:** Executive outreach to 47 accounts ($420K ARR at risk)
- **Pro Tier:** Re-engagement sequence for 312 accounts ($180K ARR at risk)
- **3 message variants** created using AI personalization

### Workflow Activated
Automation scheduled with {len(workflow.get('steps', []))} steps over 10 business days.

*All agents completed successfully. Execution time: 4.2s*
"""
    else:
        final_response = "Analysis complete. All agents executed successfully."
    
    return {
        **state,
        "final_response": final_response,
        "current_agent": "synthesizer",
    }


# ============================================================
# Graph Construction
# ============================================================
def create_agent_graph() -> StateGraph:
    """Build the LangGraph multi-agent workflow"""
    
    graph = StateGraph(AgentState)
    
    # Add nodes
    graph.add_node("master", master_agent)
    graph.add_node("data", data_agent)
    graph.add_node("analytics", analytics_agent)
    graph.add_node("knowledge", knowledge_agent)
    graph.add_node("campaign", campaign_agent)
    graph.add_node("workflow", workflow_agent)
    graph.add_node("synthesize", synthesize_response)
    
    # Define routing
    def route_by_intent(state: AgentState) -> str:
        intent = state.get("intent", "general_analysis")
        if intent in ["churn_prevention", "campaign_generation"]:
            return "churn_path"
        return "analysis_path"
    
    # Set entry point
    graph.set_entry_point("master")
    
    # Edges
    graph.add_edge("master", "data")
    graph.add_edge("data", "analytics")
    graph.add_edge("analytics", "knowledge")
    graph.add_conditional_edges(
        "knowledge",
        lambda state: "campaign" if state.get("intent") in ["churn_prevention", "campaign_generation"] else "synthesize",
        {"campaign": "campaign", "synthesize": "synthesize"}
    )
    graph.add_edge("campaign", "workflow")
    graph.add_edge("workflow", "synthesize")
    graph.add_edge("synthesize", END)
    
    return graph


# ============================================================
# Main execution function
# ============================================================
async def run_agents(
    prompt: str,
    org_id: str,
    user_id: str,
    session_id: str,
) -> AsyncGenerator[dict, None]:
    """
    Execute the multi-agent system and yield streaming events
    """
    graph = create_agent_graph()
    compiled = graph.compile(checkpointer=MemorySaver())
    
    initial_state = AgentState(
        messages=[HumanMessage(content=prompt)],
        user_prompt=prompt,
        intent="",
        context={"org_id": org_id, "user_id": user_id},
        data_result=None,
        analytics_result=None,
        campaign_result=None,
        workflow_result=None,
        knowledge_result=None,
        final_response="",
        execution_log=[],
        current_agent="",
        error=None,
    )
    
    config = {"configurable": {"thread_id": session_id}}
    
    try:
        async for event in compiled.astream(initial_state, config=config):
            for node_name, state_update in event.items():
                if node_name != "__end__":
                    yield {
                        "type": "agent_update",
                        "agent": node_name,
                        "log": state_update.get("execution_log", [])[-1] if state_update.get("execution_log") else None,
                        "timestamp": datetime.utcnow().isoformat(),
                    }
        
        yield {
            "type": "complete",
            "timestamp": datetime.utcnow().isoformat(),
        }
        
    except Exception as e:
        logger.error(f"Agent execution error: {e}")
        yield {
            "type": "error",
            "message": str(e),
            "timestamp": datetime.utcnow().isoformat(),
        }
