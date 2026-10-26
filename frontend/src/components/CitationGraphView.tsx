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
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>Bibliographic Citation Network &amp; Paradigm Evolution</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive structural mapping of baseline comparators, methodology inheritance, and chronological milestones.
          </p>
        </div>

        <div className="inline-flex rounded-md bg-slate-950 p-0.5 border border-slate-800 text-xs w-full sm:w-auto justify-center">
          <button
            onClick={() => setViewMode('network')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium transition-colors flex items-center justify-center space-x-1.5 ${
              viewMode === 'network' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Co-Citation Graph</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium transition-colors flex items-center justify-center space-x-1.5 ${
              viewMode === 'timeline' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* Network View */}
      {viewMode === 'network' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 sm:p-6 shadow-sm overflow-hidden relative">
          <div className="h-[340px] xs:h-[400px] sm:h-[460px] w-full flex items-center justify-center relative bg-radial from-slate-900 to-slate-950 border border-slate-800/80 rounded-md overflow-hidden">
            {/* SVG Connecting Links */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="22%" y2="75%" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="78%" y2="75%" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>

            {/* Central Node: Vaswani et al. 2017 */}
            <div
              onClick={() => {
                const vaswani = includedPapers.find((p) => p.title.toLowerCase().includes('attention is all'));
                if (vaswani) onSelectPaper(vaswani);
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-950/85 border-2 border-indigo-500/80 p-2 flex flex-col items-center justify-center text-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-[9px] sm:text-[10px] font-bold text-indigo-300 uppercase leading-none">Vaswani '17</span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 mt-1 font-mono">128K cites</span>
                <span className="text-[7px] sm:text-[8px] text-indigo-400 font-semibold mt-0.5">Quadratic</span>
              </div>
            </div>

            {/* FlashAttention (Dao 2022) */}
            <div
              onClick={() => {
                const p = includedPapers.find((p) => p.title.toLowerCase().includes('flashattention'));
                if (p) onSelectPaper(p);
              }}
              style={{ left: '20%', top: '25%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-950/85 border border-emerald-500/60 p-1.5 flex flex-col items-center justify-center text-center shadow group-hover:scale-110 transition-transform">
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-300 leading-tight">FlashAttn</span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono mt-0.5">Dao '22</span>
                <span className="text-[7px] sm:text-[8px] text-emerald-400">IO-Aware</span>
              </div>
            </div>

            {/* Linformer (Wang 2020) */}
            <div
              onClick={() => {
                const p = includedPapers.find((p) => p.title.toLowerCase().includes('linformer'));
                if (p) onSelectPaper(p);
              }}
              style={{ left: '80%', top: '25%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="w-15 h-15 sm:w-18 sm:h-18 rounded-full bg-sky-950/85 border border-sky-500/60 p-1.5 flex flex-col items-center justify-center text-center shadow group-hover:scale-110 transition-transform">
                <span className="text-[9px] sm:text-[10px] font-bold text-sky-300 leading-tight">Linformer</span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono mt-0.5">Wang '20</span>
                <span className="text-[7px] sm:text-[8px] text-sky-400">Low-Rank</span>
              </div>
            </div>

            {/* Longformer (Beltagy 2020) */}
            <div
              onClick={() => {
                const p = includedPapers.find((p) => p.title.toLowerCase().includes('longformer'));
                if (p) onSelectPaper(p);
              }}
              style={{ left: '22%', top: '75%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="w-15 h-15 sm:w-18 sm:h-18 rounded-full bg-amber-950/85 border border-amber-500/60 p-1.5 flex flex-col items-center justify-center text-center shadow group-hover:scale-110 transition-transform">
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-300 leading-tight">Longformer</span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono mt-0.5">'20</span>
                <span className="text-[7px] sm:text-[8px] text-amber-400">Windowed</span>
              </div>
            </div>

            {/* Mamba (Gu 2023) */}
            <div
              onClick={() => {
                const p = includedPapers.find((p) => p.title.toLowerCase().includes('mamba'));
                if (p) onSelectPaper(p);
              }}
              style={{ left: '78%', top: '75%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-950/85 border border-purple-500/60 p-1.5 flex flex-col items-center justify-center text-center shadow group-hover:scale-110 transition-transform">
                <span className="text-[9px] sm:text-[10px] font-bold text-purple-300 leading-tight">Mamba</span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 font-mono mt-0.5">Gu '23</span>
                <span className="text-[7px] sm:text-[8px] text-purple-400">SSM</span>
              </div>
            </div>

            {/* Long Range Arena (Tay 2021) */}
            <div
              onClick={() => {
                const p = includedPapers.find((p) => p.title.toLowerCase().includes('long range arena'));
                if (p) onSelectPaper(p);
              }}
              style={{ left: '50%', top: '15%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-slate-900 border border-slate-600 p-1 flex flex-col items-center justify-center text-center shadow group-hover:scale-110 transition-transform">
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-200 leading-tight">LRA</span>
                <span className="text-[7px] sm:text-[8px] text-slate-400 font-mono">Tay '21</span>
              </div>
            </div>

            {/* DistilBERT (Sanh 2019) */}
            <div
              onClick={() => {
                const p = includedPapers.find((p) => p.title.toLowerCase().includes('distilbert'));
                if (p) onSelectPaper(p);
              }}
              style={{ left: '50%', top: '85%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-cyan-950/85 border border-cyan-500/60 p-1 flex flex-col items-center justify-center text-center shadow group-hover:scale-110 transition-transform">
                <span className="text-[8px] sm:text-[10px] font-bold text-cyan-300 leading-tight">DistilBERT</span>
                <span className="text-[7px] sm:text-[8px] text-slate-400 font-mono">Sanh '19</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[10px] sm:text-[11px] text-slate-500 text-center flex items-center justify-center space-x-1">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Node diameter indicates relative citation impact • Tap node for full audit</span>
          </div>
        </div>
      )}

      {/* Chronological Paradigm Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="relative border-l-2 border-slate-800 ml-3 sm:ml-4 pl-4 sm:pl-6 space-y-6 sm:space-y-8">
            {sortedPapers.map((paper) => {
              const ext = paper.extraction;
              const firstAuthor = paper.authors.length > 0 ? paper.authors[0] : 'Author';
              const etAl = paper.authors.length > 1 ? ' et al.' : '';

              return (
                <div key={paper.id} className="relative group cursor-pointer" onClick={() => onSelectPaper(paper)}>
                  {/* Timeline bullet */}
                  <div className="absolute -left-[23px] sm:-left-[31px] top-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-950 border-2 border-sky-500 group-hover:border-emerald-400 transition-colors flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-sky-400" />
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 sm:p-4 group-hover:border-slate-700 transition-colors shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold text-sky-400">
                        {paper.year} • {paper.venue || 'Academic Venue'}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {paper.citations_count.toLocaleString()} cites
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-semibold text-white mt-1 group-hover:text-sky-300 transition-colors">
                      {paper.title}
                    </h3>

                    <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      {firstAuthor}{etAl}
                    </div>

                    <div className="mt-2 text-[11px] sm:text-xs text-slate-300">
                      <span className="font-semibold text-slate-400">Intervention: </span>
                      {ext?.intervention_or_approach || paper.title}
                    </div>

                    {ext?.quantitative_findings && ext.quantitative_findings.length > 0 && (
                      <div className="mt-2 text-[10px] sm:text-[11px] font-mono text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-900/40">
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
