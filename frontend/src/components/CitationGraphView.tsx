import React, { useState } from 'react';
import { Share2, Calendar, Info } from 'lucide-react';
import type { Paper } from '../types';

interface CitationGraphViewProps {
  papers: Paper[];
  onSelectPaper: (paper: Paper) => void;
}

export const CitationGraphView: React.FC<CitationGraphViewProps> = ({ papers, onSelectPaper }) => {
  const [viewMode, setViewMode] = useState<'network' | 'timeline'>('network');
  const includedPapers = papers.filter((p) => p.screening.status === 'included');

  // Sort papers chronologically for timeline
  const sortedPapers = [...includedPapers].sort((a, b) => a.year - b.year || b.citations_count - a.citations_count);

  return (
    <div className="space-y-6">
      {/* View Switcher & Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-sky-700" />
            <span>Bibliographic Citation Network &amp; Paradigm Evolution</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive structural mapping of baseline comparators, methodology inheritance, and chronological milestones.
          </p>
        </div>

        <div className="inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200 text-xs w-full sm:w-auto justify-center">
          <button
            onClick={() => setViewMode('network')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium transition-colors flex items-center justify-center space-x-1.5 ${
              viewMode === 'network' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Co-Citation Graph</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium transition-colors flex items-center justify-center space-x-1.5 ${
              viewMode === 'timeline' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* Network View */}
      {viewMode === 'network' && (
        <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-6 shadow-xs overflow-hidden relative">
          <div className="h-[340px] xs:h-[400px] sm:h-[460px] w-full flex items-center justify-center relative bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 rounded-md overflow-hidden">
            {/* SVG Connecting Links */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="22%" y2="75%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="78%" y2="75%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>

            {/* Central Node: Vaswani et al. 2017 */}
            <div
              onClick={() => {
                const vaswani = includedPapers.find((p) => p.title.toLowerCase().includes('attention is all') || p.title.toLowerCase().includes('high-fidelity') || p.title.toLowerCase().includes('semaglutide and cardiovascular'));
                if (vaswani) onSelectPaper(vaswani);
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-indigo-50 border-2 border-indigo-600 p-2 flex flex-col items-center justify-center text-center shadow-md group-hover:scale-110 transition-transform">
                <span className="text-[9px] sm:text-[10px] font-bold text-indigo-950 uppercase leading-none">
                  {includedPapers[0]?.authors[0]?.split(' ').pop() || 'Primary'} '{String(includedPapers[0]?.year || 2020).slice(-2)}
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-500 mt-1 font-mono">{includedPapers[0]?.citations_count.toLocaleString() || '10k'} cites</span>
                <span className="text-[7px] sm:text-[8px] text-indigo-700 font-semibold mt-0.5">Foundational Baseline</span>
              </div>
            </div>

            {/* Satellite 1 */}
            {includedPapers[1] && (
              <div
                onClick={() => onSelectPaper(includedPapers[1])}
                style={{ left: '20%', top: '25%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-2 border-emerald-500 p-1.5 flex flex-col items-center justify-center text-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-900 leading-tight truncate max-w-[65px]">{includedPapers[1].title.split(' ')[0]}</span>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono mt-0.5">'{String(includedPapers[1].year).slice(-2)}</span>
                  <span className="text-[7px] sm:text-[8px] text-emerald-700 font-medium">Intervention</span>
                </div>
              </div>
            )}

            {/* Satellite 2 */}
            {includedPapers[2] && (
              <div
                onClick={() => onSelectPaper(includedPapers[2])}
                style={{ left: '80%', top: '25%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              >
                <div className="w-15 h-15 sm:w-18 sm:h-18 rounded-full bg-white border-2 border-sky-500 p-1.5 flex flex-col items-center justify-center text-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-900 leading-tight truncate max-w-[60px]">{includedPapers[2].title.split(' ')[0]}</span>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono mt-0.5">'{String(includedPapers[2].year).slice(-2)}</span>
                  <span className="text-[7px] sm:text-[8px] text-sky-700 font-medium">Evaluation</span>
                </div>
              </div>
            )}

            {/* Satellite 3 */}
            {includedPapers[3] && (
              <div
                onClick={() => onSelectPaper(includedPapers[3])}
                style={{ left: '22%', top: '75%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              >
                <div className="w-15 h-15 sm:w-18 sm:h-18 rounded-full bg-white border-2 border-amber-500 p-1.5 flex flex-col items-center justify-center text-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-900 leading-tight truncate max-w-[60px]">{includedPapers[3].title.split(' ')[0]}</span>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono mt-0.5">'{String(includedPapers[3].year).slice(-2)}</span>
                  <span className="text-[7px] sm:text-[8px] text-amber-700 font-medium">Extension</span>
                </div>
              </div>
            )}

            {/* Satellite 4 */}
            {includedPapers[4] && (
              <div
                onClick={() => onSelectPaper(includedPapers[4])}
                style={{ left: '78%', top: '75%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-2 border-purple-500 p-1.5 flex flex-col items-center justify-center text-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-900 leading-tight truncate max-w-[65px]">{includedPapers[4].title.split(' ')[0]}</span>
                  <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono mt-0.5">'{String(includedPapers[4].year).slice(-2)}</span>
                  <span className="text-[7px] sm:text-[8px] text-purple-700 font-medium">Emerging</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 text-[10px] sm:text-[11px] text-slate-500 text-center flex items-center justify-center space-x-1">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Node diameter indicates relative citation impact • Tap node for full audit</span>
          </div>
        </div>
      )}

      {/* Chronological Paradigm Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-xs">
          <div className="relative border-l-2 border-slate-200 ml-3 sm:ml-4 pl-4 sm:pl-6 space-y-6 sm:space-y-8">
            {sortedPapers.map((paper) => {
              const ext = paper.extraction;
              const firstAuthor = paper.authors.length > 0 ? paper.authors[0] : 'Author';
              const etAl = paper.authors.length > 1 ? ' et al.' : '';

              return (
                <div key={paper.id} className="relative group cursor-pointer" onClick={() => onSelectPaper(paper)}>
                  {/* Timeline bullet */}
                  <div className="absolute -left-[23px] sm:-left-[31px] top-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-sky-600 group-hover:border-emerald-600 transition-colors flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-sky-600" />
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 sm:p-4 group-hover:border-slate-300 transition-colors shadow-2xs">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold text-sky-800">
                        {paper.year} • {paper.venue || 'Academic Venue'}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200">
                        {paper.citations_count.toLocaleString()} cites
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mt-1 group-hover:text-sky-800 transition-colors">
                      {paper.title}
                    </h3>

                    <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      {firstAuthor}{etAl}
                    </div>

                    <div className="mt-2 text-[11px] sm:text-xs text-slate-700">
                      <span className="font-semibold text-slate-500">Intervention: </span>
                      {ext?.intervention_or_approach || paper.title}
                    </div>

                    {ext?.quantitative_findings && ext.quantitative_findings.length > 0 && (
                      <div className="mt-2 text-[10px] sm:text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                        <span className="font-bold">Key Metric: </span>
                        {ext.quantitative_findings[0]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
