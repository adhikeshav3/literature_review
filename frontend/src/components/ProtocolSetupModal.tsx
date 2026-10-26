import React, { useState } from 'react';
import { X, BookMarked } from 'lucide-react';

interface ProtocolSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    research_question: string;
    population?: string;
    intervention?: string;
    comparator?: string;
    outcomes?: string;
    target_databases?: string[];
    search_query?: string;
  }) => void;
}

export const ProtocolSetupModal: React.FC<ProtocolSetupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [population, setPopulation] = useState('');
  const [intervention, setIntervention] = useState('');
  const [comparator, setComparator] = useState('');
  const [outcomes, setOutcomes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [databases, setDatabases] = useState<string[]>(['openalex', 'arxiv', 'crossref']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !researchQuestion) return;
    onSubmit({
      name,
      research_question: researchQuestion,
      population,
      intervention,
      comparator,
      outcomes,
      target_databases: databases,
      search_query: searchQuery || researchQuestion,
    });
    onClose();
  };

  const handleApplyPreset = (preset: 'crispr' | 'glp1' | 'gnn') => {
    if (preset === 'crispr') {
      setName('CRISPR-Cas9 Off-Target Cleavage & Base Editing Fidelity');
      setResearchQuestion('What strategies, gRNA modifications, and high-fidelity Cas variants achieve minimal off-target double-strand breaks in human cell lines?');
      setPopulation('Human primary cell lines and in vivo genomic models');
      setIntervention('Engineered high-fidelity Cas9 variants, prime editors, and base editors');
      setComparator('Wild-type SpCas9 (Streptococcus pyogenes)');
      setOutcomes('On-target indel frequency, off-target cleavage rates (GUIDE-seq, CIRCLE-seq), cell viability');
      setSearchQuery('(CRISPR OR "Cas9" OR "base editor") AND (off-target OR specificity OR cleavage) AND human');
    } else if (preset === 'glp1') {
      setName('GLP-1 Receptor Agonists & Major Adverse Cardiovascular Events (MACE)');
      setResearchQuestion('What is the comparative efficacy of GLP-1 receptor agonists vs standard therapy on all-cause mortality and MACE in diabetic and non-diabetic cohorts?');
      setPopulation('Adults with type 2 diabetes or obesity with cardiovascular risk');
      setIntervention('Long-acting GLP-1 receptor agonists (Semaglutide, Tirzepatide, Liraglutide)');
      setComparator('Placebo or standard hypoglycemic therapy');
      setOutcomes('MACE composite (CV death, non-fatal MI, non-fatal stroke), HbA1c reduction, BMI change');
      setSearchQuery('("GLP-1" OR semaglutide OR tirzepatide) AND (cardiovascular OR mortality OR MACE) AND trial');
    } else if (preset === 'gnn') {
      setName('Graph Neural Networks for Molecular Property Prediction & ADMET Screening');
      setResearchQuestion('How do 3D equivariant message-passing architectures compare with 2D molecular fingerprints in predicting solubility and toxicity?');
      setPopulation('Small molecule benchmark datasets (MoleculeNet, QM9, ZINC)');
      setIntervention('Equivariant Graph Neural Networks (SchNet, DimeNet, EGNN)');
      setComparator('Traditional fingerprints (ECFP4) and Random Forests / 2D GCNs');
      setOutcomes('MAE on quantum energies, ROC-AUC on Tox21/HIV, computational inference latency');
      setSearchQuery('("graph neural network" OR equivariant) AND (molecular OR "property prediction" OR ADMET) AND benchmark');
    }
  };

  const toggleDb = (db: string) => {
    if (databases.includes(db)) {
      setDatabases(databases.filter((d) => d !== db));
    } else {
      setDatabases([...databases, db]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 rounded-lg max-w-2xl w-full p-4 sm:p-6 shadow-2xl my-6 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BookMarked className="w-5 h-5 text-sky-400" />
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Register Review Protocol (PRISMA 2020)
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Scientific Presets */}
        <div className="bg-slate-950 p-2.5 sm:p-3 rounded-lg border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] sm:text-xs">Load Preset:</span>
          <div className="flex space-x-1.5 sm:space-x-2 flex-wrap gap-y-1">
            <button
              type="button"
              onClick={() => handleApplyPreset('crispr')}
              className="px-2 py-0.5 sm:py-1 bg-slate-900 hover:bg-slate-800 text-sky-300 rounded border border-slate-700 text-[11px] font-medium"
            >
              CRISPR
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('glp1')}
              className="px-2 py-0.5 sm:py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded border border-slate-700 text-[11px] font-medium"
            >
              GLP-1 MACE
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('gnn')}
              className="px-2 py-0.5 sm:py-1 bg-slate-900 hover:bg-slate-800 text-purple-300 rounded border border-slate-700 text-[11px] font-medium"
            >
              Molecular GNN
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Review Protocol Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Efficiency &amp; Sparsity in Transformer Architectures: Systematic Review"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Primary Research Question (PICO) *
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g., What are the empirical trade-offs, accuracy benchmarks, and computational profiles of sparse attention vs dense attention in language models?"
              value={researchQuestion}
              onChange={(e) => setResearchQuestion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* PICO Framework Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Population (P):</label>
              <input
                type="text"
                placeholder="e.g., Sequence modeling architectures"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Intervention (I):</label>
              <input
                type="text"
                placeholder="e.g., Sparse or linear attention mechanisms"
                value={intervention}
                onChange={(e) => setIntervention(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Comparator (C):</label>
              <input
                type="text"
                placeholder="e.g., Standard quadratic self-attention"
                value={comparator}
                onChange={(e) => setComparator(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Outcomes (O):</label>
              <input
                type="text"
                placeholder="e.g., Wall-clock speedup, memory, accuracy"
                value={outcomes}
                onChange={(e) => setOutcomes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Boolean Search String */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Initial Boolean Search String (AND/OR/NOT):
            </label>
            <input
              type="text"
              placeholder='(transformer OR attention) AND (efficiency OR sparse OR linear)'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Databases */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Target Academic Databases:</label>
            <div className="flex space-x-3 sm:space-x-4 flex-wrap gap-y-1">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={databases.includes('openalex')}
                  onChange={() => toggleDb('openalex')}
                  className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0"
                />
                <span className="text-slate-300 text-[11px] sm:text-xs">OpenAlex (250M+)</span>
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={databases.includes('arxiv')}
                  onChange={() => toggleDb('arxiv')}
                  className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0"
                />
                <span className="text-slate-300 text-[11px] sm:text-xs">arXiv Pre-prints</span>
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={databases.includes('crossref')}
                  onChange={() => toggleDb('crossref')}
                  className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0"
                />
                <span className="text-slate-300 text-[11px] sm:text-xs">CrossRef DOI</span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded shadow-sm transition-colors"
            >
              Register Protocol &amp; Create Workbench
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
