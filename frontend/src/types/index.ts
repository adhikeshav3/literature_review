export interface EvidenceExtraction {
  methodology_type: string;
  sample_size: string;
  population_setting: string;
  intervention_or_approach: string;
  comparator_or_baseline: string;
  primary_outcome: string;
  quantitative_findings: string[];
  limitations: string;
  key_findings: string;
  dataset_or_benchmark?: string;
  open_science_artifacts?: string;
}

export interface RiskOfBiasDetail {
  overall: 'Low' | 'Some Concerns' | 'High';
  selection_bias: 'Low' | 'Some Concerns' | 'High';
  performance_bias: 'Low' | 'Some Concerns' | 'High';
  attrition_bias: 'Low' | 'Some Concerns' | 'High';
  detection_bias: 'Low' | 'Some Concerns' | 'High';
  reporting_bias: 'Low' | 'Some Concerns' | 'High';
  justification: string;
}

export interface ScreeningAudit {
  status: 'included' | 'excluded' | 'unscreened' | 'flagged';
  score: number;
  confidence: number;
  exclusion_reason?: string | null;
  matched_criteria: string[];
  violated_criteria: string[];
  manual_override: boolean;
  audit_trail: string;
}

export interface Paper {
  id: string;
  doi?: string | null;
  title: string;
  authors: string[];
  year: number;
  venue?: string | null;
  abstract: string;
  citations_count: number;
  url?: string | null;
  pdf_url?: string | null;
  source: string;
  screening: ScreeningAudit;
  extraction?: EvidenceExtraction | null;
  risk_of_bias?: RiskOfBiasDetail | null;
  thematic_cluster?: string | null;
  bibtex?: string | null;
  notes?: string | null;
  tags: string[];
}

export interface Protocol {
  title: string;
  research_question: string;
  population: string;
  intervention: string;
  comparator: string;
  outcomes: string;
  study_designs: string[];
  inclusion_criteria: string[];
  exclusion_criteria: string[];
  start_year: number;
  end_year: number;
  target_databases: string[];
  search_query_boolean: string;
}

export interface PrismaCounts {
  identification_databases: number;
  identification_other: number;
  duplicates_removed: number;
  records_screened: number;
  records_excluded: number;
  fulltext_sought: number;
  fulltext_not_retrieved: number;
  fulltext_assessed: number;
  fulltext_excluded_reasons: Record<string, number>;
  included_qualitative: number;
  included_quantitative: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

export interface ThematicCluster {
  id: string;
  name: string;
  description: string;
  paper_ids: string[];
  consensus: string;
  divergence: string;
}

export interface SynthesisReport {
  title: string;
  generated_at: string;
  total_included_studies: number;
  thematic_clusters: ThematicCluster[];
  consensus_findings: string[];
  divergence_and_controversies: string[];
  identified_research_gaps: string[];
  methodological_quality_appraisal: string;
  grade_certainty: string;
  manuscript_draft: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  protocol: Protocol;
  papers: Record<string, Paper>;
  prisma: PrismaCounts;
  synthesis?: SynthesisReport | null;
  audit_logs: AuditLogEntry[];
  pipeline_status: string;
}

export interface ProjectListItem {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  papers_count: number;
  included_count: number;
  pipeline_status: string;
}
