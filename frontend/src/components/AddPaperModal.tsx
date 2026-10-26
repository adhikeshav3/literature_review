import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

interface AddPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    authors?: string[];
    year?: number;
    venue?: string;
    abstract: string;
    doi?: string;
    url?: string;
  }) => void;
}

export const AddPaperModal: React.FC<AddPaperModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [authorsStr, setAuthorsStr] = useState('');
  const [year, setYear] = useState<number>(2023);
  const [venue, setVenue] = useState('');
  const [abstract, setAbstract] = useState('');
  const [doi, setDoi] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !abstract) return;

    const authors = authorsStr
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    onSubmit({
      title,
      authors: authors.length > 0 ? authors : ['Primary Investigator'],
      year,
      venue: venue || 'Direct Researcher Ingestion',
      abstract,
      doi: doi || undefined,
      url: doi ? `https://doi.org/${doi}` : undefined,
    });

    onClose();
    setTitle('');
    setAuthorsStr('');
    setAbstract('');
    setDoi('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-lg max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto my-6 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-sky-700" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Ingest Study Into Evidence Matrix
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Study Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., FlashAttention-2: Faster Attention with Better Parallelism"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Authors (comma separated):
              </label>
              <input
                type="text"
                placeholder="e.g., Tri Dao, Daniel Y. Fu"
                value={authorsStr}
                onChange={(e) => setAuthorsStr(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Publication Year:
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2023)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Journal / Conference Venue:
              </label>
              <input
                type="text"
                placeholder="e.g., ICLR / Nature / IEEE"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                DOI (Digital Object Identifier):
              </label>
              <input
                type="text"
                placeholder="e.g., 10.48550/arXiv.2307.08691"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Literature Abstract *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Paste full text abstract. Autonomous heuristic agents will automatically extract methodology design, sample size, intervention, comparator, and quantitative findings..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 leading-relaxed"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium border border-slate-300 hover:bg-slate-50 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded shadow-xs"
            >
              Extract &amp; Ingest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
