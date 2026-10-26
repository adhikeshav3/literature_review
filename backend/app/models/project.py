from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
import uuid
import datetime
from .paper import Paper

class Protocol(BaseModel):
    title: str = "Systematic Review Protocol"
    research_question: str = "What are the empirical trade-offs, accuracy benchmarks, and computational profiles of sparse attention vs dense attention in language models?"
    population: str = "Deep learning language models and sequence processing architectures"
    intervention: str = "Sparse, linear, state-space, or low-rank attention mechanisms"
    comparator: str = "Standard dense Multi-Head Self-Attention (Vaswani et al.)"
    outcomes: str = "Inference latency, memory footprint, perplexity, downstream benchmark accuracy"
    study_designs: List[str] = Field(default_factory=lambda: [
        "Benchmarking / Empirical Evaluation",
        "Systematic Review / Meta-Analysis",
        "Comparative Trial",
        "Theoretical / Algorithmic Proof"
    ])
    inclusion_criteria: List[str] = Field(default_factory=lambda: [
        "Peer-reviewed or archived empirical benchmark with reproducible methodology",
        "Direct comparison with standard transformer attention baseline",
        "Reports quantitative latency, throughput, or perplexity metrics",
        "Published between 2018 and present"
    ])
    exclusion_criteria: List[str] = Field(default_factory=lambda: [
        "Non-empirical qualitative opinion pieces or unverified editorials",
        "Studies without direct baseline comparator",
        "Non-English full-text without translation",
        "Focus solely on vision transformers without sequence modeling comparison"
    ])
    start_year: int = 2018
    end_year: int = 2026
    target_databases: List[str] = Field(default_factory=lambda: ["openalex", "arxiv", "crossref"])
    search_query_boolean: str = '(transformer OR "attention mechanism") AND (efficiency OR sparse OR linear OR "low-rank") AND (benchmark OR latency OR throughput)'

class PrismaCounts(BaseModel):
    identification_databases: int = 0
    identification_other: int = 0
    duplicates_removed: int = 0
    records_screened: int = 0
    records_excluded: int = 0
    fulltext_sought: int = 0
    fulltext_not_retrieved: int = 0
    fulltext_assessed: int = 0
    fulltext_excluded_reasons: Dict[str, int] = Field(default_factory=lambda: {
        "Did not meet PICO population": 0,
        "No baseline comparator reported": 0,
        "Non-empirical commentary": 0,
        "Insufficient outcome metrics": 0
    })
    included_qualitative: int = 0
    included_quantitative: int = 0

class AuditLogEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    timestamp: str = Field(default_factory=lambda: datetime.datetime.now().strftime("%H:%M:%S"))
    agent: str  # "SearchAgent", "ScreeningAgent", "ExtractionAgent", "SynthesisAgent", "AuditAuditor"
    action: str
    details: str
    level: str = "info"  # "info", "success", "warning", "error"

class ThematicCluster(BaseModel):
    id: str
    name: str
    description: str
    paper_ids: List[str] = Field(default_factory=list)
    consensus: str = ""
    divergence: str = ""

class SynthesisReport(BaseModel):
    title: str = "Automated Systematic Synthesis Report"
    generated_at: str = Field(default_factory=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))
    total_included_studies: int = 0
    thematic_clusters: List[ThematicCluster] = Field(default_factory=list)
    consensus_findings: List[str] = Field(default_factory=list)
    divergence_and_controversies: List[str] = Field(default_factory=list)
    identified_research_gaps: List[str] = Field(default_factory=list)
    methodological_quality_appraisal: str = ""
    grade_certainty: str = "Moderate"  # "High", "Moderate", "Low", "Very Low"
    manuscript_draft: str = ""

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = "Efficiency & Sparsity in Transformer Architectures: Systematic Review"
    description: str = "Comprehensive PRISMA 2020 systematic review evaluating computational complexity, memory scaling, and downstream downstream fidelity of sub-quadratic attention."
    created_at: str = Field(default_factory=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))
    updated_at: str = Field(default_factory=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))
    protocol: Protocol = Field(default_factory=Protocol)
    papers: Dict[str, Paper] = Field(default_factory=dict)
    prisma: PrismaCounts = Field(default_factory=PrismaCounts)
    synthesis: Optional[SynthesisReport] = None
    audit_logs: List[AuditLogEntry] = Field(default_factory=list)
    pipeline_status: str = "idle"  # "idle", "searching", "screening", "extracting", "synthesizing", "completed"
