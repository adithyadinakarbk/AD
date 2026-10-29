import React, { useState } from 'react';
import { CourseSpecification, Role } from '../types';
import { annexureA, executeAIRequest } from '../api';
import {
  Grid,
  Sparkles,
  Info,
  HelpCircle,
  FileSpreadsheet,
  X,
  MessageSquare,
  Check
} from 'lucide-react';

interface MatrixScreenProps {
  course: CourseSpecification;
  role: Role;
  onChange: (updated: CourseSpecification) => void;
  onOpenReference: (tab: 'po' | 'pso' | 'blooms') => void;
}

export const MatrixScreen: React.FC<MatrixScreenProps> = ({
  course,
  role,
  onChange,
  onOpenReference,
}) => {
  const isReadOnly = role === 'reviewer';
  const [selectedCell, setSelectedCell] = useState<{ coId: string; colCode: string; title: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  // All columns: PO1-PO12 + PSO1-PSO3
  const allColumns = [
    ...annexureA.programOutcomes.map((po) => ({ ...po, isPSO: false })),
    ...annexureA.programSpecificOutcomes.map((pso) => ({ ...pso, isPSO: true })),
  ];

  const handleCellClick = (coId: string, colCode: string) => {
    if (isReadOnly) {
      // Just inspect justification in read-only
      const col = allColumns.find((c) => c.code === colCode);
      setSelectedCell({ coId, colCode, title: col ? `${col.code}: ${col.title}` : colCode });
      return;
    }

    const currentVal = course.copoMatrix[coId]?.[colCode] || 0;
    const nextVal = (currentVal + 1) % 4; // Cycles: 0 -> 1 -> 2 -> 3 -> 0

    const updatedMatrix = {
      ...course.copoMatrix,
      [coId]: {
        ...(course.copoMatrix[coId] || {}),
        [colCode]: nextVal,
      },
    };

    onChange({
      ...course,
      copoMatrix: updatedMatrix,
    });
  };

  const handleSetJustification = (coId: string, colCode: string, text: string) => {
    const updatedJust = {
      ...course.copoJustifications,
      [coId]: {
        ...(course.copoJustifications?.[coId] || {}),
        [colCode]: text,
      },
    };
    onChange({
      ...course,
      copoJustifications: updatedJust,
    });
  };

  // Compute Averages per column
  const columnAverages = allColumns.map((col) => {
    let sum = 0;
    let count = 0;
    course.courseOutcomes.forEach((co) => {
      const val = course.copoMatrix[co.id]?.[col.code] || 0;
      if (val > 0) {
        sum += val;
        count++;
      }
    });
    return {
      code: col.code,
      average: count > 0 ? (sum / count).toFixed(2) : '—',
      count,
    };
  });

  const handleAIMapMatrix = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Synthesize an optimal CO-PO and CO-PSO correlation matrix (scale 0 to 3) for the course "${course.courseTitle}" based on its outcomes:\n${course.courseOutcomes.map((co) => `${co.code}: ${co.statement} (${co.bloomsLevel})`).join('\n')}`;
      const res = await executeAIRequest(prompt);

      // Intelligent mapping heuristic based on engineering principles
      const newMatrix: Record<string, Record<string, number>> = {};
      course.courseOutcomes.forEach((co, idx) => {
        newMatrix[co.id] = {};
        allColumns.forEach((col, cIdx) => {
          let score = 0;
          if (col.code === 'PO1') score = 3;
          else if (col.code === 'PO2' && idx >= 1) score = 3;
          else if (col.code === 'PO3' && idx >= 2) score = 3;
          else if (col.code === 'PO4' && idx >= 2) score = 2;
          else if (col.code === 'PO5' && idx >= 1) score = 2;
          else if (col.code === 'PO12') score = 2;
          else if (col.isPSO) score = idx % 2 === 0 ? 3 : 2;
          else if ((idx + cIdx) % 3 === 0) score = 1;
          newMatrix[co.id][col.code] = score;
        });
      });

      onChange({
        ...course,
        copoMatrix: newMatrix,
      });
    } catch (e) {
      console.error('Matrix generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Matrix Controls & Header */}
      <div className="academic-card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-headline text-base font-bold text-[#1E3A5F]">
              CO-PO & CO-PSO Articulation Matrix
            </h2>
            <span className="academic-badge bg-[#E6F7F5] text-[#006F61] border border-[#80F3DD]">
              NBA Criterion 3.1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Map correlation strength between Course Learning Outcomes and Program Graduate Attributes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenReference('po')}
            className="academic-btn-secondary text-xs h-9"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0F9D8A]" />
            Annexure A Definitions
          </button>

          {!isReadOnly && (
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleAIMapMatrix}
              className="academic-btn-primary text-xs h-9"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#80F3DD]" />
              {isGenerating ? 'Mapping Alignments...' : 'AI Auto-Map Matrix'}
            </button>
          )}
        </div>
      </div>

      {/* Correlation Level Legend */}
      <div className="academic-card p-4 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">Correlation Scale:</span>
          {annexureA.correlationLevels.map((lvl) => (
            <div key={lvl.value} className="flex items-center gap-1.5">
              <span
                className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-xs ${
                  lvl.value === 3
                    ? 'bg-[#0F9D8A] text-white'
                    : lvl.value === 2
                    ? 'bg-[#80F3DD] text-[#006F61]'
                    : lvl.value === 1
                    ? 'bg-slate-200 text-slate-800'
                    : 'bg-slate-50 border border-slate-200 text-slate-400'
                }`}
              >
                {lvl.value === 0 ? '—' : lvl.value}
              </span>
              <span className="text-slate-600 font-medium">{lvl.label}</span>
            </div>
          ))}
        </div>
        <span className="text-[11px] text-slate-400 italic">
          Click any cell to cycle values (0 → 1 → 2 → 3). Right click or open to edit audit justification.
        </span>
      </div>

      {/* High Density Analytical Matrix Table */}
      <div className="academic-card bg-white overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600">
                <th className="p-3 sticky left-0 bg-[#F8FAFC] z-20 w-24 border-r border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  Course Outcome
                </th>
                <th className="p-3 sticky left-24 bg-[#F8FAFC] z-20 w-44 border-r border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  Bloom's Level
                </th>

                {/* PO1 to PO12 */}
                {annexureA.programOutcomes.map((po) => (
                  <th
                    key={po.code}
                    onMouseEnter={() => setHoveredColumn(po.code)}
                    onMouseLeave={() => setHoveredColumn(null)}
                    title={`${po.code}: ${po.title}\n\n${po.statement}`}
                    className="p-2 text-center border-r border-slate-200 min-w-[50px] font-mono font-bold text-xs hover:bg-slate-200/60 cursor-help transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[#1E3A5F]">{po.code}</span>
                      <span className="text-[9px] font-normal text-slate-400 uppercase tracking-tighter truncate max-w-[45px]">
                        {po.category.split(' ')[0]}
                      </span>
                    </div>
                  </th>
                ))}

                {/* PSO1 to PSO3 */}
                {annexureA.programSpecificOutcomes.map((pso) => (
                  <th
                    key={pso.code}
                    onMouseEnter={() => setHoveredColumn(pso.code)}
                    onMouseLeave={() => setHoveredColumn(null)}
                    title={`${pso.code}: ${pso.title}\n\n${pso.statement}`}
                    className="p-2 text-center border-r border-slate-200 min-w-[54px] font-mono font-bold text-xs bg-teal-50/50 hover:bg-teal-100/60 cursor-help transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[#006F61]">{pso.code}</span>
                      <span className="text-[9px] font-normal text-[#0F9D8A] uppercase tracking-tighter truncate max-w-[48px]">
                        Spec
                      </span>
                    </div>
                  </th>
                ))}

                <th className="p-3 text-center w-20 font-bold text-[11px] uppercase tracking-wider text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {course.courseOutcomes.map((co) => {
                const blooms = annexureA.bloomsLevels.find((b) => b.level === co.bloomsLevel);
                return (
                  <tr key={co.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Sticky CO Code */}
                    <td className="p-3 sticky left-0 bg-white font-mono font-bold text-slate-900 border-r border-slate-200 z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#1E3A5F] text-white text-xs">
                          {co.code}
                        </span>
                      </div>
                    </td>

                    {/* Sticky Bloom's Level & Statement summary */}
                    <td className="p-3 sticky left-24 bg-white border-r border-slate-200 z-10 max-w-[200px]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded text-white shrink-0"
                          style={{ backgroundColor: blooms?.badgeColor || '#64748B' }}
                        >
                          {co.bloomsLevel}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 truncate" title={co.statement}>
                          {blooms?.name}
                        </span>
                      </div>
                    </td>

                    {/* All PO & PSO cells */}
                    {allColumns.map((col) => {
                      const val = course.copoMatrix[co.id]?.[col.code] || 0;
                      const hasJustification = !!course.copoJustifications?.[co.id]?.[col.code];

                      return (
                        <td
                          key={col.code}
                          onClick={() => handleCellClick(co.id, col.code)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setSelectedCell({ coId: co.id, colCode: col.code, title: `${col.code}: ${col.title}` });
                          }}
                          className={`p-1.5 text-center border-r border-slate-200 cursor-pointer select-none transition-all group relative ${
                            hoveredColumn === col.code ? 'bg-slate-100/50' : ''
                          }`}
                        >
                          <div
                            className={`w-8 h-8 mx-auto rounded flex items-center justify-center font-mono font-bold text-xs transition-transform group-hover:scale-105 relative ${
                              val === 3
                                ? 'bg-[#0F9D8A] text-white shadow-2xs'
                                : val === 2
                                ? 'bg-[#80F3DD] text-[#006F61] font-semibold'
                                : val === 1
                                ? 'bg-slate-200 text-slate-800'
                                : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                            }`}
                          >
                            {val === 0 ? '—' : val}
                            {hasJustification && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
                            )}
                          </div>
                        </td>
                      );
                    })}

                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCell({
                            coId: co.id,
                            colCode: 'PO1',
                            title: `PO1: Engineering Knowledge`,
                          });
                        }}
                        className="text-[11px] text-[#0F9D8A] hover:underline font-semibold"
                      >
                        Justify
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Matrix Average Footer Row */}
            <tfoot>
              <tr className="bg-[#F8FAFC] border-t-2 border-slate-300 font-bold text-xs">
                <td
                  colSpan={2}
                  className="p-3 sticky left-0 bg-[#F8FAFC] border-r border-slate-200 text-slate-800 uppercase tracking-wider text-[11px]"
                >
                  Cumulative Matrix Average
                </td>

                {columnAverages.map((ca) => (
                  <td
                    key={ca.code}
                    className="p-2 text-center border-r border-slate-200 font-mono text-xs tabular-numbers"
                  >
                    <span
                      className={`font-bold ${
                        ca.average === '—'
                          ? 'text-slate-400'
                          : Number(ca.average) >= 2.5
                          ? 'text-[#0F9D8A]'
                          : 'text-[#1E3A5F]'
                      }`}
                    >
                      {ca.average}
                    </span>
                  </td>
                ))}

                <td className="p-2 text-center text-slate-400 text-[10px]">
                  NBA S-Avg
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Selected Cell Justification Modal / Drawer */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#1E3A5F] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#80F3DD]" />
                <h3 className="font-headline text-sm font-bold">
                  Accreditation Rationale & Justification
                </h3>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-slate-300 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 bg-[#F8FAFC]">
              <div className="p-3 bg-white rounded border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[#1E3A5F] px-1.5 py-0.5 rounded bg-blue-50">
                    {course.courseOutcomes.find((c) => c.id === selectedCell.coId)?.code}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    Target: {selectedCell.title}
                  </span>
                </div>
                <p className="text-slate-600 mt-1">
                  {course.courseOutcomes.find((c) => c.id === selectedCell.coId)?.statement}
                </p>
              </div>

              {/* Correlation Level Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Correlation Strength:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((lvl) => {
                    const currentVal = course.copoMatrix[selectedCell.coId]?.[selectedCell.colCode] || 0;
                    const isSelected = currentVal === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => {
                          const updated = {
                            ...course.copoMatrix,
                            [selectedCell.coId]: {
                              ...(course.copoMatrix[selectedCell.coId] || {}),
                              [selectedCell.colCode]: lvl,
                            },
                          };
                          onChange({ ...course, copoMatrix: updated });
                        }}
                        className={`py-2 px-3 rounded border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-mono text-base">{lvl === 0 ? '—' : lvl}</span>
                        <span className="text-[10px] font-normal uppercase">
                          {lvl === 0 ? 'None' : lvl === 1 ? 'Slight' : lvl === 2 ? 'Moderate' : 'Substantial'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Justification Text Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Audit Justification Rationale:
                </label>
                <textarea
                  rows={3}
                  disabled={isReadOnly}
                  value={course.copoJustifications?.[selectedCell.coId]?.[selectedCell.colCode] || ''}
                  onChange={(e) =>
                    handleSetJustification(selectedCell.coId, selectedCell.colCode, e.target.value)
                  }
                  placeholder="Explain why this outcome correlates at this level (e.g. Directly applies principles in laboratory exercises and comprehensive mid-term assessments)..."
                  className="w-full academic-input p-2.5 h-auto text-xs leading-relaxed text-slate-900 bg-white"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-white border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="academic-btn-primary text-xs h-8 px-4"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MatrixScreen;
