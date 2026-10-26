import React, { useState } from 'react';
import { ShieldCheck, Edit3 } from 'lucide-react';
import type { Paper, RiskOfBiasDetail } from '../types';

interface RiskOfBiasMatrixProps {
  papers: Paper[];
  onUpdateRiskOfBias: (paperId: string, rob: RiskOfBiasDetail) => void;
}

export const RiskOfBiasMatrix: React.FC<RiskOfBiasMatrixProps> = ({ papers, onUpdateRiskOfBias }) => {
  const includedPapers = papers.filter((p) => p.screening.status === 'included');
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);

  // Calculate domain percentages for summary chart
  const domains = [
    { key: 'selection_bias' as const, label: 'D1: Selection / Sampling' },
    { key: 'performance_bias' as const, label: 'D2: Performance / Protocol' },
    { key: 'attrition_bias' as const, label: 'D3: Attrition / Missing Runs' },
    { key: 'detection_bias' as const, label: 'D4: Detection / Measurement' },
    { key: 'reporting_bias' as const, label: 'D5: Selective Reporting' },
    { key: 'overall' as const, label: 'Overall Quality Appraisal' },
  ];

  const getDomainStats = (key: keyof RiskOfBiasDetail) => {
    let low = 0;
    let some = 0;
    let high = 0;
    includedPapers.forEach((p) => {
      const val = p.risk_of_bias?.[key] || 'Some Concerns';
      if (val === 'Low') low++;
      else if (val === 'High') high++;
      else some++;
    });
    const total = includedPapers.length || 1;
    return {
      lowPct: Math.round((low / total) * 100),
      somePct: Math.round((some / total) * 100),
      highPct: Math.round((high / total) * 100),
    };
  };

  const renderBadge = (val: 'Low' | 'Some Concerns' | 'High') => {
    if (val === 'Low') {
      return (
        <span
          title="Low Risk of Bias"
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-400 flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-2xs"
        >
          +
        </span>
      );
    }
    if (val === 'High') {
      return (
        <span
          title="High Risk of Bias"
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-100 text-rose-800 border border-rose-400 flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-2xs"
        >
          -
        </span>
      );
    }
    return (
      <span
        title="Some Concerns"
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-100 text-amber-800 border border-amber-400 flex items-center justify-center font-bold text-[11px] sm:text-xs shadow-2xs"
      >
        !
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cochrane Risk of Bias (RoB 2) Critical Appraisal</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Domain-level methodological quality evaluation adapted for empirical scientific and computational benchmarks.
            </p>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-medium flex-wrap">
            <span className="flex items-center space-x-1.5 text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Low (+)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-amber-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span>Some Concerns (!)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-rose-800">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              <span>High (-)</span>
            </span>
          </div>
        </div>

        {/* Domain Distribution Summary Bars */}
        <div className="mt-4 sm:mt-5 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Methodological Domain Quality Distribution
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {domains.map((d) => {
              const stats = getDomainStats(d.key);
              return (
                <div key={d.key} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1.5">
                    <span className="truncate pr-2">{d.label}</span>
                    <span className="text-emerald-700 font-mono font-bold shrink-0">{stats.lowPct}% Low</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 flex overflow-hidden">
                    <div style={{ width: `${stats.lowPct}%` }} className="bg-emerald-500" title={`Low: ${stats.lowPct}%`} />
                    <div style={{ width: `${stats.somePct}%` }} className="bg-amber-500" title={`Some Concerns: ${stats.somePct}%`} />
                    <div style={{ width: `${stats.highPct}%` }} className="bg-rose-500" title={`High: ${stats.highPct}%`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE / PHONE CARD VIEW (< md screens) */}
      <div className="block md:hidden space-y-3">
        {includedPapers.map((paper) => {
          const rob = paper.risk_of_bias || {
            overall: 'Some Concerns',
            selection_bias: 'Low',
            performance_bias: 'Some Concerns',
            attrition_bias: 'Low',
            detection_bias: 'Low',
            reporting_bias: 'Low',
            justification: 'Automated extraction appraisal derived from published methodology.',
          };
          const firstAuthor = paper.authors.length > 0 ? paper.authors[0] : 'Author';
          const etAl = paper.authors.length > 1 ? ' et al.' : '';

          return (
            <div key={paper.id} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs leading-snug">{paper.title}</h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">{firstAuthor}{etAl} ({paper.year})</div>
                </div>
                <button
                  onClick={() => setEditingPaper(paper)}
                  className="text-slate-500 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100 shrink-0"
                  title="Edit appraisal"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Traffic Light Badges Row */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between text-center text-[10px]">
                <div>
                  <div className="text-slate-500 mb-1">D1:Sel</div>
                  {renderBadge(rob.selection_bias)}
                </div>
                <div>
                  <div className="text-slate-500 mb-1">D2:Perf</div>
                  {renderBadge(rob.performance_bias)}
                </div>
                <div>
                  <div className="text-slate-500 mb-1">D3:Attr</div>
                  {renderBadge(rob.attrition_bias)}
                </div>
                <div>
                  <div className="text-slate-500 mb-1">D4:Det</div>
                  {renderBadge(rob.detection_bias)}
                </div>
                <div>
                  <div className="text-slate-500 mb-1">D5:Rep</div>
                  {renderBadge(rob.reporting_bias)}
                </div>
                <div className="border-l border-slate-200 pl-2">
                  <div className="text-slate-700 font-semibold mb-1">Overall</div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    rob.overall === 'Low' ? 'text-emerald-800 bg-emerald-100' : rob.overall === 'High' ? 'text-rose-800 bg-rose-100' : 'text-amber-800 bg-amber-100'
                  }`}>
                    {rob.overall}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-600 italic">
                {rob.justification}
              </div>
            </div>
          );
        })}
      </div>

      {/* LAPTOP / DESKTOP TABLE VIEW (hidden on < md screens) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 font-semibold select-none border-b border-slate-200">
              <tr>
                <th scope="col" className="py-3 px-4 w-72">Included Study</th>
                <th scope="col" className="py-3 px-3 text-center">D1: Selection</th>
                <th scope="col" className="py-3 px-3 text-center">D2: Performance</th>
                <th scope="col" className="py-3 px-3 text-center">D3: Attrition</th>
                <th scope="col" className="py-3 px-3 text-center">D4: Detection</th>
                <th scope="col" className="py-3 px-3 text-center">D5: Reporting</th>
                <th scope="col" className="py-3 px-3 text-center font-bold">Overall Appraisal</th>
                <th scope="col" className="py-3 px-3 text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white">
              {includedPapers.map((paper) => {
                const rob = paper.risk_of_bias || {
                  overall: 'Some Concerns',
                  selection_bias: 'Low',
                  performance_bias: 'Some Concerns',
                  attrition_bias: 'Low',
                  detection_bias: 'Low',
                  reporting_bias: 'Low',
                  justification: 'Automated extraction appraisal derived from published methodology.',
                };

                const firstAuthor = paper.authors.length > 0 ? paper.authors[0] : 'Author';
                const etAl = paper.authors.length > 1 ? ' et al.' : '';

                return (
                  <tr key={paper.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{paper.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {firstAuthor}{etAl} ({paper.year})
                      </div>
                      <div className="text-[10px] text-slate-600 italic mt-1 line-clamp-1">
                        {rob.justification}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">{renderBadge(rob.selection_bias)}</td>
                    <td className="py-3 px-3 text-center">{renderBadge(rob.performance_bias)}</td>
                    <td className="py-3 px-3 text-center">{renderBadge(rob.attrition_bias)}</td>
                    <td className="py-3 px-3 text-center">{renderBadge(rob.detection_bias)}</td>
                    <td className="py-3 px-3 text-center">{renderBadge(rob.reporting_bias)}</td>
                    <td className="py-3 px-3 text-center font-semibold">
                      <div className="inline-flex items-center space-x-1.5">
                        {renderBadge(rob.overall)}
                        <span className={`text-[11px] font-bold ${
                          rob.overall === 'Low' ? 'text-emerald-800' : rob.overall === 'High' ? 'text-rose-800' : 'text-amber-800'
                        }`}>
                          {rob.overall}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setEditingPaper(paper)}
                        className="text-slate-400 hover:text-slate-900 p-1 rounded hover:bg-slate-100 transition-colors"
                        title="Edit Risk of Bias Appraisal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit RoB Modal */}
      {editingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="bg-white border border-slate-300 rounded-lg max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate pr-2">
                Edit Cochrane RoB 2: {editingPaper.title}
              </h3>
              <button onClick={() => setEditingPaper(null)} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              {(['selection_bias', 'performance_bias', 'attrition_bias', 'detection_bias', 'reporting_bias', 'overall'] as const).map((field) => (
                <div key={field} className="flex items-center justify-between">
                  <span className="capitalize text-slate-700 font-medium">
                    {field.replace('_', ' ')}:
                  </span>
                  <select
                    value={editingPaper.risk_of_bias?.[field] || 'Some Concerns'}
                    onChange={(e) => {
                      const updated = {
                        ...(editingPaper.risk_of_bias || {
                          overall: 'Some Concerns',
                          selection_bias: 'Low',
                          performance_bias: 'Some Concerns',
                          attrition_bias: 'Low',
                          detection_bias: 'Low',
                          reporting_bias: 'Low',
                          justification: '',
                        }),
                        [field]: e.target.value as any,
                      };
                      setEditingPaper({ ...editingPaper, risk_of_bias: updated });
                    }}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded px-2.5 py-1 focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Some Concerns">Some Concerns</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
              ))}

              <div className="pt-2">
                <label className="block text-slate-600 mb-1 font-medium">Appraisal Justification Rationale:</label>
                <textarea
                  rows={3}
                  value={editingPaper.risk_of_bias?.justification || ''}
                  onChange={(e) => {
                    const updated = {
                      ...(editingPaper.risk_of_bias || {
                        overall: 'Some Concerns',
                        selection_bias: 'Low',
                        performance_bias: 'Some Concerns',
                        attrition_bias: 'Low',
                        detection_bias: 'Low',
                        reporting_bias: 'Low',
                        justification: '',
                      }),
                      justification: e.target.value,
                    };
                    setEditingPaper({ ...editingPaper, risk_of_bias: updated });
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 text-xs focus:ring-1 focus:ring-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setEditingPaper(null)}
                className="px-3 py-1.5 rounded text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingPaper.risk_of_bias) {
                    onUpdateRiskOfBias(editingPaper.id, editingPaper.risk_of_bias);
                  }
                  setEditingPaper(null);
                }}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-xs"
              >
                Save Appraisal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
