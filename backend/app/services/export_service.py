import io
import csv
import re
from typing import List, Dict, Any
from ..models.project import Project
from ..models.paper import Paper

def clean_key(title: str, author: str, year: int) -> str:
    first_author = author.split()[-1] if author else "Author"
    first_word = re.sub(r'[^a-zA-Z]', '', title.split()[0] if title else "Paper")
    return f"{first_author.lower()}{year}{first_word.lower()}"

def export_bibtex(papers: List[Paper]) -> str:
    """Export papers to standardized BibTeX (.bib) format."""
    entries = []
    for p in papers:
        first_author = p.authors[0] if p.authors else "Unknown"
        cite_key = clean_key(p.title, first_author, p.year)
        author_field = " and ".join(p.authors) if p.authors else "Unknown"
        
        entry = (
            f"@article{{{cite_key},\n"
            f"  title = {{{{{p.title}}}}},\n"
            f"  author = {{{author_field}}},\n"
            f"  year = {{{p.year}}},\n"
            f"  journal = {{{p.venue or 'Scientific Publication'}}},\n"
        )
        if p.doi:
            entry += f"  doi = {{{p.doi}}},\n"
        if p.url:
            entry += f"  url = {{{p.url}}},\n"
        entry += "}"
        entries.append(entry)

    return "\n\n".join(entries)

def export_ris(papers: List[Paper]) -> str:
    """Export papers to standard Research Information Systems (.ris) format for Zotero/EndNote."""
    lines = []
    for p in papers:
        lines.append("TY  - JOUR")
        lines.append(f"TI  - {p.title}")
        for a in p.authors:
            lines.append(f"AU  - {a}")
        lines.append(f"PY  - {p.year}")
        if p.venue:
            lines.append(f"JO  - {p.venue}")
        if p.doi:
            lines.append(f"DO  - {p.doi}")
        if p.url:
            lines.append(f"UR  - {p.url}")
        if p.abstract:
            lines.append(f"AB  - {p.abstract}")
        lines.append("ER  - \n")

    return "\n".join(lines)

