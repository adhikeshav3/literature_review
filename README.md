# EPISTEME | Autonomous Systematic Literature Review Workbench
### PRISMA 2020 Compliant Research Synthesis & Evidence Extraction Engine

> **A peer-grade scientific intelligence workbench for clinical and academic systematic reviews. Built to feel 100% human-expert, rigorous, transparent, and grounded—with a clean white academic journal aesthetic (Nature/Lancet/Overleaf style), full mobile and laptop compatibility, and zero conversational fluff.**

---

## 🏛️ Pre-Loaded Benchmark Review Projects (Instant Demos)

EPISTEME comes pre-loaded with three diverse, fully analyzed gold-standard systematic reviews ready for instant demonstration:

1. **Computer Science & AI**: *Efficiency & Sparsity in Transformer Architectures* (FlashAttention, Linformer, Performer, BigBird, Reformer, etc.)
2. **Genetics & Molecular Biology**: *CRISPR-Cas9 Off-Target Cleavage & Base Editing Fidelity* (SpCas9, Prime Editing, Adenine Base Editors, GUIDESeq, etc.)
3. **Cardiology & Clinical Medicine**: *GLP-1 Receptor Agonists & Major Adverse Cardiovascular Events (MACE)* (Landmark Phase 3 trials: SELECT, SUSTAIN-6, LEADER, etc.)

Easily switch between them via the top project selector or create your own custom systematic review protocol with custom boolean queries across arXiv, CrossRef, and OpenAlex.

---

## 📱 Cross-Device Responsive Architecture

- **Laptop & Desktop Screens**: Expansive multi-column Evidence Matrix tables, interactive Cochrane RoB 2 traffic-light matrices, vector PRISMA 2020 flowcharts, and co-citation graph visualizations.
- **Mobile Phones & Tablets**: Touch-friendly horizontal navigation tabs, adaptive card-based evidence views with responsive badges, collapsible slide-over paper drawers, and stacked PRISMA flow stage cards.

---

## 🎨 Clean Academic Interface ("Non-AI" Look)

Designed intentionally to mirror prestigious peer-reviewed journals and Overleaf preprints:
- **Clean White Paper Canvas**: Slate-50 background with pure white cards, crisp borders, and deep slate typography for maximum readability.
- **Academic Hierarchy**: Clear visual demarcation for PICO parameters ($N$, Population, Intervention, Comparator, Findings).
- **Cochrane Traffic-Light Badges**: High-contrast, standard green/amber/red indicators for risk of bias appraisal.
- **Export Ready**: 1-click vector PRISMA SVG, BibTeX (`.bib`), RIS (`.ris`), and CSV Evidence Matrix.

---

## 🔬 Core Methodological Standards

EPISTEME implements recognized international standards for evidence synthesis and critical appraisal:

