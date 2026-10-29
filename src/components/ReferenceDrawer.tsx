import React, { useState } from 'react';
import { annexureA } from '../api';
import { X, Search, BookOpen, Layers, Award, Target, ExternalLink } from 'lucide-react';

interface ReferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'po' | 'pso' | 'blooms';
}

export const ReferenceDrawer: React.FC<ReferenceDrawerProps> = ({
  isOpen,
  onClose,
  initialTab = 'po',
}) => {
  const [activeTab, setActiveTab] = useState<'po' | 'pso' | 'blooms'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  const filteredPOs = annexureA.programOutcomes.filter(
    (po) =>
      po.code.toLowerCase().includes(query) ||
      po.title.toLowerCase().includes(query) ||
      po.statement.toLowerCase().includes(query) ||
      po.category.toLowerCase().includes(query)
  );

  const filteredPSOs = annexureA.programSpecificOutcomes.filter(
    (pso) =>
      pso.code.toLowerCase().includes(query) ||
      pso.title.toLowerCase().includes(query) ||
      pso.statement.toLowerCase().includes(query) ||
      pso.category.toLowerCase().includes(query)
  );

  const filteredBlooms = annexureA.bloomsLevels.filter(
    (b) =>
      b.level.toLowerCase().includes(query) ||
      b.name.toLowerCase().includes(query) ||
      b.cognitiveDomain.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query) ||
      b.actionVerbs.some((v) => v.toLowerCase().includes(query))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-[#1E3A5F] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded">
              <BookOpen className="w-5 h-5 text-[#80F3DD]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-lg font-bold tracking-tight text-white">
                  Annexure A: Accreditation Reference Standards
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#0F9D8A] text-white">
                  NBA / Washington Accord
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official institutional program outcomes and revised Bloom's taxonomy criteria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & Search Filter */}
        <div className="p-4 bg-[#F8FAFC] border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex rounded bg-slate-200/80 p-0.5">
            <button
              onClick={() => setActiveTab('po')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'po'
                  ? 'bg-white text-[#1E3A5F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Program Outcomes ({annexureA.programOutcomes.length})
            </button>
            <button
              onClick={() => setActiveTab('pso')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'pso'
                  ? 'bg-white text-[#1E3A5F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Program Specific ({annexureA.programSpecificOutcomes.length})
            </button>
            <button
              onClick={() => setActiveTab('blooms')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'blooms'
                  ? 'bg-white text-[#1E3A5F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Bloom's Taxonomy (L1–L6)
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${
                activeTab === 'po'
                  ? 'program outcomes, keywords...'
                  : activeTab === 'pso'
                  ? 'program specific outcomes...'
                  : "action verbs (e.g. Design, Analyze, Implement)..."
              }`}
              className="w-full academic-input pl-9 text-xs bg-white text-slate-900"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: PO */}
          {activeTab === 'po' && (
            <div className="space-y-4">
              {filteredPOs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No matching Program Outcomes found for "{searchQuery}".
                </div>
              ) : (
                filteredPOs.map((po) => (
                  <div
                    key={po.id}
                    className="p-4 bg-white rounded border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#1E3A5F] text-white">
                          {po.code}
                        </span>
                        <h4 className="font-headline font-semibold text-slate-900 text-sm">
                          {po.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {po.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {po.statement}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PSO */}
          {activeTab === 'pso' && (
            <div className="space-y-4">
              {filteredPSOs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No matching Program Specific Outcomes found for "{searchQuery}".
                </div>
              ) : (
                filteredPSOs.map((pso) => (
                  <div
                    key={pso.id}
                    className="p-4 bg-white rounded border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0F9D8A] text-white">
                          {pso.code}
                        </span>
                        <h4 className="font-headline font-semibold text-slate-900 text-sm">
                          {pso.title}
                        </h4>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {pso.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {pso.statement}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Bloom's Taxonomy */}
          {activeTab === 'blooms' && (
            <div className="space-y-4">
              {filteredBlooms.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No matching Bloom's levels found for "{searchQuery}".
                </div>
              ) : (
                filteredBlooms.map((b) => (
                  <div
                    key={b.level}
                    className="p-4 bg-white rounded border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: b.badgeColor }}
                        >
                          {b.level}
                        </span>
                        <h4 className="font-headline font-bold text-slate-900 text-sm">
                          {b.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({b.cognitiveDomain})
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Level {b.order} of 6
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      {b.description}
                    </p>

                    {/* Action Verbs */}
                    <div className="mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                        Prescribed Action Verbs for Syllabus Outcomes:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {b.actionVerbs.map((verb) => (
                          <span
                            key={verb}
                            className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200"
                          >
                            {verb}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Typical Assessment Methods */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                        Typical Assessment Methods:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {b.typicalAssessments.map((asm) => (
                          <span
                            key={asm}
                            className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            {asm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <span>Data source: <code className="text-[#1E3A5F] font-mono">config/po_pso.json</code></span>
          <button
            onClick={onClose}
            className="academic-btn-secondary text-xs h-8"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReferenceDrawer;
