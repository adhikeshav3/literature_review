from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid

class EvidenceMetrics(BaseModel):
    sample_size: Optional[str] = "N/A"
    metric_name: Optional[str] = None
    metric_value: Optional[str] = None
    p_value: Optional[str] = None
    confidence_interval: Optional[str] = None
    effect_size: Optional[str] = None

class EvidenceExtraction(BaseModel):
    methodology_type: str = "Empirical / Observational"
    sample_size: str = "Not specified"
    population_setting: str = "Unspecified cohort/corpus"
    intervention_or_approach: str = "Standard implementation"
    comparator_or_baseline: str = "Control / SOTA baseline"
    primary_outcome: str = "Performance metrics"
    quantitative_findings: List[str] = Field(default_factory=list)
    limitations: str = "Standard methodological limitations"
    key_findings: str = "Positive correlation reported"
    dataset_or_benchmark: Optional[str] = None
    open_science_artifacts: Optional[str] = None

class RiskOfBiasDetail(BaseModel):
    overall: str = "Some Concerns"  # "Low", "Some Concerns", "High"
    selection_bias: str = "Low"
    performance_bias: str = "Some Concerns"
    attrition_bias: str = "Low"
    detection_bias: str = "Low"
    reporting_bias: str = "Low"
    justification: str = "Evaluation derived from published abstract and methodological disclosures."

class ScreeningAudit(BaseModel):
    status: str = "unscreened"  # "included", "excluded", "unscreened", "flagged"
    score: float = 75.0
    confidence: float = 0.85
    exclusion_reason: Optional[str] = None
    matched_criteria: List[str] = Field(default_factory=list)
    violated_criteria: List[str] = Field(default_factory=list)
    manual_override: bool = False
    audit_trail: str = "Automated PRISMA title & abstract screening heuristic"

class Paper(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    doi: Optional[str] = None
    title: str
    authors: List[str] = Field(default_factory=list)
    year: int = 2023
    venue: Optional[str] = "Academic Proceedings"
    abstract: str = ""
    citations_count: int = 0
    url: Optional[str] = None
    pdf_url: Optional[str] = None
    source: str = "OpenAlex"  # OpenAlex, arXiv, CrossRef, Manual
    screening: ScreeningAudit = Field(default_factory=ScreeningAudit)
    extraction: Optional[EvidenceExtraction] = None
    risk_of_bias: Optional[RiskOfBiasDetail] = None
    thematic_cluster: Optional[str] = "Core Methodologies"
    bibtex: Optional[str] = None
    notes: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
