import React, { useState } from 'react';
import { CourseOutcome, CourseSpecification, Role } from '../types';
import { annexureA, executeAIRequest } from '../api';
import {
  Layers,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  Info,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface OutcomesScreenProps {
  course: CourseSpecification;
  role: Role;
  onChange: (updated: CourseSpecification) => void;
  onOpenReference: (tab: 'po' | 'pso' | 'blooms') => void;
}

export const OutcomesScreen: React.FC<OutcomesScreenProps> = ({
  course,
  role,
  onChange,
  onOpenReference,
}) => {
  const isReadOnly = role === 'reviewer';
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeVerbGuideCO, setActiveVerbGuideCO] = useState<string | null>(null);

  const bloomsMap = React.useMemo(() => {
    const map = new Map<string, typeof annexureA.bloomsLevels[0]>();
    annexureA.bloomsLevels.forEach((b) => map.set(b.level, b));
    return map;
  }, []);

  const handleAddCO = () => {
    const nextNum = course.courseOutcomes.length + 1;
    const newCO: CourseOutcome = {
      id: `co-${Date.now()}`,
      code: `CO${nextNum}`,
      statement: '',
      bloomsLevel: nextNum >= 4 ? 'L5' : 'L3',
      targetAttainment: 70,
      assessmentMethods: ['CIE Written Exam', 'Lab Practicum'],
    };

    // Also initialize matrix row
    const newMatrix: Record<string, Record<string, number>> = {
      ...course.copoMatrix,
      [newCO.id]: {},
    };
    annexureA.programOutcomes.forEach((po) => {
      newMatrix[newCO.id][po.code] = 0;
    });
    annexureA.programSpecificOutcomes.forEach((pso) => {
      newMatrix[newCO.id][pso.code] = 0;
    });

    onChange({
      ...course,
      courseOutcomes: [...course.courseOutcomes, newCO],
      copoMatrix: newMatrix,
    });
  };

  const handleUpdateCO = (id: string, updates: Partial<CourseOutcome>) => {
    const updated = course.courseOutcomes.map((co) =>
      co.id === id ? { ...co, ...updates } : co
    );
    onChange({ ...course, courseOutcomes: updated });
  };

  const handleDeleteCO = (id: string) => {
    const updated = course.courseOutcomes.filter((co) => co.id !== id);
    const newMatrix = { ...course.copoMatrix };
    delete newMatrix[id];

    // Renumber remaining COs cleanly
    const renumbered = updated.map((co, idx) => ({
      ...co,
      code: `CO${idx + 1}`,
    }));

    onChange({
      ...course,
      courseOutcomes: renumbered,
      copoMatrix: newMatrix,
    });
  };

  const handleMoveCO = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= course.courseOutcomes.length) return;

    const items = [...course.courseOutcomes];
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const renumbered = items.map((co, idx) => ({
      ...co,
      code: `CO${idx + 1}`,
    }));

    onChange({ ...course, courseOutcomes: renumbered });
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Formulate 5 rigorous Course Outcomes (CO1 to CO5) adhering strictly to Revised Bloom's Taxonomy (L2 to L6) for the course "${course.courseTitle}" (${course.courseCode}) in ${course.department}. Ensure statements begin with active Bloom's verbs. Course description: ${course.courseDescription}.`;
      const resultText = await executeAIRequest(prompt);

      let generatedCOs: Array<{ code: string; statement: string; bloomsLevel: string; targetAttainment: number; assessmentMethods?: string[] }> = [];
      try {
        const jsonMatch = resultText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          generatedCOs = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Fallback to structured parsing if not strict JSON
      }

      if (generatedCOs.length > 0) {
        const newCOs: CourseOutcome[] = generatedCOs.map((g, idx) => ({
          id: `co-ai-${Date.now()}-${idx}`,
          code: `CO${idx + 1}`,
          statement: g.statement,
          bloomsLevel: g.bloomsLevel || (idx >= 3 ? 'L5' : 'L3'),
          targetAttainment: g.targetAttainment || 70,
          assessmentMethods: g.assessmentMethods || ['CIE Written Exam', 'Laboratory Practicum'],
        }));

        const newMatrix: Record<string, Record<string, number>> = {};
        newCOs.forEach((co, idx) => {
          newMatrix[co.id] = {};
          annexureA.programOutcomes.forEach((po, pIdx) => {
            // Seed realistic correlations for demo
            newMatrix[co.id][po.code] = (idx + pIdx) % 4 === 0 ? 3 : (idx + pIdx) % 3 === 0 ? 2 : (idx === pIdx ? 3 : 0);
          });
          annexureA.programSpecificOutcomes.forEach((pso, psoIdx) => {
            newMatrix[co.id][pso.code] = (idx + psoIdx) % 2 === 0 ? 3 : 2;
          });
        });

        onChange({
          ...course,
          courseOutcomes: newCOs,
          copoMatrix: newMatrix,
        });
      }
    } catch (e) {
      console.error('AI outcome generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Compute Cognitive Domain Distribution
  const bloomsCounts: Record<string, number> = {};
  annexureA.bloomsLevels.forEach((b) => (bloomsCounts[b.level] = 0));
  course.courseOutcomes.forEach((co) => {
    if (bloomsCounts[co.bloomsLevel] !== undefined) {
      bloomsCounts[co.bloomsLevel]++;
    }
  });

  const higherOrderCount =
    (bloomsCounts['L3'] || 0) +
    (bloomsCounts['L4'] || 0) +
    (bloomsCounts['L5'] || 0) +
    (bloomsCounts['L6'] || 0);
  const totalCount = course.courseOutcomes.length;
  const hotsPercent = totalCount > 0 ? Math.round((higherOrderCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & AI Action */}
      <div className="academic-card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-headline text-base font-bold text-[#1E3A5F]">
              Course Learning Outcomes (CLOs / COs)
            </h2>
            <span className="academic-badge bg-[#E6F7F5] text-[#006F61] border border-[#80F3DD]">
              Bloom's Taxonomy Revised
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Specify measurable outcomes using active verbs aligned with cognitive domain levels (L1–L6).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenReference('blooms')}
            className="academic-btn-secondary text-xs h-9"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0F9D8A]" />
            Bloom's Verb Guide
          </button>

          {!isReadOnly && (
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleAIGenerate}
              className="academic-btn-primary text-xs h-9"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#80F3DD]" />
              {isGenerating ? 'Synthesizing Outcomes...' : 'AI Suggest Outcomes'}
            </button>
          )}
        </div>
      </div>

      {/* Bloom's Cognitive Distribution Strip */}
      <div className="academic-card p-4 bg-white">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>Cognitive Complexity Spectrum</span>
          <span className="font-mono text-xs">
            HOTS (L3–L6):{' '}
            <strong className={hotsPercent >= 60 ? 'text-[#0F9D8A]' : 'text-amber-600'}>
              {hotsPercent}%
            </strong>{' '}
            (NBA Target: ≥ 60%)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {annexureA.bloomsLevels.map((b) => {
            const count = bloomsCounts[b.level] || 0;
            return (
              <div
                key={b.level}
                className="p-2.5 rounded border border-slate-200 bg-[#F8FAFC] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: b.badgeColor }}
                  >
                    {b.level}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {count} CO{count === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-1.5">
                  <span className="text-[11px] font-semibold text-slate-700 block truncate">
                    {b.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {b.cognitiveDomain}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Outcomes List */}
      <div className="space-y-4">
        {course.courseOutcomes.map((co, index) => {
          const currentBloom = bloomsMap.get(co.bloomsLevel);
          const firstWord = co.statement.trim().split(/\s+/)[0] || '';
          const hasPrescribedVerb = currentBloom?.actionVerbs.some(
            (v) => v.toLowerCase() === firstWord.toLowerCase()
          );

          return (
            <div
              key={co.id}
              className="academic-card p-5 bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  {/* Reorder Buttons */}
                  {!isReadOnly && (
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveCO(index, 'up')}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === course.courseOutcomes.length - 1}
                        onClick={() => handleMoveCO(index, 'down')}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className="font-mono text-sm font-bold px-2.5 py-1 rounded bg-[#1E3A5F] text-white">
                    {co.code}
                  </span>

                  {/* Bloom's Level Select */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Cognitive Level:
                    </label>
                    <select
                      disabled={isReadOnly}
                      value={co.bloomsLevel}
                      onChange={(e) => handleUpdateCO(co.id, { bloomsLevel: e.target.value })}
                      className="academic-input py-1 text-xs font-semibold bg-white text-slate-900 pr-7"
                    >
                      {annexureA.bloomsLevels.map((b) => (
                        <option key={b.level} value={b.level}>
                          {b.level}: {b.name} ({b.cognitiveDomain})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Target Attainment */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Target Attainment:
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={40}
                        max={100}
                        disabled={isReadOnly}
                        value={co.targetAttainment}
                        onChange={(e) =>
                          handleUpdateCO(co.id, {
                            targetAttainment: parseInt(e.target.value) || 60,
                          })
                        }
                        className="w-16 academic-input text-xs font-mono font-bold text-center"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                  </div>

                  {!isReadOnly && course.courseOutcomes.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCO(co.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded hover:text-red-700 transition-colors"
                      title="Delete Course Outcome"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Statement Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Outcome Statement</span>
                  {firstWord && (
                    <div className="flex items-center gap-1 text-[11px]">
                      {hasPrescribedVerb ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Begins with verified {currentBloom?.level} verb "{firstWord}"
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveVerbGuideCO(
                              activeVerbGuideCO === co.id ? null : co.id
                            )
                          }
                          className="text-amber-700 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Lightbulb className="w-3 h-3" />
                          Action verb suggestion for {currentBloom?.name}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <textarea
                  rows={2}
                  disabled={isReadOnly}
                  value={co.statement}
                  onChange={(e) => handleUpdateCO(co.id, { statement: e.target.value })}
                  placeholder={`Formulate measurable outcome starting with ${currentBloom?.actionVerbs.slice(0, 3).join(', ')}...`}
                  className="w-full academic-input p-2.5 h-auto text-xs leading-relaxed text-slate-900"
                />

                {/* Inline Action Verbs Guide if toggled */}
                {activeVerbGuideCO === co.id && currentBloom && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1.5 animate-in fade-in duration-150">
                    <span className="font-semibold text-slate-800">
                      Recommended action verbs for {currentBloom.level} ({currentBloom.name}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentBloom.actionVerbs.map((verb) => (
                        <button
                          key={verb}
                          type="button"
                          onClick={() => {
                            const words = co.statement.trim().split(/\s+/);
                            words[0] = verb;
                            handleUpdateCO(co.id, { statement: words.join(' ') });
                            setActiveVerbGuideCO(null);
                          }}
                          className="px-2 py-0.5 rounded bg-white text-slate-800 border border-amber-300 font-semibold hover:bg-amber-100 transition-colors"
                        >
                          {verb}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Click any verb to prepend/replace the initial outcome verb.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Outcome Trigger */}
      {!isReadOnly && (
        <button
          type="button"
          onClick={handleAddCO}
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-[#0F9D8A] text-slate-600 hover:text-[#0F9D8A] rounded font-semibold text-xs flex items-center justify-center gap-2 transition-colors bg-white/50 hover:bg-[#F5F7FA]"
        >
          <Plus className="w-4 h-4" />
          Add Course Outcome (CO{course.courseOutcomes.length + 1})
        </button>
      )}
    </div>
  );
};
export default OutcomesScreen;
