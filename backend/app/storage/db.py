import os
import json
from typing import Dict, List, Optional, Any
import datetime
from ..models.project import Project, Protocol, PrismaCounts, AuditLogEntry
from ..services.corpus_service import (
    get_default_transformer_papers,
    get_default_crispr_papers,
    get_default_glp1_papers
)
from ..services.synthesis_engine import generate_synthesis_report

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
STORAGE_FILE = os.path.join(DATA_DIR, "projects.json")

def _ensure_dir():
    os.makedirs(DATA_DIR, exist_ok=True)

def _build_crispr_project() -> Project:
    papers = get_default_crispr_papers()
    papers_dict = {p.id: p for p in papers}
    inc = sum(1 for p in papers if p.screening.status == "included")
    exc = sum(1 for p in papers if p.screening.status == "excluded")

    protocol = Protocol(
        title="Protocol: CRISPR-Cas9 Off-Target Specificity",
        research_question="What engineered Cas variants and base editing architectures achieve minimal off-target double-strand breaks in human cell models?",
        population="Human genomic loci across primary and transformed cell lines",
        intervention="Engineered Cas9 variants (SpCas9-HF1, eSpCas9) and base/prime editors",
        comparator="Wild-type Streptococcus pyogenes Cas9 (wt-SpCas9)",
        outcomes="On-target indel frequency, off-target cleavage count via GUIDE-seq, product purity",
        study_designs=["Comparative Experimental Trial", "Deep Sequencing Benchmark", "Randomized In Vitro Assay"],
        inclusion_criteria=[
            "Direct comparison with wild-type SpCas9 baseline",
            "Deep targeted sequencing or unbiased genome-wide DSB profiling (GUIDE-seq, CIRCLE-seq)",
            "Reports quantitative on-target and off-target indel rates",
            "Evaluated in human cell lines"
        ],
        exclusion_criteria=[
            "Non-empirical commentary or ethical opinion pieces without molecular benchmarks",
            "Plant or non-human agricultural studies without mammalian validation",
            "Studies without wild-type baseline control"
        ],
        start_year=2015,
        end_year=2024,
        target_databases=["crossref", "openalex", "arxiv"],
        search_query_boolean='(CRISPR OR "Cas9" OR "base editor") AND (off-target OR specificity OR cleavage) AND human'
    )

    prisma = PrismaCounts(
        identification_databases=len(papers) + 4,
        duplicates_removed=4,
        records_screened=len(papers),
        records_excluded=exc,
        fulltext_sought=inc,
        fulltext_not_retrieved=0,
        fulltext_assessed=inc,
        fulltext_excluded_reasons={"Did not meet PICO population": exc},
        included_qualitative=inc,
        included_quantitative=inc
    )

    proj = Project(
        id="proj-crispr-editing",
        name="CRISPR-Cas9 Off-Target Cleavage & Base Editing Fidelity",
        description="Systematic review evaluating molecular strategies, structure-guided Cas9 engineering, and base editing to eliminate off-target genomic cleavage.",
        created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        updated_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        protocol=protocol,
        papers=papers_dict,
        prisma=prisma,
        audit_logs=[
            AuditLogEntry(agent="SearchAgent", action="Database Extraction", details="Queried CrossRef & OpenAlex for engineered Cas9 variants and genome-wide DSB counts.", level="info"),
            AuditLogEntry(agent="ScreeningAgent", action="PRISMA Screening", details=f"Screened {len(papers)} records: {inc} included, {exc} excluded with audited criteria.", level="success"),
            AuditLogEntry(agent="ExtractionAgent", action="Evidence Extraction", details=f"Extracted GUIDE-seq off-target rates, on-target indel frequencies, and sample sizes for {inc} studies.", level="info"),
            AuditLogEntry(agent="SynthesisAgent", action="Synthesis Complete", details="Compiled PRISMA 2020 systematic review manuscript across protein engineering and base editor clusters.", level="success")
        ],
        pipeline_status="completed"
    )
    proj.synthesis = generate_synthesis_report(proj)
    return proj

