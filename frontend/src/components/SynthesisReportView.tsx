import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Sparkles, 
  Layers, 
  Compass
} from 'lucide-react';
import type { Project } from '../types';

interface SynthesisReportViewProps {
  project: Project;
  onResynthesize: () => void;
  isResynthesizing: boolean;
}

export const SynthesisReportView: React.FC<SynthesisReportViewProps> = ({
  project,
  onResynthesize,
  isResynthesizing,
}) => {
  const synthesis = project.synthesis;
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'manuscript' | 'clusters' | 'gaps'>('manuscript');

  const handleCopyMarkdown = () => {
    if (synthesis?.manuscript_draft) {
      navigator.clipboard.writeText(synthesis.manuscript_draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    if (synthesis?.manuscript_draft) {
      const blob = new Blob([synthesis.manuscript_draft], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${project.id}_systematic_review.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!synthesis) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 sm:p-12 text-center text-slate-400">
        <FileText className="w-10 h-10 mx-auto text-slate-500 mb-3" />
        <h3 className="text-sm font-semibold text-white">No Synthesis Generated Yet</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Execute the autonomous multi-agent pipeline to screen literature, extract structured data, and draft the PRISMA review.
        </p>
        <button
          onClick={onResynthesize}
          className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-md shadow-sm"
        >
          Generate Synthesis Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              PRISMA 2020 Systematic Review Manuscript
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Grade: {synthesis.grade_certainty}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthesized across {synthesis.total_included_studies} peer-reviewed studies • {synthesis.generated_at}
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2 w-full md:w-auto">
          <div className="inline-flex rounded-md bg-slate-950 p-0.5 border border-slate-800 text-xs w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab('manuscript')}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium transition-colors ${
                activeTab === 'manuscript' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manuscript
            </button>
            <button
              onClick={() => setActiveTab('clusters')}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium transition-colors ${
                activeTab === 'clusters' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Clusters ({synthesis.thematic_clusters.length})
            </button>
            <button
              onClick={() => setActiveTab('gaps')}
              className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium transition-colors ${
                activeTab === 'gaps' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gaps ({synthesis.identified_research_gaps.length})
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyMarkdown}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-md flex items-center space-x-1 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-md flex items-center space-x-1 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download</span>
            </button>

            <button
              onClick={() => window.print()}
              className="hidden sm:flex bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-md items-center space-x-1 font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print</span>
            </button>

            <button
              onClick={onResynthesize}
              disabled={isResynthesizing}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded-md flex items-center space-x-1 font-semibold transition-colors shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isResynthesizing ? 'animate-spin' : ''}`} />
              <span>{isResynthesizing ? '...' : 'Re-synthesize'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      {activeTab === 'manuscript' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-8 md:p-10 shadow-sm max-w-4xl mx-auto">
          {/* Publication Manuscript Header */}
          <div className="border-b border-slate-800 pb-5 mb-6 text-center">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-sky-400 font-bold block mb-1.5">
              Systematic Review &amp; Meta-Synthesis Manuscript
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-white font-bold leading-tight max-w-2xl mx-auto">
              {project.name}
            </h1>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-2 font-mono">
              Protocol: {project.protocol.title} • PRISMA 2020 Registration
            </div>
          </div>

          {/* Manuscript Body */}
          <div className="prose prose-invert prose-slate max-w-none text-slate-300 font-serif leading-relaxed space-y-5 text-xs sm:text-sm">
            {synthesis.manuscript_draft.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-lg sm:text-xl font-bold font-sans text-white border-b border-slate-800 pb-2 mt-6 sm:mt-8">
                    {trimmed.replace('# ', '')}
                  </h1>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-sm sm:text-base font-bold font-sans text-sky-300 uppercase tracking-wide border-b border-slate-800/60 pb-1 mt-5 sm:mt-6">
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xs sm:text-sm font-bold font-sans text-slate-200 mt-4">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('|')) {
                return (
                  <div key={idx} className="overflow-x-auto my-3 not-prose font-sans">
                    <pre className="text-[10px] sm:text-[11px] font-mono bg-slate-950 p-2.5 sm:p-3 rounded border border-slate-800 text-slate-300 overflow-x-auto">
                      {trimmed}
                    </pre>
                  </div>
                );
              }
              if (trimmed.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 my-2">
                    {trimmed.split('\n').map((li, lidx) => (
                      <li key={lidx}>{li.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-justify text-slate-300 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* Thematic Clusters View */}
      {activeTab === 'clusters' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synthesis.thematic_clusters.map((cluster) => (
              <div key={cluster.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-white">{cluster.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {cluster.paper_ids.length} study/studies
                  </span>
                </div>
                <p className="text-xs text-slate-400">{cluster.description}</p>
                <div className="bg-slate-950 p-3 rounded border border-slate-800/80 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-400 block mb-0.5">Empirical Consensus:</span>
                    <span className="text-slate-300">{cluster.consensus}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800/60">
                    <span className="font-semibold text-amber-400 block mb-0.5">Controversy &amp; Divergence:</span>
                    <span className="text-slate-300">{cluster.divergence}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cross-Study Consensus & Divergence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                Verified Cross-Study Consensus
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {synthesis.consensus_findings.map((c, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                Divergence &amp; Methodological Controversies
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {synthesis.divergence_and_controversies.map((d, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Identified Research Gaps View */}
      {activeTab === 'gaps' && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2 text-sky-400 border-b border-slate-800 pb-3">
            <Compass className="w-4 h-4" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Identified Empirical Gaps &amp; Future Research Agenda
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Systematic synthesis uncovered critical evaluation blind spots, under-tested hardware domains, and architectural bottlenecks requiring future investigation.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {synthesis.identified_research_gaps.map((gap, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 sm:p-4 rounded-lg border border-slate-800 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-300 border border-sky-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="text-xs text-slate-200 leading-relaxed">
                  {gap}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
