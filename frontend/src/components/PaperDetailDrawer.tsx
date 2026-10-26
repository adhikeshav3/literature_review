import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  FileText, 
  Copy, 
  Check, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2,
  XCircle
} from 'lucide-react';
import type { Paper } from '../types';

interface PaperDetailDrawerProps {
  paper: Paper | null;
  onClose: () => void;
  onUpdateStatus: (paperId: string, status: 'included' | 'excluded' | 'flagged', reason?: string) => void;
}

export const PaperDetailDrawer: React.FC<PaperDetailDrawerProps> = ({
  paper,
  onClose,
  onUpdateStatus,
}) => {
  const [copiedBib, setCopiedBib] = useState(false);

  if (!paper) return null;

  const ext = paper.extraction;
  const rob = paper.risk_of_bias;
  const isIncluded = paper.screening.status === 'included';
  const isExcluded = paper.screening.status === 'excluded';

  // Generate clean BibTeX snippet
  const firstAuthor = paper.authors.length > 0 ? paper.authors[0].split(' ').pop() || 'Author' : 'Author';
  const citeKey = `${firstAuthor.toLowerCase()}${paper.year}${paper.title.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}`;
  const bibtex = `@article{${citeKey},
  title = {${paper.title}},
  author = {${paper.authors.join(' and ')}},
  year = {${paper.year}},
  journal = {${paper.venue || 'Academic Repository'}},
  doi = {${paper.doi || 'N/A'}},
  url = {${paper.url || ''}}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBib(true);
    setTimeout(() => setCopiedBib(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950 shrink-0">
            <div className="pr-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold uppercase">
                  {paper.source}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isIncluded ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {paper.screening.status}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-2 leading-snug">
                {paper.title}
              </h2>
              <div className="text-xs text-slate-400 mt-1">
                {paper.authors.join(', ')} ({paper.year}) • <span className="italic">{paper.venue}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-md hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs text-slate-300">
            {/* Action Bar (Include/Exclude + External Links) */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateStatus(paper.id, 'included')}
                  className={`flex-1 xs:flex-initial px-3 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                    isIncluded ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Include Study</span>
                </button>
                <button
                  onClick={() => onUpdateStatus(paper.id, 'excluded', 'Excluded by researcher appraisal')}
                  className={`flex-1 xs:flex-initial px-3 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                    isExcluded ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Exclude Study</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 justify-end">
                {paper.doi && (
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 underline font-mono text-[11px]"
                  >
                    <span>DOI Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {paper.pdf_url && (
                  <a
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-[11px] font-medium flex items-center space-x-1"
                  >
                    <span>PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* PRISMA Screening Audit Trail */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-200 font-semibold border-b border-slate-800 pb-2">
                <span>PRISMA Screening Audit</span>
                <span className="font-mono text-sky-400">Score: {paper.screening.score}%</span>
              </div>
              {paper.screening.exclusion_reason && (
                <div className="text-rose-400 text-xs font-medium">
                  • Audit Reason: {paper.screening.exclusion_reason}
                </div>
              )}
              {paper.screening.matched_criteria.length > 0 && (
                <div className="text-emerald-400 text-xs">
                  • Matched Inclusion Criteria: {paper.screening.matched_criteria.join('; ')}
                </div>
              )}
              <div className="text-[11px] text-slate-500 italic">
                {paper.screening.audit_trail}
              </div>
            </div>

            {/* Abstract Section */}
            <div className="space-y-2">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Original Literature Abstract</span>
              </h3>
              <p className="font-serif leading-relaxed text-justify bg-slate-950 p-3.5 sm:p-4 rounded-lg border border-slate-800 text-slate-300">
                {paper.abstract}
              </p>
            </div>

            {/* Systematic Evidence Extraction Details */}
            {ext && (
              <div className="space-y-3">
                <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Structured Evidence Matrix Extraction</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="font-semibold text-slate-400 block mb-0.5">Methodology Design:</span>
                    <span className="text-slate-200">{ext.methodology_type}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="font-semibold text-slate-400 block mb-0.5">Sample / Scope:</span>
                    <span className="text-slate-200 font-mono">{ext.sample_size}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="font-semibold text-slate-400 block mb-0.5">Intervention Architecture:</span>
                    <span className="text-slate-200">{ext.intervention_or_approach}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <span className="font-semibold text-slate-400 block mb-0.5">Baseline Comparator:</span>
                    <span className="text-slate-200">{ext.comparator_or_baseline}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5">
                  <span className="font-semibold text-slate-400 block">Quantitative Findings &amp; Effect Metrics:</span>
                  <ul className="space-y-1">
                    {ext.quantitative_findings.map((f, idx) => (
                      <li key={idx} className="font-mono text-emerald-400 flex items-start space-x-1.5 text-[11px]">
                        <span>•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="font-semibold text-slate-400 block mb-1">Study Limitations:</span>
                  <p className="text-slate-300 italic">{ext.limitations}</p>
                </div>
              </div>
            )}

            {/* Cochrane RoB 2 Details */}
            {rob && (
              <div className="bg-slate-950 p-3.5 sm:p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cochrane Risk of Bias Appraisal</span>
                  </span>
                  <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                    rob.overall === 'Low' ? 'text-emerald-400 bg-emerald-950' : 'text-amber-400 bg-amber-950'
                  }`}>
                    Overall: {rob.overall}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
                  <div className="bg-slate-900 p-1 rounded">
                    <div className="text-slate-400">D1: Sel</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{rob.selection_bias}</div>
                  </div>
                  <div className="bg-slate-900 p-1 rounded">
                    <div className="text-slate-400">D2: Perf</div>
                    <div className="font-bold text-amber-400 mt-0.5">{rob.performance_bias}</div>
                  </div>
                  <div className="bg-slate-900 p-1 rounded">
                    <div className="text-slate-400">D3: Attr</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{rob.attrition_bias}</div>
                  </div>
                  <div className="bg-slate-900 p-1 rounded">
                    <div className="text-slate-400">D4: Det</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{rob.detection_bias}</div>
                  </div>
                  <div className="bg-slate-900 p-1 rounded">
                    <div className="text-slate-400">D5: Rep</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{rob.reporting_bias}</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic">{rob.justification}</p>
              </div>
            )}

            {/* BibTeX Citation */}
            <div className="space-y-2 pb-6">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  BibTeX Citation Reference
                </span>
                <button
                  onClick={handleCopyBibtex}
                  className="text-sky-400 hover:text-sky-300 text-[11px] flex items-center space-x-1"
                >
                  {copiedBib ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBib ? 'Copied' : 'Copy BibTeX'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto select-all">
                {bibtex}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
