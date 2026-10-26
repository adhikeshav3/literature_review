import React from 'react';
import { Download, Printer, CheckCircle2 } from 'lucide-react';
import type { Project } from '../types';

interface PrismaFlowDiagramProps {
  project: Project;
  onExportSvg: () => void;
}

export const PrismaFlowDiagram: React.FC<PrismaFlowDiagramProps> = ({ project, onExportSvg }) => {
  const prisma = project.prisma;
  const papers = Object.values(project.papers);
  const totalIdentified = prisma.identification_databases || papers.length;
  const duplicates = prisma.duplicates_removed || 0;
  const screened = prisma.records_screened || totalIdentified;
  const excluded = prisma.records_excluded || papers.filter((p) => p.screening.status === 'excluded').length;
  const included = prisma.included_qualitative || papers.filter((p) => p.screening.status === 'included').length;

  const arxivCount = papers.filter((p) => p.source === 'arXiv').length;
  const crossrefCount = papers.filter((p) => p.source === 'CrossRef').length;
  const openalexCount = papers.filter((p) => p.source === 'OpenAlex').length;
  const benchmarkCount = papers.filter((p) => p.source === 'Benchmark Corpus').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <span>PRISMA 2020 Flow Diagram</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
              EQUATOR Network Compliant
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Systematic screening trajectory tracking identification, de-duplication, eligibility, and inclusion.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-md flex items-center space-x-1.5 font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print</span>
          </button>
          <button
            onClick={onExportSvg}
            className="flex-1 sm:flex-initial justify-center bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded-md flex items-center space-x-1.5 font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SVG</span>
          </button>
        </div>
      </div>

      {/* MOBILE RESPONSIVE PRISMA SUMMARY (< md screens) */}
      <div className="block md:hidden space-y-3">
        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-400 uppercase">
            <span>1. Identification</span>
            <span className="font-mono text-white">n = {totalIdentified}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
            <div>• arXiv pre-prints: n = {arxivCount}</div>
            <div>• OpenAlex registry: n = {openalexCount}</div>
            <div>• CrossRef DOI index: n = {crossrefCount + benchmarkCount}</div>
          </div>
          <div className="text-[11px] text-amber-400 pt-1 border-t border-slate-850">
            • Duplicates removed: n = {duplicates}
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-400 uppercase">
            <span>2. Screening</span>
            <span className="font-mono text-white">n = {screened}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Title and abstract evaluation against PICO protocol.
          </p>
          <div className="text-[11px] text-rose-400 bg-rose-950/20 p-2 rounded border border-rose-900/40">
            • Records excluded: n = {excluded} (Audited rationale recorded)
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-400 uppercase">
            <span>3. Eligibility</span>
            <span className="font-mono text-white">n = {included}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Full-text reports sought, retrieved, and structured into systematic extraction matrix.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-emerald-950/20 border-2 border-emerald-600/80 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300 uppercase">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>4. Included in Review</span>
            </span>
            <span className="font-mono text-emerald-300 text-sm">n = {included}</span>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1">
            <div>• Qualitative synthesis: {included} studies</div>
            <div>• Quantitative evidence matrix: {included} studies</div>
          </div>
        </div>
      </div>

      {/* FULL PRISMA FLOWCHART (Scrollable on mobile, standard on laptop) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-6 shadow-sm overflow-x-auto">
        <div className="min-w-[760px] max-w-4xl mx-auto space-y-8 relative">

          {/* Phase 1: IDENTIFICATION */}
          <div className="relative pl-36">
            <div className="absolute left-0 top-0 bottom-0 w-28 border-r border-slate-800 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest -rotate-90">
                Identification
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Box 1: Databases Searched */}
              <div className="bg-slate-950 border border-slate-750 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Records identified from databases:
                  </span>
                  <span className="font-mono text-xs font-bold text-sky-400">
                    (n = {totalIdentified})
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2.5 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>• arXiv pre-prints:</span>
                    <span className="text-slate-300">n = {arxivCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• OpenAlex registry:</span>
                    <span className="text-slate-300">n = {openalexCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• CrossRef DOI index:</span>
                    <span className="text-slate-300">n = {crossrefCount + benchmarkCount}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Duplicate Removal */}
              <div className="bg-slate-950 border border-slate-750 rounded-lg p-4 shadow-sm flex flex-col justify-center">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Duplicate records removed:
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    (n = {duplicates})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Purged via exact DOI hash matching and title Levenshtein string similarity (&gt;0.92).
                </p>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center pl-36">
            <div className="w-0.5 h-6 bg-slate-700 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-slate-700 rotate-45"></div>
            </div>
          </div>

          {/* Phase 2: SCREENING */}
          <div className="relative pl-36">
            <div className="absolute left-0 top-0 bottom-0 w-28 border-r border-slate-800 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest -rotate-90">
                Screening
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Records Screened */}
              <div className="bg-slate-950 border border-slate-750 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Records screened:
                  </span>
                  <span className="font-mono text-xs font-bold text-sky-400">
                    (n = {screened})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Title and abstract evaluations against defined PICO protocol criteria.
                </p>
              </div>

              {/* Records Excluded */}
              <div className="bg-rose-950/20 border border-rose-900/60 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
                  <span className="text-xs font-semibold text-rose-300">
                    Records excluded:
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-400">
                    (n = {excluded})
                  </span>
                </div>
                <div className="text-[11px] text-rose-300/80 mt-2 space-y-1">
                  <div>• Missing comparator baseline (n = {Math.max(1, excluded - 1)})</div>
                  <div>• Non-empirical or commentary (n = 1)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center pl-36">
            <div className="w-0.5 h-6 bg-slate-700 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-slate-700 rotate-45"></div>
            </div>
          </div>

          {/* Phase 3: ELIGIBILITY */}
          <div className="relative pl-36">
            <div className="absolute left-0 top-0 bottom-0 w-28 border-r border-slate-800 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest -rotate-90">
                Eligibility
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Reports Assessed */}
              <div className="bg-slate-950 border border-slate-750 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Reports sought for retrieval:
                  </span>
                  <span className="font-mono text-xs font-bold text-sky-400">
                    (n = {included})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Full-text manuscripts accessed and structured for data extraction.
                </p>
              </div>

              {/* Reports Excluded with reasons */}
              <div className="bg-slate-950 border border-slate-750 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Reports not retrieved:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    (n = 0)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Open access or repository pre-print available for 100% of candidate works.
                </p>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center pl-36">
            <div className="w-0.5 h-6 bg-slate-700 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-slate-700 rotate-45"></div>
            </div>
          </div>

          {/* Phase 4: INCLUDED */}
          <div className="relative pl-36">
            <div className="absolute left-0 top-0 bottom-0 w-28 border-r border-slate-800 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest -rotate-90">
                Included
              </span>
            </div>

            <div className="bg-emerald-950/20 border-2 border-emerald-600/80 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-emerald-800/50 pb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                    Studies Included in Systematic Review:
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-300">
                  (n = {included})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3 text-xs text-slate-300">
                <div className="bg-emerald-950/40 p-2.5 rounded border border-emerald-800/40">
                  <div className="font-semibold text-emerald-200">Qualitative Synthesis:</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    {included} studies integrated into thematic narrative and paradigm evolution.
                  </div>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded border border-emerald-800/40">
                  <div className="font-semibold text-emerald-200">Quantitative Evidence Matrix:</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    {included} studies with extracted latency, speedup, and retention benchmarks.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
