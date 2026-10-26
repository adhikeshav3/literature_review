from typing import List, Dict, Any, Optional
import requests
import certifi
import re
from ..models.paper import Paper, ScreeningAudit

def reconstruct_openalex_abstract(inverted_index: Optional[Dict[str, List[int]]]) -> str:
    """
    Reconstruct full text abstract from OpenAlex inverted index.
    Inverted index format: {"word": [pos1, pos2], ...}
    """
    if not inverted_index:
        return ""
    
    positions: List[tuple[int, str]] = []
    for word, pos_list in inverted_index.items():
        for pos in pos_list:
            positions.append((pos, word))
            
    positions.sort(key=lambda x: x[0])
    return " ".join([word for _, word in positions])

def search_openalex(query: str, max_results: int = 15) -> List[Paper]:
    """
    Search OpenAlex 250M+ scientific corpus.
    """
    papers: List[Paper] = []
    clean_query = query.replace('"', '').strip()
    encoded_query = requests.utils.quote(clean_query)
    url = f"https://api.openalex.org/works?search={encoded_query}&per-page={max_results}&sort=cited_by_count:desc"

    try:
        resp = requests.get(
            url,
            verify=certifi.where(),
            timeout=8,
            headers={
                "User-Agent": "EPISTEME-ReviewAgent/1.0 (academic-researcher@episteme.org)"
            }
        )
        if resp.status_code != 200:
            return papers

        data = resp.json()
        results = data.get("results", [])

        for item in results:
            title = item.get("title") or "Untitled Paper"
            title = re.sub(r'\s+', ' ', title).strip()
            
            # Abstract
            abstract = reconstruct_openalex_abstract(item.get("abstract_inverted_index"))
            if not abstract:
                abstract = f"Abstract unavailable in index. Work focuses on {clean_query}."
                
            # Authors
            authors = []
            for authorship in item.get("authorships", []):
                author_obj = authorship.get("author", {})
                name = author_obj.get("display_name")
                if name:
                    authors.append(name)

            # Venue
            venue = "Academic Journal / Conference"
            loc = item.get("primary_location") or {}
            source = loc.get("source") or {}
            if source.get("display_name"):
                venue = source.get("display_name")

            # DOI
            raw_doi = item.get("doi")
            doi = raw_doi.replace("https://doi.org/", "") if raw_doi else None

            # Year
            year = item.get("publication_year") or 2023

            # Citations
            citations = item.get("cited_by_count") or 0

            # PDF / OA URL
            oa = item.get("open_access") or {}
            oa_url = oa.get("oa_url") or item.get("id")

            # Concepts
            tags = []
            for c in item.get("concepts", [])[:4]:
                if c.get("display_name"):
                    tags.append(c.get("display_name"))

            paper = Paper(
                doi=doi,
                title=title,
                authors=authors[:6] if authors else ["Author Details Withheld"],
                year=year,
                venue=venue,
                abstract=abstract,
                citations_count=citations,
                url=item.get("id"),
                pdf_url=oa_url,
                source="OpenAlex",
                screening=ScreeningAudit(status="unscreened", score=75.0),
                tags=tags or ["Scientific Literature"]
            )
            papers.append(paper)
    except Exception as e:
        print(f"Error searching OpenAlex: {e}")

    return papers