1. **PRISMA 2020 Statement Compliance**:
   - Four-stage structured lifecycle: **Identification**, **Screening**, **Eligibility**, and **Inclusion**.
   - Live interactive PRISMA 2020 flow chart rendering with real-time study counts, audit logs, and vector SVG export.
   - Explicit audit reasons recorded for every excluded publication (e.g. *Violates Exclusion Criterion #2: No baseline comparator reported*).

2. **Cochrane Risk of Bias (RoB 2) Traffic-Light Appraisal**:
   - Independent appraisal across five core methodological domains:
     - **D1:** Bias arising from sample randomization / selection process.
     - **D2:** Bias due to deviations from intended interventions / uncontrolled environments.
     - **D3:** Bias due to missing outcome data / incomplete benchmark runs.
     - **D4:** Bias in measurement of the outcome / metric subjectivity.
     - **D5:** Bias in selection of the reported result / cherry-picking.
   - Interactive Cochrane Traffic Light Plot with overall quality appraisal.

3. **Multi-Source Real Academic API Interrogation**:
   - **OpenAlex API:** Over 250M+ scientific records with reconstructed inverted abstracts, author affiliations, citation velocity, and open access URLs.
   - **arXiv Export API:** Real-time Atom XML queries for pre-prints in physics, computer science, quantitative biology, and mathematics.
   - **CrossRef REST API:** Peer-reviewed DOI metadata registry.
   - Integrated benchmark corpus for zero-latency instant evaluation across diverse scientific fields.

4. **Multi-Agent Systematic Review Architecture**:
   - **`SearchAgent`**: Formulates boolean expressions (`AND`, `OR`, `NOT`, wildcards) and coordinates parallel registry searches.
   - **`ScreeningAgent`**: Exact DOI matching, normalized title fuzzy de-duplication, and PRISMA Title/Abstract eligibility scoring.
   - **`ExtractionAgent`**: NLP heuristic evidence matrix parser extracting Study Design, Sample Size ($N$), Population, Intervention, Comparator, and Quantitative Metrics ($p$-values, hazard ratios, speedup, accuracy).
   - **`RiskOfBiasAgent`**: Domain-level Cochrane RoB 2 evaluator.
   - **`SynthesisAgent`**: Thematic clustering, cross-study consensus detection, empirical controversies analysis, research gap hunting, and full 8-section systematic review manuscript generation.
   - **`ExportAgent`**: Vector PRISMA SVG, BibTeX (`.bib`), RIS (`.ris`), CSV Evidence Matrix, and Publication Markdown.

---

## 🚀 Quick Start (Single Command)

### Prerequisites
- Python 3.10+
*(Frontend production bundle is pre-compiled in `frontend/dist`, requiring zero Node.js setup!)*

### Launch Application
From the repository root, execute:
```bash
python run.py
```

This single command will:
1. Verify the Python environment and local persistent store.
2. Launch the FastAPI Uvicorn server at `http://127.0.0.1:8000`.
3. Automatically launch your default web browser to the EPISTEME Workbench.

---

## 🖥️ Workbench Views & Capabilities

| View | Purpose |
|---|---|
| **Evidence Matrix** | High-density systematic extraction table with multi-criteria filtering, quantitative metrics, RoB badges, and status toggles. |
| **PRISMA 2020 Flow** | Visual, publication-ready PRISMA flowchart with stage counts, audit trail, SVG download, and print mode. |
| **Risk of Bias (RoB 2)** | Cochrane traffic-light matrix with domain breakdown charts and editable appraisal rationale. |
| **Thematic Synthesis** | Formal 8-section academic systematic review manuscript draft, consensus/divergence matrices, and research gaps. |
| **Citation Network** | Interactive co-citation graph and chronological timeline displaying paradigm shifts over time. |
| **Agent Telemetry** | Real-time terminal streaming micro-actions, queries, and deduplication audit logs. |

---

## 📦 Export Capabilities

EPISTEME supports 1-click exports tailored for academic workflows:
- **BibTeX (`.bib`)**: Standardized citation keys (`[AuthorYearTitle]`) ready for LaTeX and Overleaf.
- **RIS (`.ris`)**: Tagged format for Zotero, Mendeley, and EndNote.
- **Evidence Matrix (`.csv`)**: Clean tabular dataset ready for meta-analysis in R (`metafor`), RevMan, or Stata.
- **PRISMA Diagram (`.svg`)**: Scalable vector graphic ready for direct manuscript figure submission.
- **Full Manuscript (`.md` / Print)**: Formatted in scholarly typography with serif headings, mathematics, and formal bibliography.

---

## 🛠️ Architecture

```
review_agent/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   └── pipeline.py           # Multi-agent autonomous pipeline orchestrator
│   │   ├── models/
│   │   │   ├── paper.py              # PICO data models, EvidenceExtraction, RoB 2
│   │   │   └── project.py            # Systematic Review Protocol & PRISMA models
│   │   ├── services/
│   │   │   ├── arxiv_service.py      # arXiv Atom XML API client
│   │   │   ├── openalex_service.py   # OpenAlex REST client & inverted index parser
│   │   │   ├── crossref_service.py   # CrossRef DOI API client
│   │   │   ├── corpus_service.py     # Verified gold-standard review corpus
│   │   │   ├── extraction_heuristics.py # Scientific NLP & Cochrane RoB evaluator
│   │   │   ├── synthesis_engine.py   # Thematic synthesis & manuscript compiler
│   │   │   └── export_service.py     # BibTeX, RIS, CSV, PRISMA SVG generators
│   │   ├── storage/
│   │   │   └── db.py                 # Persistent thread-safe JSON/SQLite storage
│   │   └── main.py                   # FastAPI REST API & static web mount
│   └── data/
│       └── projects.json             # Persistent review projects database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx            # Navigation & export controls
│   │   │   ├── NavigationTabs.tsx    # 6 research tab switchers
│   │   │   ├── EvidenceMatrixTable.tsx # High-density extraction table
│   │   │   ├── PrismaFlowDiagram.tsx # PRISMA 2020 SVG flowchart
│   │   │   ├── RiskOfBiasMatrix.tsx  # Cochrane RoB 2 traffic lights
│   │   │   ├── SynthesisReportView.tsx # Publication manuscript viewer
│   │   │   ├── CitationGraphView.tsx # Citation network & paradigm timeline
│   │   │   ├── AgentAuditTerminal.tsx# Real-time agent activity telemetry
│   │   │   ├── PaperDetailDrawer.tsx # Deep-dive paper inspection drawer
│   │   │   ├── ProtocolSetupModal.tsx# New review protocol registration
│   │   │   └── AddPaperModal.tsx     # Custom paper ingestion modal
│   │   ├── services/
│   │   │   └── api.ts                # REST API client
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript type definitions
│   │   ├── App.tsx                   # Master React view
│   │   └── index.css                 # Academic typography styling
│   └── dist/                         # Production-optimized web bundle
├── run.py                            # Single-command application launcher
└── README.md
```

---

*EPISTEME — Empirical Rigor for Evidence-Based Science.*
