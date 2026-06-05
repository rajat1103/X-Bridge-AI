"""X-Bridge AI - Knowledge Base Route"""
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


@router.get("/documents")
async def list_documents():
    return {"documents": [
        {"id": "doc1", "name": "Customer Success Playbook 2024.pdf", "type": "pdf",
         "size": "2.4 MB", "chunks": 48, "status": "indexed", "uploaded_at": "2024-01-15"},
        {"id": "doc2", "name": "Churn Prevention SOP.docx", "type": "docx",
         "size": "892 KB", "chunks": 23, "status": "indexed", "uploaded_at": "2024-01-12"},
        {"id": "doc3", "name": "Product Onboarding Guide.pdf", "type": "pdf",
         "size": "5.1 MB", "chunks": 67, "status": "indexed", "uploaded_at": "2024-01-10"},
        {"id": "doc4", "name": "Enterprise Sales Playbook.pdf", "type": "pdf",
         "size": "3.7 MB", "chunks": 27, "status": "indexed", "uploaded_at": "2024-01-08"},
    ]}


class QueryRequest(BaseModel):
    query: str
    top_k: int = 5


@router.post("/query")
async def query_knowledge(request: QueryRequest):
    return {
        "query": request.query,
        "answer": (
            "Based on your documentation, the churn prevention procedure for enterprise accounts "
            "involves a 3-tier intervention: Tier 1 (score 50-65) requires automated email + CSM "
            "check-in within 5 business days, Tier 2 (66-80) requires executive sponsor outreach "
            "within 3 business days, and Tier 3 (81+) requires immediate VP escalation with "
            "retention offer within 24 hours."
        ),
        "sources": [
            {"document": "Customer Success Playbook 2024.pdf", "page": 14, "score": 0.94},
            {"document": "Churn Prevention SOP.docx", "page": 3, "score": 0.87},
        ],
        "confidence": 0.94,
        "chunks_retrieved": request.top_k,
        "latency_ms": 340,
    }


@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    return {
        "id": f"doc_{int(datetime.utcnow().timestamp())}",
        "name": file.filename,
        "status": "processing",
        "uploaded_at": datetime.utcnow().isoformat(),
        "message": "Document is being chunked and indexed into ChromaDB",
    }


@router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    return {"document_id": document_id, "deleted": True}