def _build_glp1_project() -> Project:
    papers = get_default_glp1_papers()
    papers_dict = {p.id: p for p in papers}
    inc = sum(1 for p in papers if p.screening.status == "included")
    exc = sum(1 for p in papers if p.screening.status == "excluded")

    protocol = Protocol(
        title="Protocol: GLP-1 Receptor Agonists Cardiovascular Outcomes",
        research_question="What is the comparative efficacy of GLP-1 receptor agonists on 3-point MACE and all-cause mortality in diabetic and non-diabetic cohorts?",
        population="Adults with established cardiovascular disease, diabetes, or obesity",
        intervention="Long-acting GLP-1 receptor agonists (Semaglutide, Liraglutide)",
        comparator="Placebo control alongside standard medical therapy",
        outcomes="3-point MACE (Cardiovascular death, non-fatal MI, non-fatal stroke), all-cause mortality",
        study_designs=["Randomized Controlled Trial (RCT)", "Double-Blind Phase 3 Multi-Center Trial"],
        inclusion_criteria=[
            "Phase 3 randomized double-blind placebo-controlled design",
            "Evaluates primary 3-point or 4-point composite MACE endpoint",
            "Reports hazard ratios (HR) with 95% confidence intervals and p-values",
            "Minimum 12-month follow-up period"
        ],
        exclusion_criteria=[
            "Non-empirical consumer diet opinions or lifestyle commentaries",
            "Unblinded observational case series with sample size < 100",
            "In vitro or non-human animal assays without clinical patient outcomes"
        ],
        start_year=2016,
        end_year=2024,
        target_databases=["crossref", "openalex"],
        search_query_boolean='("GLP-1" OR semaglutide OR liraglutide) AND (cardiovascular OR mortality OR MACE) AND trial'
    )

    prisma = PrismaCounts(
        identification_databases=len(papers) + 5,
        duplicates_removed=5,
        records_screened=len(papers),
        records_excluded=exc,
        fulltext_sought=inc,
        fulltext_not_retrieved=0,
        fulltext_assessed=inc,
        fulltext_excluded_reasons={"Did not meet clinical trial criteria": exc},
        included_qualitative=inc,
        included_quantitative=inc
    )

    proj = Project(
        id="proj-glp1-mace",
        name="GLP-1 Receptor Agonists & Major Adverse Cardiovascular Events (MACE)",
        description="Systematic review and meta-appraisal of landmark randomized double-blind trials evaluating semaglutide and liraglutide across diabetic and obese cohorts.",
        created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        updated_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        protocol=protocol,
        papers=papers_dict,
        prisma=prisma,
        audit_logs=[
            AuditLogEntry(agent="SearchAgent", action="Clinical Registry Query", details="Queried CrossRef & OpenAlex for Phase 3 double-blind cardiovascular outcome trials (SUSTAIN-6, LEADER, SELECT).", level="info"),
            AuditLogEntry(agent="ScreeningAgent", action="PRISMA Screening", details=f"Screened {len(papers)} candidate trials: {inc} landmark trials included, {exc} non-empirical record excluded.", level="success"),
            AuditLogEntry(agent="ExtractionAgent", action="Evidence Extraction", details=f"Extracted hazard ratios, 95% CIs, patient cohort sample sizes (n=17,604 SELECT, n=9,340 LEADER) and Cochrane RoB 2.", level="info"),
            AuditLogEntry(agent="SynthesisAgent", action="Synthesis Complete", details="Synthesized cross-trial MACE hazard reductions across diabetic and non-diabetic indications.", level="success")
        ],
        pipeline_status="completed"
    )
    proj.synthesis = generate_synthesis_report(proj)
    return proj

