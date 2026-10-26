import xml.etree.ElementTree as ET
from typing import List
import requests
import certifi
import re
from ..models.paper import Paper, ScreeningAudit

ATOM_NS = "{http://www.w3.org/2005/Atom}"
ARXIV_NS = "{http://arxiv.org/schemas/atom}"

def search_arxiv(query: str, max_results: int = 15) -> List[Paper]:
    """
    Search arXiv via open export API using certifi for SSL validation.
    """
    papers: List[Paper] = []
    clean_query = query.replace('"', '').strip()
    encoded_query = requests.utils.quote(clean_query)
    url = f"https://export.arxiv.org/api/query?search_query=all:{encoded_query}&start=0&max_results={max_results}&sortBy=relevance&sortOrder=descending"

    try:
        resp = requests.get(
            url, 
            verify=certifi.where(), 
            timeout=8,
            headers={"User-Agent": "EPISTEME-ReviewAgent/1.0 (academic-researcher@episteme.org)"}
        )
        if resp.status_code != 200:
            return papers

        root = ET.fromstring(resp.text)
        for entry in root.findall(f"{ATOM_NS}entry"):
            id_elem = entry.find(f"{ATOM_NS}id")
            title_elem = entry.find(f"{ATOM_NS}title")
            summary_elem = entry.find(f"{ATOM_NS}summary")
            published_elem = entry.find(f"{ATOM_NS}published")
            
            raw_title = title_elem.text.strip().replace("\n", " ") if title_elem is not None and title_elem.text else "Untitled Paper"
            title = re.sub(r'\s+', ' ', raw_title)
            
            abstract = summary_elem.text.strip().replace("\n", " ") if summary_elem is not None and summary_elem.text else ""
            abstract = re.sub(r'\s+', ' ', abstract)
            
            # Authors
            authors = []
            for author in entry.findall(f"{ATOM_NS}author"):
                name_elem = author.find(f"{ATOM_NS}name")
                if name_elem is not None and name_elem.text:
                    authors.append(name_elem.text.strip())

            # Published Year
            year = 2023
            if published_elem is not None and published_elem.text:
                try:
                    year = int(published_elem.text[:4])
                except ValueError:
                    year = 2023

            # Links / DOI
            paper_url = id_elem.text.strip() if id_elem is not None and id_elem.text else None
            arxiv_id = paper_url.split("/abs/")[-1] if paper_url and "/abs/" in paper_url else None
            pdf_url = f"https://arxiv.org/pdf/{arxiv_id}.pdf" if arxiv_id else paper_url
            doi = f"10.48550/arXiv.{arxiv_id}" if arxiv_id else None

            paper = Paper(
                doi=doi,
                title=title,
                authors=authors[:6],
                year=year,
                venue="arXiv Pre-print Repository",
                abstract=abstract,
                citations_count=0,
                url=paper_url,
                pdf_url=pdf_url,
                source="arXiv",
                screening=ScreeningAudit(status="unscreened", score=70.0),
                tags=["arXiv", "Pre-print"]
            )
            papers.append(paper)
    except Exception as e:
        print(f"Error searching arXiv: {e}")
    
    return papers
