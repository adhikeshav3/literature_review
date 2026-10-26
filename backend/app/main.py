import os
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Response, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, PlainTextResponse
from pydantic import BaseModel

from .models.project import Project, Protocol
from .models.paper import Paper, EvidenceExtraction, RiskOfBiasDetail, ScreeningAudit
from .storage.db import db
from .agents.pipeline import run_autonomous_pipeline
from .services.synthesis_engine import generate_synthesis_report
from .services.export_service import (
    export_bibtex,
    export_ris,
    export_csv_matrix,
    generate_prisma_svg
)

app = FastAPI(
    title="EPISTEME | Autonomous Systematic Literature Review Workbench",
    description="PRISMA 2020 Compliant Research Synthesis & Evidence Extraction Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST SCHEMAS ---
class CreateProjectRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    research_question: str
    population: Optional[str] = "Defined target population / corpus"
    intervention: Optional[str] = "Investigated intervention / approach"
    comparator: Optional[str] = "Standard comparator baseline"
    outcomes: Optional[str] = "Primary quantitative / qualitative outcomes"
    target_databases: Optional[List[str]] = ["openalex", "arxiv", "crossref"]
    search_query: Optional[str] = ""

class ScreeningUpdateRequest(BaseModel):
    status: str  # "included", "excluded", "flagged"
    exclusion_reason: Optional[str] = None
    manual_override: bool = True

class RunPipelineRequest(BaseModel):
    query: Optional[str] = None

class AddPaperRequest(BaseModel):
    title: str
    authors: Optional[List[str]] = []
    year: Optional[int] = 2023
    venue: Optional[str] = "Academic Publication"
    abstract: str
    doi: Optional[str] = None
    url: Optional[str] = None

# --- API ENDPOINTS ---

@app.get("/api/health")
def health_check():
    return {"status": "operational", "version": "1.0.0", "service": "EPISTEME Review Engine"}

@app.get("/api/projects")
def list_projects():
    return db.list_projects()

@app.post("/api/projects")
def create_project(req: CreateProjectRequest):
    protocol = Protocol(
        title=f"Protocol: {req.name}",
        research_question=req.research_question,
        population=req.population or "Target population",
        intervention=req.intervention or "Intervention",
        comparator=req.comparator or "Comparator",
        outcomes=req.outcomes or "Outcomes",
        target_databases=req.target_databases or ["openalex", "arxiv", "crossref"],
        search_query_boolean=req.search_query or req.research_question
    )
    proj = db.create_project(name=req.name, description=req.description or "", protocol=protocol)
    return proj

@app.get("/api/projects/{project_id}")
def get_project(project_id: str):
    proj = db.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: str):
    success = db.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "deleted", "id": project_id}

@app.post("/api/projects/{project_id}/run-pipeline")
def trigger_pipeline(project_id: str, req: RunPipelineRequest, background_tasks: BackgroundTasks):
    proj = db.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Run synchronously to give immediate feedback to user or fast response
    updated_proj = run_autonomous_pipeline(project_id, custom_query=req.query)
    return updated_proj

@app.put("/api/projects/{project_id}/papers/{paper_id}/screening")
def update_paper_screening(project_id: str, paper_id: str, req: ScreeningUpdateRequest):
    proj = db.get_project(project_id)
    if not proj or paper_id not in proj.papers:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    paper = proj.papers[paper_id]
    paper.screening.status = req.status
    paper.screening.manual_override = True
    if req.exclusion_reason:
        paper.screening.exclusion_reason = req.exclusion_reason
    
    # Re-calculate PRISMA counts
    inc = sum(1 for p in proj.papers.values() if p.screening.status == "included")
    exc = sum(1 for p in proj.papers.values() if p.screening.status == "excluded")
    proj.prisma.records_screened = len(proj.papers)
    proj.prisma.records_excluded = exc
    proj.prisma.fulltext_assessed = inc
    proj.prisma.included_qualitative = inc
    proj.prisma.included_quantitative = inc

    db.save_project(proj)
    return paper

@app.put("/api/projects/{project_id}/papers/{paper_id}/extraction")
def update_paper_extraction(project_id: str, paper_id: str, extraction: EvidenceExtraction):
    proj = db.get_project(project_id)
    if not proj or paper_id not in proj.papers:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    paper = proj.papers[paper_id]
    paper.extraction = extraction
    db.save_project(proj)
    return paper

@app.put("/api/projects/{project_id}/papers/{paper_id}/risk-of-bias")
def update_paper_risk_of_bias(project_id: str, paper_id: str, rob: RiskOfBiasDetail):
    proj = db.get_project(project_id)
    if not proj or paper_id not in proj.papers:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    paper = proj.papers[paper_id]
    paper.risk_of_bias = rob
    db.save_project(proj)
    return paper

@app.post("/api/projects/{project_id}/papers")
def add_custom_paper(project_id: str, req: AddPaperRequest):
    proj = db.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    
    paper = Paper(
        title=req.title,
        authors=req.authors or ["Manual Entry"],
        year=req.year or 2023,
        venue=req.venue or "Direct Upload",
        abstract=req.abstract,
        doi=req.doi,
        url=req.url or (f"https://doi.org/{req.doi}" if req.doi else None),
        source="Manual Ingestion",
        screening=ScreeningAudit(status="included", score=90.0, audit_trail="Manually ingested by researcher"),
        tags=["Manual Entry", "Included Study"]
    )
    
    # Auto-extract evidence and RoB
    from .services.extraction_heuristics import perform_evidence_extraction, compute_risk_of_bias
    paper.extraction = perform_evidence_extraction(paper.title, paper.abstract)
    paper.risk_of_bias = compute_risk_of_bias(paper.abstract, paper.extraction.methodology_type)

    proj.papers[paper.id] = paper
    db.save_project(proj)
    return paper

@app.post("/api/projects/{project_id}/resynthesize")
def trigger_resynthesis(project_id: str):
    proj = db.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    
    proj.synthesis = generate_synthesis_report(proj)
    db.save_project(proj)
    return proj.synthesis

# --- EXPORT ENDPOINTS ---

@app.get("/api/projects/{project_id}/export/bibtex")
def export_bibtex_endpoint(project_id: str):
    proj = db.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    
    included_papers = [p for p in proj.papers.values() if p.screening.status == "included"]
    bib = export_bibtex(included_papers)
    return Response(
        content=bib,
        media_type="application/x-bibtex",
        headers={"Content-Disposition": f'attachment; filename="{proj.id}_citations.bib"'}
    )

@app.get("/api/projects/{project_id}/export/ris")
def export_ris_endpoint(project_id: str):
    proj = db.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    
    included_papers = [p for p in proj.papers.values() if p.screening.status == "included"]
    ris_content = export_ris(included_papers)
    return Response(
        content=ris_content,
        media_type="application/x-research-info-systems",
        headers={"Content-Disposition": f'attachment; filename="{proj.id}_citations.ris"'}
    )

@app.get("/api/projects/{project_id}/export/csv")
def export_csv_endpoint(project_id: str):
    proj = db.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    
    csv_content = export_csv_matrix(list(proj.papers.values()))
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{proj.id}_evidence_matrix.csv"'}
    )

@app.get("/api/projects/{project_id}/export/prisma-svg")
def export_prisma_svg_endpoint(project_id: str):
    proj = db.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    
    svg = generate_prisma_svg(proj)
    return Response(
        content=svg,
        media_type="image/svg+xml",
        headers={"Content-Disposition": f'attachment; filename="{proj.id}_prisma_2020.svg"'}
    )

# --- STATIC FRONTEND MOUNT ---
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend build files not found."}
