import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import type { Paper } from '../types';

interface EvidenceMatrixTableProps {
  papers: Paper[];
  onSelectPaper: (paper: Paper) => void;
  onUpdateStatus: (paperId: string, status: 'included' | 'excluded' | 'flagged', reason?: string) => void;
}

export const EvidenceMatrixTable: React.FC<EvidenceMatrixTableProps> = ({
  papers,
  onSelectPaper,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'included' | 'excluded' | 'flagged'>('all');
  const [robFilter, setRobFilter] = useState<'all' | 'Low' | 'Some Concerns' | 'High'>('all');

  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      // Status filter
      if (statusFilter !== 'all' && p.screening.status !== statusFilter) return false;
      // RoB filter
      if (robFilter !== 'all') {
        const rob = p.risk_of_bias?.overall || 'Some Concerns';
        if (rob !== robFilter) return false;
      }
      // Text search
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(term);
      const matchAuthor = p.authors.some((a) => a.toLowerCase().includes(term));
      const matchVenue = (p.venue || '').toLowerCase().includes(term);
      const matchIntervention = (p.extraction?.intervention_or_approach || '').toLowerCase().includes(term);
      const matchFindings = (p.extraction?.quantitative_findings || []).some((f) => f.toLowerCase().includes(term));
      return matchTitle || matchAuthor || matchVenue || matchIntervention || matchFindings;
    });
  }, [papers, searchTerm, statusFilter, robFilter]);

  const includedCount = papers.filter((p) => p.screening.status === 'included').length;
  const excludedCount = papers.filter((p) => p.screening.status === 'excluded').length;

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter matrix by study title, author, methodology, or outcome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white placeholder-slate-400"
          />
        </div>

        {/* Filter Badges & Selectors */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Status Segment */}
          <div className="inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({papers.length})
            </button>
            <button
              onClick={() => setStatusFilter('included')}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center space-x-1 ${
                statusFilter === 'included' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Included ({includedCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('excluded')}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center space-x-1 ${
                statusFilter === 'excluded' ? 'bg-rose-50 text-rose-800 border border-rose-300 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <XCircle className="w-3 h-3 text-rose-600" />
              <span>Excluded ({excludedCount})</span>
            </button>
          </div>

          {/* Risk of Bias Filter */}
          <select
            aria-label="Filter by Risk of Bias"
            value={robFilter}
            onChange={(e) => setRobFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">RoB 2: All Ratings</option>
            <option value="Low">Low Risk of Bias</option>
            <option value="Some Concerns">Some Concerns</option>
            <option value="High">High Risk of Bias</option>
          </select>
        </div>
      </div>

      {/* MOBILE / PHONE CARD VIEW (< lg screens) */}
      <div className="block lg:hidden space-y-3">
        {filteredPapers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 shadow-xs">
            <FileText className="w-7 h-7 mx-auto mb-2 opacity-40 text-slate-400" />
            No studies match the active filter criteria.
          </div>
        ) : (
          filteredPapers.map((paper) => {
            const ext = paper.extraction;
            const rob = paper.risk_of_bias?.overall || 'Some Concerns';
            const isIncluded = paper.screening.status === 'included';
            const isExcluded = paper.screening.status === 'excluded';

            return (
              <div
                key={paper.id}
                onClick={() => onSelectPaper(paper)}
                className={`bg-white border rounded-lg p-4 space-y-3 shadow-xs transition-all cursor-pointer ${
                  isExcluded ? 'border-rose-200 bg-rose-50/20 opacity-80' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                {/* Header: Title & Year */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                      {paper.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {paper.authors.length > 0 ? `${paper.authors[0]}${paper.authors.length > 1 ? ' et al.' : ''}` : 'Unknown'} ({paper.year}) • <span className="italic">{paper.venue}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                </div>

                {/* Metadata Pills */}
                <div className="flex items-center space-x-2 flex-wrap gap-y-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                    {ext?.methodology_type || 'Empirical Study'}
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">
                    {ext?.sample_size || 'Domain corpus'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      rob === 'Low'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : rob === 'High'
                        ? 'bg-rose-50 text-rose-800 border border-rose-300'
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}
                  >
                    RoB: {rob}
                  </span>
                </div>

                {/* Intervention & Comparator */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1">
                  <div>
                    <span className="text-slate-500 font-medium">Intervention: </span>
                    <span className="text-slate-800 font-medium">{ext?.intervention_or_approach || paper.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Comparator: </span>
                    <span className="text-slate-700">{ext?.comparator_or_baseline || 'Standard baseline'}</span>
                  </div>
                </div>

                {/* Findings Bullet */}
                {ext?.quantitative_findings && ext.quantitative_findings.length > 0 && (
                  <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                    <span className="font-bold">• </span>
                    <span>{ext.quantitative_findings[0]}</span>
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateStatus(paper.id, 'included')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 ${
                        isIncluded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Included</span>
                    </button>
                    <button
                      onClick={() => onUpdateStatus(paper.id, 'excluded', 'Audited protocol exclusion')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 ${
                        isExcluded ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Excluded</span>
                    </button>
                  </div>

                  {paper.doi && (
                    <a
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-700 hover:text-sky-900 text-[11px] font-mono flex items-center space-x-1"
                    >
                      <span>DOI Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* LAPTOP / DESKTOP TABLE VIEW (hidden on < lg screens) */}
      <div className="hidden lg:block bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 font-semibold select-none border-b border-slate-200">
              <tr>
                <th scope="col" className="py-3 px-4 w-72">Study Identification &amp; Setting</th>
                <th scope="col" className="py-3 px-4 w-44">Methodology Design</th>
                <th scope="col" className="py-3 px-4 w-36">Sample / Scope</th>
                <th scope="col" className="py-3 px-4 w-52">Intervention Architecture</th>
                <th scope="col" className="py-3 px-4 w-44">Baseline Comparator</th>
                <th scope="col" className="py-3 px-4 min-w-[240px]">Primary Quantitative Findings</th>
                <th scope="col" className="py-3 px-3 w-28 text-center">RoB 2</th>
                <th scope="col" className="py-3 px-3 w-28 text-center">PRISMA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white">
              {filteredPapers.map((paper) => {
                const ext = paper.extraction;
                const rob = paper.risk_of_bias?.overall || 'Some Concerns';
                const isIncluded = paper.screening.status === 'included';
                const isExcluded = paper.screening.status === 'excluded';

                return (
                  <tr
                    key={paper.id}
                    onClick={() => onSelectPaper(paper)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isExcluded ? 'opacity-65 bg-slate-50/40' : ''
                    }`}
                  >
                    {/* Identification */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900 line-clamp-2 hover:text-sky-700 transition-colors">
                        {paper.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {paper.authors.length > 0 ? `${paper.authors[0]}${paper.authors.length > 1 ? ' et al.' : ''}` : 'Unknown'} ({paper.year})
                        <span className="mx-1 text-slate-400">•</span>
                        <span className="text-slate-500 italic">{paper.venue || 'Academic Repository'}</span>
                      </div>
                      {paper.doi && (
                        <div className="mt-1 flex items-center space-x-1 font-mono text-[10px] text-sky-700">
                          <span>DOI: {paper.doi}</span>
                        </div>
                      )}
                    </td>

                    {/* Methodology */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {ext?.methodology_type || 'Empirical Study'}
                      </span>
                    </td>

                    {/* Sample Size / Scope */}
                    <td className="py-3.5 px-4 align-top font-mono text-[11px] text-slate-700">
                      {ext?.sample_size || 'Domain corpus'}
                    </td>

                    {/* Intervention */}
                    <td className="py-3.5 px-4 align-top text-slate-900 font-medium">
                      <div className="line-clamp-2">
                        {ext?.intervention_or_approach || paper.title}
                      </div>
                    </td>

                    {/* Comparator */}
                    <td className="py-3.5 px-4 align-top text-slate-600 text-[11px]">
                      <div className="line-clamp-2">
                        {ext?.comparator_or_baseline || 'Standard baseline'}
                      </div>
                    </td>

                    {/* Quantitative Findings */}
                    <td className="py-3.5 px-4 align-top">
                      {ext?.quantitative_findings && ext.quantitative_findings.length > 0 ? (
                        <ul className="space-y-1">
                          {ext.quantitative_findings.slice(0, 2).map((q, idx) => (
                            <li key={idx} className="text-[11px] font-mono text-emerald-800 flex items-start space-x-1.5">
                              <span className="text-emerald-600 font-bold mt-0.5">•</span>
                              <span className="line-clamp-2">{q}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Quantitative extraction pending</span>
                      )}
                    </td>

                    {/* RoB 2 Traffic Light */}
                    <td className="py-3.5 px-3 align-top text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rob === 'Low'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : rob === 'High'
                              ? 'bg-rose-50 text-rose-800 border border-rose-300'
                              : 'bg-amber-50 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {rob}
                        </span>
                      </div>
                    </td>

                    {/* PRISMA Screening Status Action */}
                    <td className="py-3.5 px-3 align-top text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex rounded bg-slate-100 p-0.5 border border-slate-200">
                        <button
                          title="Mark as Included"
                          onClick={() => onUpdateStatus(paper.id, 'included')}
                          className={`p-1 rounded transition-colors ${
                            isIncluded
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-400 hover:text-emerald-700 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Mark as Excluded"
                          onClick={() => onUpdateStatus(paper.id, 'excluded', 'Audited protocol exclusion')}
                          className={`p-1 rounded transition-colors ${
                            isExcluded
                              ? 'bg-rose-600 text-white'
                              : 'text-slate-400 hover:text-rose-700 hover:bg-slate-200'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {isExcluded && paper.screening.exclusion_reason && (
                        <div className="text-[9px] text-rose-700 mt-1 line-clamp-1 max-w-[120px] mx-auto" title={paper.screening.exclusion_reason}>
                          {paper.screening.exclusion_reason}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredPapers.length}</span> of{' '}
            <span className="font-semibold text-slate-800">{papers.length}</span> recorded studies
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-slate-700">{includedCount} Included in Synthesis</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span className="text-slate-700">{excludedCount} Excluded Records</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
