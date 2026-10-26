import React from 'react';
import { 
  BookMarked, 
  Download, 
  PlusCircle, 
  RefreshCw, 
  FileCode, 
  Share2, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import type { Project, ProjectListItem } from '../types';

interface HeaderProps {
  currentProject: Project | null;
  projects: ProjectListItem[];
  onSelectProject: (id: string) => void;
  onOpenNewProtocol: () => void;
  onOpenAddPaper: () => void;
  onExport: (type: 'bibtex' | 'ris' | 'csv' | 'prisma-svg') => void;
  onRunPipeline: () => void;
  isPipelineRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onOpenNewProtocol,
  onOpenAddPaper,
  onExport,
  onRunPipeline,
  isPipelineRunning,
}) => {
  const [exportOpen, setExportOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 select-none shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand & Project Selector */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="flex items-center space-x-2 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-900 flex items-center justify-center shadow-xs">
                <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden xs:block">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-sm sm:text-base tracking-wide text-slate-900 uppercase">EPISTEME</span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                    PRISMA 2020
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 hidden md:block">
                  Systematic Review &amp; Evidence Synthesis Workbench
                </p>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block shrink-0" />

            {/* Active Project Dropdown */}
            <div className="relative min-w-0">
              <select
                aria-label="Active Review Protocol"
                value={currentProject?.id || ''}
                onChange={(e) => onSelectProject(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-md px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white appearance-none font-medium w-36 xs:w-44 sm:w-60 md:w-72 truncate shadow-2xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.included_count} included)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={onOpenNewProtocol}
              className="text-xs text-sky-700 hover:text-sky-900 hover:bg-sky-50 font-medium flex items-center space-x-1 p-1.5 sm:px-2 sm:py-1 rounded transition-colors shrink-0"
              title="Create new systematic review protocol"
            >
              <PlusCircle className="w-4 h-4 text-sky-700" />
              <span className="hidden lg:inline">New Protocol</span>
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Run Pipeline Button */}
            <button
              onClick={onRunPipeline}
              disabled={isPipelineRunning}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-md text-xs font-semibold shadow-xs transition-all ${
                isPipelineRunning
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 cursor-wait'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPipelineRunning ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{isPipelineRunning ? 'Auditing Records...' : 'Execute Agents'}</span>
              <span className="xs:hidden">{isPipelineRunning ? '...' : 'Run'}</span>
            </button>

            {/* Ingest Study Button */}
            <button
              onClick={onOpenAddPaper}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs px-2 sm:px-2.5 py-1.5 rounded-md flex items-center space-x-1 font-medium transition-colors shadow-2xs"
              title="Ingest study"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Add Study</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs px-2 sm:px-3 py-1.5 rounded-md flex items-center space-x-1 font-medium transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xs:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {exportOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setExportOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-30 text-xs">
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100 bg-slate-50">
                      Standard Research Formats
                    </div>
                    <button
                      onClick={() => { onExport('bibtex'); setExportOpen(false); }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between"
                    >
                      <span className="flex items-center space-x-2">
                        <FileCode className="w-3.5 h-3.5 text-sky-600" />
                        <span>BibTeX Citations (.bib)</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">LaTeX</span>
                    </button>
                    <button
                      onClick={() => { onExport('ris'); setExportOpen(false); }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between"
                    >
                      <span className="flex items-center space-x-2">
                        <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>RIS Format (.ris)</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Zotero</span>
                    </button>
                    <button
                      onClick={() => { onExport('csv'); setExportOpen(false); }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between"
                    >
                      <span className="flex items-center space-x-2">
                        <Download className="w-3.5 h-3.5 text-amber-600" />
                        <span>Evidence Matrix (.csv)</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Excel / R</span>
                    </button>
                    <button
                      onClick={() => { onExport('prisma-svg'); setExportOpen(false); }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-between border-t border-slate-100"
                    >
                      <span className="flex items-center space-x-2">
                        <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                        <span>PRISMA 2020 SVG</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Vector</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
