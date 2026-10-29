import React from 'react';
import { ValidationIssue } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface ValidationRailProps {
  issues: ValidationIssue[];
  hotsPercentage: number;
  totalWeightage: number;
  onNavigateSection?: (section: ValidationIssue['section']) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ValidationRail: React.FC<ValidationRailProps> = ({
  issues,
  hotsPercentage,
  totalWeightage,
  onNavigateSection,
}) => {
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  const isCompliant = errorCount === 0 && warningCount === 0;

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 shadow-2xs">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0F9D8A]" />
            <h3 className="font-headline text-xs font-bold uppercase tracking-wider text-[#1E3A5F]">
              Accreditation Compliance
            </h3>
          </div>
          <span
            className={`academic-badge text-[10px] ${
              errorCount > 0
                ? 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'
                : warningCount > 0
                ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]'
                : 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
            }`}
          >
            {errorCount > 0
              ? `${errorCount} Non-Compliant`
              : warningCount > 0
              ? 'Pending Review'
              : 'NBA Compliant'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Continuous validation against NBA Criterion 2 & 3
        </p>
      </div>

      {/* Metric Cards */}
      <div className="p-4 border-b border-slate-100 bg-[#F8FAFC]/50 grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>Bloom's HOTS</span>
            <TrendingUp className="w-3 h-3 text-[#0F9D8A]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-mono text-lg font-bold ${
                hotsPercentage >= 60 ? 'text-[#0F9D8A]' : 'text-amber-600'
              }`}
            >
              {hotsPercentage}%
            </span>
            <span className="text-[10px] text-slate-400">Target ≥ 60%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-xs overflow-hidden mt-1.5">
            <div
              className={`h-full transition-all duration-300 ${
                hotsPercentage >= 60 ? 'bg-[#0F9D8A]' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, hotsPercentage)}%` }}
            />
          </div>
        </div>

        <div className="p-2.5 bg-white border border-slate-200 rounded">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>Evaluation Sum</span>
            <FileCheck className="w-3 h-3 text-[#1E3A5F]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-mono text-lg font-bold ${
                totalWeightage === 100 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {totalWeightage}%
            </span>
            <span className="text-[10px] text-slate-400">Target 100%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-xs overflow-hidden mt-1.5">
            <div
              className={`h-full transition-all duration-300 ${
                totalWeightage === 100 ? 'bg-emerald-600' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, totalWeightage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {issues.length === 0 ? (
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded text-center my-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-semibold text-xs text-emerald-900 mb-1">
              All Criterion Checks Satisfied
            </h4>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Course specification fulfills all credit, Bloom's cognitive distribution, and CO-PO matrix requirements.
            </p>
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onNavigateSection && onNavigateSection(issue.section)}
              className={`p-3 rounded border text-xs cursor-pointer transition-all hover:shadow-xs group ${
                issue.severity === 'error'
                  ? 'bg-red-50/70 border-red-200 hover:border-red-300'
                  : issue.severity === 'warning'
                  ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                  : 'bg-blue-50/70 border-blue-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                {issue.severity === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                {issue.severity === 'warning' && (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                {issue.severity === 'info' && (
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-slate-700">
                      {issue.section}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="font-medium text-slate-900 text-xs mt-0.5 leading-snug">
                    {issue.message}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 pl-6 mt-1 border-t border-black/5 pt-1">
                <span className="font-semibold text-slate-700">Fix: </span>
                {issue.recommendation}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      <div className="p-3 bg-[#F8FAFC] border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Issues: {issues.length}</span>
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <span className="text-red-700 font-semibold">{errorCount} errors</span>
          )}
          {warningCount > 0 && (
            <span className="text-amber-700 font-semibold">{warningCount} warnings</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default ValidationRail;
