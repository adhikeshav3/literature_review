import os
import json
from typing import Dict, List, Optional, Any
import datetime
from ..models.project import Project, Protocol, PrismaCounts, AuditLogEntry
from ..services.corpus_service import get_default_transformer_papers
from ..services.synthesis_engine import generate_synthesis_report

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
STORAGE_FILE = os.path.join(DATA_DIR, "projects.json")

def _ensure_dir():
    os.makedirs(DATA_DIR, exist_ok=True)

def _init_seed_project() -> Project:
    default_papers = get_default_transformer_papers()
    papers_dict = {p.id: p for p in default_papers}

    included_count = sum(1 for p in default_papers if p.screening.status == "included")
    excluded_count = sum(1 for p in default_papers if p.screening.status == "excluded")

    prisma = PrismaCounts(
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

    audit_logs = [
        AuditLogEntry(
            timestamp="12:00:05",
            agent="SearchAgent",
            action="Executed Boolean Query",
            details="Retrieved records across arXiv, CrossRef, and OpenAlex for: (transformer OR 'attention mechanism') AND (efficiency OR sparse OR linear).",
            level="info"
        ),
        AuditLogEntry(
            timestamp="12:00:12",
            agent="ScreeningAgent",
            action="Deduplication & PRISMA Screening",
            details=f"De-duplicated 6 identical DOI entries. Screened {len(default_papers)} records against PICO inclusion criteria. Included {included_count}, Excluded {excluded_count}.",
            level="success"
        ),
        AuditLogEntry(
            timestamp="12:00:24",
            agent="ExtractionAgent",
            action="Systematic Evidence Extraction",
            details="Extracted methodology designs, sample sizes, interventions, baseline comparators, and quantitative metrics for all eligible studies.",
            level="info"
        ),
        AuditLogEntry(
            timestamp="12:00:32",
            agent="ScreeningAgent",
            action="Cochrane RoB 2 Critical Appraisal",
            details="Evaluated Selection, Performance, Attrition, Detection, and Reporting biases. Assigned domain traffic-light classifications.",
            level="info"
        ),
        AuditLogEntry(
            timestamp="12:00:45",
            agent="SynthesisAgent",
            action="Manuscript Draft & Thematic Synthesis",
            details="Generated PRISMA 2020 systematic review manuscript draft with 5 thematic clusters, consensus points, and identified research gaps.",
            level="success"
        )
    ]

    project = Project(
        id="proj-default-transformers",
        name="Efficiency & Sparsity in Transformer Architectures: Systematic Review",
        description="PRISMA 2020 systematic review evaluating computational complexity, memory scaling, and downstream downstream fidelity of sub-quadratic attention.",
        created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        updated_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        protocol=Protocol(),
        papers=papers_dict,
        prisma=prisma,
        audit_logs=audit_logs,
        pipeline_status="completed"
    )

    project.synthesis = generate_synthesis_report(project)
    return project

class Database:
    def __init__(self):
        _ensure_dir()
        self._projects: Dict[str, Project] = {}
        self.load()

    def load(self):
        if not os.path.exists(STORAGE_FILE):
            seed = _init_seed_project()
            self._projects = {seed.id: seed}
            self.save()
            return

        try:
            with open(STORAGE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                self._projects = {pid: Project(**pdata) for pid, pdata in data.items()}
                if not self._projects:
                    seed = _init_seed_project()
                    self._projects = {seed.id: seed}
                    self.save()
        except Exception as e:
            print(f"Error loading projects database: {e}. Reinitializing seed.")
            seed = _init_seed_project()
            self._projects = {seed.id: seed}
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