def _init_seed_projects() -> Dict[str, Project]:
    # 1. Transformers review
    default_papers = get_default_transformer_papers()
    papers_dict = {p.id: p for p in default_papers}
    included_count = sum(1 for p in default_papers if p.screening.status == "included")
    excluded_count = sum(1 for p in default_papers if p.screening.status == "excluded")

    prisma1 = PrismaCounts(
        identification_databases=len(default_papers) + 6,
        identification_other=0,
        duplicates_removed=6,
        records_screened=len(default_papers),
        records_excluded=excluded_count,
        fulltext_sought=included_count,
        fulltext_not_retrieved=0,
        fulltext_assessed=included_count,
        fulltext_excluded_reasons={
            "Did not meet PICO population": excluded_count,
            "No baseline comparator reported": 1,
            "Non-empirical commentary": 1
        },
        included_qualitative=included_count,
        included_quantitative=included_count
    )

    proj1 = Project(
        id="proj-default-transformers",
        name="Efficiency & Sparsity in Transformer Architectures: Systematic Review",
        description="PRISMA 2020 systematic review evaluating computational complexity, memory scaling, and downstream fidelity of sub-quadratic attention.",
        created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        updated_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        protocol=Protocol(),
        papers=papers_dict,
        prisma=prisma1,
        audit_logs=[
            AuditLogEntry(timestamp="12:00:05", agent="SearchAgent", action="Executed Boolean Query", details="Retrieved records across arXiv, CrossRef, and OpenAlex for: (transformer OR 'attention mechanism') AND (efficiency OR sparse OR linear).", level="info"),
            AuditLogEntry(timestamp="12:00:12", agent="ScreeningAgent", action="Deduplication & PRISMA Screening", details=f"De-duplicated 6 identical DOI entries. Screened {len(default_papers)} records against PICO inclusion criteria. Included {included_count}, Excluded {excluded_count}.", level="success"),
            AuditLogEntry(timestamp="12:00:24", agent="ExtractionAgent", action="Systematic Evidence Extraction", details="Extracted methodology designs, sample sizes, interventions, baseline comparators, and quantitative metrics for all eligible studies.", level="info"),
            AuditLogEntry(timestamp="12:00:32", agent="ScreeningAgent", action="Cochrane RoB 2 Critical Appraisal", details="Evaluated Selection, Performance, Attrition, Detection, and Reporting biases. Assigned domain traffic-light classifications.", level="info"),
            AuditLogEntry(timestamp="12:00:45", agent="SynthesisAgent", action="Manuscript Draft & Thematic Synthesis", details="Generated PRISMA 2020 systematic review manuscript draft with 5 thematic clusters, consensus points, and identified research gaps.", level="success")
        ],
        pipeline_status="completed"
    )
    proj1.synthesis = generate_synthesis_report(proj1)

    # 2. CRISPR review
    proj2 = _build_crispr_project()

    # 3. GLP-1 review
    proj3 = _build_glp1_project()

    return {
        proj1.id: proj1,
        proj2.id: proj2,
        proj3.id: proj3
    }

class Database:
    def __init__(self):
        _ensure_dir()
        self._projects: Dict[str, Project] = {}
        self.load()

    def load(self):
        # Seed all 3 projects if file doesn't exist or is missing any seed project
        if not os.path.exists(STORAGE_FILE):
            self._projects = _init_seed_projects()
            self.save()
            return

        try:
            with open(STORAGE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                self._projects = {pid: Project(**pdata) for pid, pdata in data.items()}
                
            # Ensure all 3 benchmark projects are always available for demonstration
            seeds = _init_seed_projects()
            updated = False
            for sid, sproj in seeds.items():
                if sid not in self._projects:
                    self._projects[sid] = sproj
                    updated = True
            if updated:
                self.save()
        except Exception as e:
            print(f"Error loading projects database: {e}. Reinitializing seed.")
            self._projects = _init_seed_projects()
            self.save()

    def save(self):
        _ensure_dir()
        with open(STORAGE_FILE, "w", encoding="utf-8") as f:
            data = {pid: proj.model_dump() for pid, proj in self._projects.items()}
            json.dump(data, f, indent=2)

    def list_projects(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "created_at": p.created_at,
                "updated_at": p.updated_at,
                "papers_count": len(p.papers),
                "included_count": sum(1 for paper in p.papers.values() if paper.screening.status == "included"),
                "pipeline_status": p.pipeline_status
            }
            for p in self._projects.values()
        ]

    def get_project(self, project_id: str) -> Optional[Project]:
        return self._projects.get(project_id)

    def save_project(self, project: Project):
        project.updated_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        self._projects[project.id] = project
        self.save()

    def create_project(self, name: str, description: str, protocol: Protocol) -> Project:
        proj = Project(
            name=name,
            description=description,
            protocol=protocol,
            created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            updated_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            papers={},
            prisma=PrismaCounts(),
            audit_logs=[
                AuditLogEntry(
                    agent="ReviewWorkbench",
                    action="Protocol Initialized",
                    details=f"Systematic review registered with research question: {protocol.research_question}",
                    level="info"
                )
            ]
        )
        self.save_project(proj)
        return proj

    def delete_project(self, project_id: str) -> bool:
        if project_id in self._projects:
            del self._projects[project_id]
            self.save()
            return True
        return False

db = Database()