def export_csv_matrix(papers: List[Paper]) -> str:
    """Export Systematic Evidence Extraction Matrix to CSV format."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    headers = [
        "Paper ID", "Title", "First Author", "Year", "Venue", "DOI", 
        "Screening Status", "Methodology Design", "Sample Size / Scope",
        "Intervention / Proposed Approach", "Baseline Comparator", 
        "Primary Outcome", "Key Quantitative Findings", "Risk of Bias (Overall)",
        "Selection Bias", "Performance Bias", "Limitations"
    ]
    writer.writerow(headers)

    for p in papers:
        ext = p.extraction
        rob = p.risk_of_bias
        first_author = p.authors[0] if p.authors else "N/A"
        findings = "; ".join(ext.quantitative_findings) if ext and ext.quantitative_findings else ""
        
        row = [
            p.id,
            p.title,
            first_author,
            p.year,
            p.venue or "N/A",
            p.doi or "N/A",
            p.screening.status,
            ext.methodology_type if ext else "N/A",
            ext.sample_size if ext else "N/A",
            ext.intervention_or_approach if ext else "N/A",
            ext.comparator_or_baseline if ext else "N/A",
            ext.primary_outcome if ext else "N/A",
            findings,
            rob.overall if rob else "N/A",
            rob.selection_bias if rob else "N/A",
            rob.performance_bias if rob else "N/A",
            ext.limitations if ext else "N/A"
        ]
        writer.writerow(row)

    return output.getvalue()

def generate_prisma_svg(project: Project) -> str:
    """Generate high-resolution publication-quality PRISMA 2020 SVG diagram."""
    total_identified = project.prisma.identification_databases or len(project.papers)
    duplicates = project.prisma.duplicates_removed or 0
    screened = project.prisma.records_screened or total_identified
    excluded = project.prisma.records_excluded or sum(1 for p in project.papers.values() if p.screening.status == 'excluded')
    assessed = len([p for p in project.papers.values() if p.screening.status == 'included'])
    included = assessed

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 640" width="100%" height="100%" style="background-color:#ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <style>
      .phase-title {{ font-size: 14px; font-weight: 700; fill: #1e293b; text-transform: uppercase; letter-spacing: 0.05em; }}
      .box {{ fill: #f8fafc; stroke: #475569; stroke-width: 1.5; rx: 4; }}
      .box-included {{ fill: #f0fdf4; stroke: #16a34a; stroke-width: 2; rx: 4; }}
      .box-excluded {{ fill: #fff1f2; stroke: #e11d48; stroke-width: 1.5; rx: 4; }}
      .box-text-title {{ font-size: 13px; font-weight: 600; fill: #0f172a; }}
      .box-text-body {{ font-size: 12px; fill: #334155; }}
      .box-count {{ font-size: 13px; font-weight: 700; fill: #0f172a; font-family: 'JetBrains Mono', monospace; }}
      .arrow {{ stroke: #475569; stroke-width: 1.5; marker-end: url(#arrowhead); fill: none; }}
      .label-phase {{ font-size: 12px; font-weight: 700; fill: #64748b; transform: rotate(-90deg); transform-origin: 30px 100px; text-anchor: middle; }}
    </style>
    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#475569" />
    </marker>
  </defs>

  <!-- Left Phase Indicators -->
  <line x1="80" y1="20" x2="80" y2="620" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 4" />
  
  <text x="45" y="100" class="phase-title" style="transform: rotate(-90deg); transform-origin: 45px 100px;">IDENTIFICATION</text>
  <text x="45" y="270" class="phase-title" style="transform: rotate(-90deg); transform-origin: 45px 270px;">SCREENING</text>
  <text x="45" y="440" class="phase-title" style="transform: rotate(-90deg); transform-origin: 45px 440px;">ELIGIBILITY</text>
  <text x="45" y="560" class="phase-title" style="transform: rotate(-90deg); transform-origin: 45px 560px;">INCLUDED</text>

  <!-- Identification Boxes -->
  <rect x="120" y="40" width="340" height="90" class="box" />
  <text x="140" y="65" class="box-text-title">Records identified from databases:</text>
  <text x="140" y="85" class="box-text-body">arXiv (n = {sum(1 for p in project.papers.values() if p.source == 'arXiv')})</text>
  <text x="140" y="102" class="box-text-body">CrossRef &amp; OpenAlex (n = {sum(1 for p in project.papers.values() if p.source in ['CrossRef', 'OpenAlex', 'Benchmark Corpus'])})</text>
  <text x="400" y="65" class="box-count">(n = {total_identified})</text>

  <rect x="520" y="40" width="340" height="90" class="box" />
  <text x="540" y="65" class="box-text-title">Records identified from other sources:</text>
  <text x="540" y="85" class="box-text-body">Citation chaining &amp; manual reference lookups</text>
  <text x="800" y="65" class="box-count">(n = 0)</text>

  <!-- Arrow down to duplicates removed -->
  <line x1="290" y1="130" x2="290" y2="175" class="arrow" />

  <!-- Screening Phase -->
  <rect x="120" y="175" width="340" height="70" class="box" />
  <text x="140" y="202" class="box-text-title">Records screened after de-duplication:</text>
  <text x="140" y="224" class="box-text-body">Evaluated against title &amp; abstract criteria</text>
  <text x="400" y="202" class="box-count">(n = {screened})</text>

  <!-- Arrow right to excluded -->
  <line x1="460" y1="210" x2="520" y2="210" class="arrow" />
  <rect x="520" y="175" width="340" height="70" class="box-excluded" />
  <text x="540" y="202" class="box-text-title" style="fill:#9f1239;">Records excluded by screening criteria:</text>
  <text x="540" y="224" class="box-text-body" style="fill:#be123c;">Audited exclusion rationale documented</text>
  <text x="800" y="202" class="box-count" style="fill:#9f1239;">(n = {excluded})</text>

  <!-- Arrow down to reports sought -->
  <line x1="290" y1="245" x2="290" y2="295" class="arrow" />

  <!-- Eligibility Phase -->
  <rect x="120" y="295" width="340" height="70" class="box" />
  <text x="140" y="322" class="box-text-title">Reports sought for retrieval:</text>
  <text x="140" y="344" class="box-text-body">Full-text manuscripts accessed</text>
  <text x="400" y="322" class="box-count">(n = {assessed})</text>

  <line x1="460" y1="330" x2="520" y2="330" class="arrow" />
  <rect x="520" y="295" width="340" height="70" class="box" />
  <text x="540" y="322" class="box-text-title">Reports not retrieved:</text>
  <text x="540" y="344" class="box-text-body">Institutional paywall / dead DOI</text>
  <text x="800" y="322" class="box-count">(n = 0)</text>

  <!-- Arrow down to assessed for eligibility -->
  <line x1="290" y1="365" x2="290" y2="415" class="arrow" />

  <rect x="120" y="415" width="340" height="70" class="box" />
  <text x="140" y="442" class="box-text-title">Reports assessed for full-text eligibility:</text>
  <text x="140" y="464" class="box-text-body">Evidence matrix extraction completed</text>
  <text x="400" y="442" class="box-count">(n = {assessed})</text>

  <line x1="460" y1="450" x2="520" y2="450" class="arrow" />
  <rect x="520" y="415" width="340" height="70" class="box-excluded" />
  <text x="540" y="438" class="box-text-title" style="fill:#9f1239;">Reports excluded with reasons:</text>
  <text x="540" y="458" class="box-text-body" style="fill:#be123c;">Missing quantitative baseline comparator</text>
  <text x="800" y="438" class="box-count" style="fill:#9f1239;">(n = 0)</text>

  <!-- Arrow down to included -->
  <line x1="290" y1="485" x2="290" y2="535" class="arrow" />

  <!-- Included Phase -->
  <rect x="120" y="535" width="340" height="80" class="box-included" />
  <text x="140" y="562" class="box-text-title" style="fill:#166534;">Studies included in qualitative synthesis:</text>
  <text x="140" y="582" class="box-text-body" style="fill:#15803d;">Synthesized in thematic narrative (n = {included})</text>
  <text x="140" y="600" class="box-text-body" style="fill:#15803d;">Studies included in quantitative matrix (n = {included})</text>
  <text x="400" y="562" class="box-count" style="fill:#166534;">(n = {included})</text>
</svg>"""
    return svg
