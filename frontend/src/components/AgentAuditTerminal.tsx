import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Cpu, 
  Search
} from 'lucide-react';
import type { AuditLogEntry } from '../types';

interface AgentAuditTerminalProps {
  logs: AuditLogEntry[];
  onRunQuery: (query: string) => void;
  isRunning: boolean;
  defaultQuery: string;
}

export const AgentAuditTerminal: React.FC<AgentAuditTerminalProps> = ({
  logs,
  onRunQuery,
  isRunning,
  defaultQuery,
}) => {
  const [queryInput, setQueryInput] = useState(defaultQuery);
  const [filterAgent, setFilterAgent] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    if (filterAgent !== 'all' && log.agent !== filterAgent) return false;
    return true;
  });

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'SearchAgent': return 'text-sky-400 bg-sky-950/60 border-sky-800';
      case 'ScreeningAgent': return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'ExtractionAgent': return 'text-purple-400 bg-purple-950/60 border-purple-800';
      case 'SynthesisAgent': return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
      default: return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />;
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
      default: return <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Query Formulation Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Autonomous Multi-Agent Search &amp; Review Pipeline
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-500">
            Parallel Registries: arXiv • CrossRef • OpenAlex
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Input boolean query string: (transformer OR attention) AND (efficiency OR sparse)..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-md pl-9 pr-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white placeholder-slate-400"
            />
          </div>

          <button
            onClick={() => onRunQuery(queryInput)}
            disabled={isRunning || !queryInput.trim()}
            className={`px-4 py-2 rounded-md text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-xs ${
              isRunning
                ? 'bg-amber-100 text-amber-900 border border-amber-300 cursor-wait'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Pipeline Executing...' : 'Execute Pipeline'}</span>
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-[11px] text-slate-500 flex-wrap gap-y-1">
          <span className="text-slate-600 font-semibold">Quick Protocols:</span>
          <button
            onClick={() => setQueryInput('(transformer OR "attention mechanism") AND (efficiency OR sparse OR linear) AND (benchmark OR latency)')}
            className="text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 transition-colors"
          >
            Transformers
          </button>
          <button
            onClick={() => setQueryInput('(CRISPR OR "Cas9" OR "base editor") AND (off-target OR specificity OR cleavage) AND human')}
            className="text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 transition-colors"
          >
            CRISPR Off-Target
          </button>
          <button
            onClick={() => setQueryInput('("GLP-1" OR semaglutide OR tirzepatide) AND (cardiovascular OR mortality OR MACE) AND trial')}
            className="text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 transition-colors"
          >
            GLP-1 MACE
          </button>
        </div>
      </div>

      {/* Terminal Output Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow-md overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-3.5 sm:px-4 py-2 sm:py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-300 ml-1 sm:ml-2">
              episteme-pipeline.log
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <select
              aria-label="Filter by Agent"
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="bg-slate-950 border border-slate-750 text-slate-300 text-[10px] sm:text-[11px] rounded px-2 py-0.5 focus:outline-none"
            >
              <option value="all">All Agents</option>
              <option value="SearchAgent">SearchAgent</option>
              <option value="ScreeningAgent">ScreeningAgent</option>
              <option value="ExtractionAgent">ExtractionAgent</option>
              <option value="SynthesisAgent">SynthesisAgent</option>
            </select>
          </div>
        </div>

        {/* Terminal Logs Stream */}
        <div className="p-3 sm:p-4 max-h-[380px] sm:max-h-[440px] overflow-y-auto space-y-2 select-text text-[11px]">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-600 text-center py-8">
              No audit records generated for this filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex flex-col xs:flex-row items-start xs:items-center space-y-1 xs:space-y-0 xs:space-x-2 text-slate-300 hover:bg-slate-900/40 p-1.5 rounded transition-colors">
                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className="text-slate-600 text-[9px] sm:text-[10px]">{log.timestamp}</span>
                  {getLevelIcon(log.level)}
                  <span className={`px-1.5 py-0.2 rounded border text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider shrink-0 ${getAgentColor(log.agent)}`}>
                    {log.agent}
                  </span>
                  <span className="font-semibold text-slate-200 shrink-0">[{log.action}]</span>
                </div>
                <span className="text-slate-300 break-words flex-1 text-[10px] sm:text-[11px] pl-4 xs:pl-0">{log.details}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
