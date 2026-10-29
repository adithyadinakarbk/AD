import React from 'react';
import { AssessmentComponent, CourseSpecification, Role } from '../types';
import {
  FileCheck2,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Scale,
  Percent
} from 'lucide-react';

interface AssessmentScreenProps {
  course: CourseSpecification;
  role: Role;
  onChange: (updated: CourseSpecification) => void;
}

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  course,
  role,
  onChange,
}) => {
  const isReadOnly = role === 'reviewer';

  const totalWeightage = course.assessments.reduce(
    (acc, curr) => acc + (curr.weightage || 0),
    0
  );
  const cieWeightage = course.assessments
    .filter((a) => a.type === 'CIE')
    .reduce((acc, curr) => acc + (curr.weightage || 0), 0);
  const seeWeightage = course.assessments
    .filter((a) => a.type === 'SEE')
    .reduce((acc, curr) => acc + (curr.weightage || 0), 0);

  const isBalanced = totalWeightage === 100;

  const handleUpdateAssessment = (
    id: string,
    updates: Partial<AssessmentComponent>
  ) => {
    const updated = course.assessments.map((a) => (a.id === id ? { ...a, ...updates } : a));
    onChange({ ...course, assessments: updated });
  };

  const handleToggleCO = (asmId: string, coCode: string) => {
    const asm = course.assessments.find((a) => a.id === asmId);
    if (!asm) return;
    const current = asm.mappedCOs || [];
    const exists = current.includes(coCode);
    const updatedCOs = exists ? current.filter((c) => c !== coCode) : [...current, coCode];
    handleUpdateAssessment(asmId, { mappedCOs: updatedCOs });
  };

  const handleAddAssessment = (type: 'CIE' | 'SEE') => {
    const nextNum = course.assessments.length + 1;
    const newAsm: AssessmentComponent = {
      id: `asm-${Date.now()}`,
      name: type === 'CIE' ? `Continuous Assessment Test ${nextNum}` : 'Semester End Theory Exam',
      type,
      weightage: 10,
      maxMarks: 50,
      mappedCOs: course.courseOutcomes.map((c) => c.code),
    };
    onChange({ ...course, assessments: [...course.assessments, newAsm] });
  };

  const handleDeleteAssessment = (id: string) => {
    const updated = course.assessments.filter((a) => a.id !== id);
    onChange({ ...course, assessments: updated });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="academic-card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-headline text-base font-bold text-[#1E3A5F]">
              Assessment Scheme & Evaluation Rubric
            </h2>
            <span className="academic-badge bg-[#E6F7F5] text-[#006F61] border border-[#80F3DD]">
              CIE / SEE Distribution
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure continuous internal evaluation and semester-end examinations mapped to outcomes.
          </p>
        </div>

        {/* Action button */}
        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddAssessment('CIE')}
              className="academic-btn-secondary text-xs h-9"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E3A5F]" />
              Add CIE Component
            </button>
            <button
              type="button"
              onClick={() => handleAddAssessment('SEE')}
              className="academic-btn-primary text-xs h-9"
            >
              <Plus className="w-3.5 h-3.5 text-[#80F3DD]" />
              Add SEE Component
            </button>
          </div>
        )}
      </div>

      {/* Validation Status Banner as specified in Design System */}
      <div
        className={`p-4 rounded border-l-4 transition-all ${
          isBalanced
            ? 'bg-[#F0FDF4] border-[#16A34A] text-[#166534]'
            : 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isBalanced ? (
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />
            )}
            <div>
              <h4 className="font-bold text-xs">
                {isBalanced
                  ? 'Evaluation Weightage Sum Fully Balanced (100%)'
                  : `Discrepancy: Total Assessment Weightage is ${totalWeightage}% (Must equal exactly 100%)`}
              </h4>
              <p className="text-[11px] opacity-90 mt-0.5">
                CIE Total: <strong>{cieWeightage}%</strong> • SEE Total: <strong>{seeWeightage}%</strong> (Standard AICTE / NBA recommended ratio is 50:50 or 40:60).
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 font-mono text-xl font-bold">
            <span>{totalWeightage}</span>
            <span className="text-xs font-normal">/ 100%</span>
          </div>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="space-y-3">
        {course.assessments.map((asm) => (
          <div
            key={asm.id}
            className="academic-card p-4 bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                    asm.type === 'CIE' ? 'bg-[#1E3A5F]' : 'bg-[#0F9D8A]'
                  }`}
                >
                  {asm.type}
                </span>

                <input
                  type="text"
                  disabled={isReadOnly}
                  value={asm.name}
                  onChange={(e) => handleUpdateAssessment(asm.id, { name: e.target.value })}
                  placeholder="Component Name..."
                  className="academic-input font-semibold text-slate-900 text-xs flex-1 min-w-[200px]"
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Max Marks */}
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase">
                    Max Marks:
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    disabled={isReadOnly}
                    value={asm.maxMarks}
                    onChange={(e) =>
                      handleUpdateAssessment(asm.id, {
                        maxMarks: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-16 academic-input text-xs font-mono font-bold text-center"
                  />
                </div>

                {/* Weightage Percentage */}
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase">
                    Weight:
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      disabled={isReadOnly}
                      value={asm.weightage}
                      onChange={(e) =>
                        handleUpdateAssessment(asm.id, {
                          weightage: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-16 academic-input text-xs font-mono font-bold text-center text-[#1E3A5F]"
                    />
                    <span className="text-xs text-slate-500 font-bold">%</span>
                  </div>
                </div>

                {!isReadOnly && course.assessments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteAssessment(asm.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    title="Remove Assessment Component"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mapped COs */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">
                Directly Evaluated Outcomes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {course.courseOutcomes.map((co) => {
                  const isMapped = (asm.mappedCOs || []).includes(co.code);
                  return (
                    <button
                      key={co.code}
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => handleToggleCO(asm.id, co.code)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border transition-colors ${
                        isMapped
                          ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {co.code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AssessmentScreen;
