import { Project, ProjectListItem, Paper, EvidenceExtraction, RiskOfBiasDetail } from '../types';

const BASE_URL = '/api';

export const api = {
  async getProjects(): Promise<ProjectListItem[]> {
    const res = await fetch(`${BASE_URL}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${BASE_URL}/projects/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch project ${id}`);
    return res.json();
  },

  async createProject(data: {
    name: string;
    description?: string;
    research_question: string;
    population?: string;
    intervention?: string;
    comparator?: string;
    outcomes?: string;
    target_databases?: string[];
    search_query?: string;
  }): Promise<Project> {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  async runPipeline(id: string, query?: string): Promise<Project> {
    const res = await fetch(`${BASE_URL}/projects/${id}/run-pipeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Pipeline execution failed');
    return res.json();
  },

  async updateScreening(
    projectId: string,
    paperId: string,
    status: 'included' | 'excluded' | 'flagged',
    exclusionReason?: string
  ): Promise<Paper> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/papers/${paperId}/screening`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        exclusion_reason: exclusionReason,
        manual_override: true,
      }),
    });
    if (!res.ok) throw new Error('Failed to update screening');
    return res.json();
  },

  async updateExtraction(
    projectId: string,
    paperId: string,
    extraction: EvidenceExtraction
  ): Promise<Paper> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/papers/${paperId}/extraction`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(extraction),
    });
    if (!res.ok) throw new Error('Failed to update extraction');
    return res.json();
  },

  async updateRiskOfBias(
    projectId: string,
    paperId: string,
    rob: RiskOfBiasDetail
  ): Promise<Paper> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/papers/${paperId}/risk-of-bias`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rob),
    });
    if (!res.ok) throw new Error('Failed to update risk of bias');
    return res.json();
  },

  async addPaper(
    projectId: string,
    paper: {
      title: string;
      authors?: string[];
      year?: number;
      venue?: string;
      abstract: string;
      doi?: string;
      url?: string;
    }
  ): Promise<Paper> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/papers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paper),
    });
    if (!res.ok) throw new Error('Failed to add study');
    return res.json();
  },

  async resynthesize(projectId: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/projects/${projectId}/resynthesize`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to re-synthesize');
    return res.json();
  },

  getExportUrl(projectId: string, type: 'bibtex' | 'ris' | 'csv' | 'prisma-svg'): string {
    return `${BASE_URL}/projects/${projectId}/export/${type}`;
  },
};
