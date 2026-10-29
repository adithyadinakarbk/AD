import React from 'react';
import { CourseSpecification } from '../types';
import { annexureA } from '../api';
import { Printer, Download, X, Award, CheckCircle2, Building2 } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseSpecification;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(course, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${course.courseCode}_Syllabus_Specification.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const allColumns = [
    ...annexureA.programOutcomes,
    ...annexureA.programSpecificOutcomes,
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-4 print:p-0 print:bg-white">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto print:my-0 print:shadow-none print:border-none">
        {/* Sticky Action Toolbar (Hidden in print) */}
        <div className="bg-[#1E3A5F] text-white px-6 py-3.5 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#80F3DD]" />
            <h3 className="font-headline text-sm font-bold text-white">
              Official Course Specification Dossier (NBA Tier-1 / ABET Format)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="academic-btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs h-8"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
            <button
              onClick={handlePrint}
              className="academic-btn-primary bg-[#0F9D8A] hover:bg-[#006F61] text-xs h-8"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-300 hover:text-white"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 space-y-6 text-slate-900 print:p-6 print-page">
          {/* Institutional Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="flex items-center justify-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-widest mb-1">
              <Building2 className="w-4 h-4 text-[#1E3A5F]" />
              Department of {course.department}
            </div>
            <h1 className="font-headline text-xl sm:text-2xl font-black text-[#1E3A5F] uppercase tracking-tight">
              Institutional Course Specification & Accreditation Dossier
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Academic Regulation: <strong className="font-mono">{course.regulation}</strong> • Academic Year: <strong className="font-mono">{course.academicYear}</strong> • Semester {course.semester}
            </p>
          </div>

          {/* Section 1: Course Nomenclature & Credit Structure */}
          <div>
            <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-slate-300 pb-1 mb-3">
              1. Course Identification & Credit Allocation
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Course Code</span>
                <span className="font-mono font-bold text-sm text-[#1E3A5F]">{course.courseCode}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded sm:col-span-2">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Course Title</span>
                <span className="font-bold text-sm text-slate-900">{course.courseTitle}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Course Category</span>
                <span className="font-semibold text-slate-900 text-xs truncate block">{course.courseCategory}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Credits (L:T:P:S)</span>
                <span className="font-mono font-bold text-xs text-slate-900">
                  {course.credits.lecture}:{course.credits.tutorial}:{course.credits.practical}:{course.credits.experiential} = {course.credits.totalCredits} C
                </span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Contact Hours / Wk</span>
                <span className="font-mono font-bold text-xs text-slate-900">{course.credits.contactHoursPerWeek} hrs</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">Total Semester Hours</span>
                <span className="font-mono font-bold text-xs text-slate-900">{course.credits.totalSemesterHours} hrs</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-slate-500 font-semibold uppercase text-[10px] block">ECTS Equivalence</span>
                <span className="font-mono font-bold text-xs text-slate-900">{course.credits.ectsEquivalence}</span>
              </div>
            </div>

            <div className="mt-3 text-xs">
              <span className="font-bold text-slate-700">Prerequisites: </span>
              <span className="text-slate-800">{course.prerequisites || 'None'}</span>
            </div>
            <div className="mt-2 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-700">Course Rationale: </span>
              {course.courseDescription}
            </div>
          </div>

          {/* Section 2: Course Outcomes & Bloom's Taxonomy */}
          <div>
            <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-slate-300 pb-1 mb-3">
              2. Course Learning Outcomes (CLOs / COs)
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="border border-slate-300 p-2 text-left w-14 font-mono font-bold">CO #</th>
                  <th className="border border-slate-300 p-2 text-left font-bold">Course Learning Outcome Statement</th>
                  <th className="border border-slate-300 p-2 text-center w-28 font-bold">Bloom's Level</th>
                  <th className="border border-slate-300 p-2 text-center w-20 font-bold">Target (%)</th>
                </tr>
              </thead>
              <tbody>
                {course.courseOutcomes.map((co) => {
                  const bloom = annexureA.bloomsLevels.find((b) => b.level === co.bloomsLevel);
                  return (
                    <tr key={co.id} className="border-b border-slate-200">
                      <td className="border border-slate-300 p-2 font-mono font-bold text-[#1E3A5F]">{co.code}</td>
                      <td className="border border-slate-300 p-2">{co.statement}</td>
                      <td className="border border-slate-300 p-2 text-center font-semibold">
                        {co.bloomsLevel}: {bloom?.name}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-mono">{co.targetAttainment}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 3: CO-PO Matrix */}
          <div>
            <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-slate-300 pb-1 mb-3">
              3. CO-PO & CO-PSO Articulation Matrix (Scale: 1-Low, 2-Medium, 3-High)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-[11px] text-center">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 p-1.5 text-left font-mono font-bold w-12">CO</th>
                    {annexureA.programOutcomes.map((po) => (
                      <th key={po.code} className="border border-slate-300 p-1 font-mono font-bold text-[#1E3A5F]">
                        {po.code}
                      </th>
                    ))}
                    {annexureA.programSpecificOutcomes.map((pso) => (
                      <th key={pso.code} className="border border-slate-300 p-1 font-mono font-bold text-[#006F61] bg-teal-50">
                        {pso.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {course.courseOutcomes.map((co) => (
                    <tr key={co.id}>
                      <td className="border border-slate-300 p-1 text-left font-mono font-bold">{co.code}</td>
                      {annexureA.programOutcomes.map((po) => {
                        const val = course.copoMatrix[co.id]?.[po.code] || 0;
                        return (
                          <td key={po.code} className="border border-slate-300 p-1 font-mono">
                            {val === 0 ? '—' : val}
                          </td>
                        );
                      })}
                      {annexureA.programSpecificOutcomes.map((pso) => {
                        const val = course.copoMatrix[co.id]?.[pso.code] || 0;
                        return (
                          <td key={pso.code} className="border border-slate-300 p-1 font-mono bg-teal-50/40">
                            {val === 0 ? '—' : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Syllabus Breakdown */}
          <div>
            <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-slate-300 pb-1 mb-3">
              4. Modular Syllabus Architecture
            </h2>
            <div className="space-y-2.5 text-xs">
              {course.syllabus.map((unit) => (
                <div key={unit.id} className="border border-slate-300 rounded p-3">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>UNIT {unit.unitNumber}: {unit.title}</span>
                    <span className="font-mono text-slate-600">{unit.contactHours} Hours • Mapped: {unit.mappedCOs.join(', ')}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{unit.topics}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Assessment Distribution */}
          <div>
            <h2 className="font-headline text-sm font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-slate-300 pb-1 mb-3">
              5. Evaluation Scheme (Continuous Internal vs Semester End)
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 text-left font-bold">Assessment Component</th>
                  <th className="border border-slate-300 p-2 text-center w-24 font-bold">Category</th>
                  <th className="border border-slate-300 p-2 text-center w-24 font-bold">Max Marks</th>
                  <th className="border border-slate-300 p-2 text-center w-24 font-bold">Weightage (%)</th>
                  <th className="border border-slate-300 p-2 text-left font-bold">Evaluated COs</th>
                </tr>
              </thead>
              <tbody>
                {course.assessments.map((asm) => (
                  <tr key={asm.id}>
                    <td className="border border-slate-300 p-2 font-medium">{asm.name}</td>
                    <td className="border border-slate-300 p-2 text-center font-bold font-mono">{asm.type}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{asm.maxMarks}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-bold">{asm.weightage}%</td>
                    <td className="border border-slate-300 p-2 font-mono text-slate-700">{asm.mappedCOs.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formal Sign-off Verification Section */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-12">
              <div className="border-b border-slate-400 pb-1 min-h-[40px] flex items-end justify-center font-serif italic text-slate-800">
                {course.author}
              </div>
              <div>
                <span className="font-bold block text-slate-900">Course Coordinator / Author</span>
                <span className="text-slate-500 text-[10px]">Date: {course.lastModified}</span>
              </div>
            </div>

            <div className="space-y-12">
              <div className="border-b border-slate-400 pb-1 min-h-[40px] flex items-end justify-center font-serif italic text-slate-800">
                Prof. Robert Sterling, Ph.D.
              </div>
              <div>
                <span className="font-bold block text-slate-900">Head of Department (HOD)</span>
                <span className="text-slate-500 text-[10px]">Verified & Recommended</span>
              </div>
            </div>

            <div className="space-y-12">
              <div className="border-b border-slate-400 pb-1 min-h-[40px] flex items-end justify-center font-serif italic text-slate-800">
                Dr. Margaret Chen, Academic Dean
              </div>
              <div>
                <span className="font-bold block text-slate-900">Dean (Academics) / Reviewer</span>
                <span className="text-slate-500 text-[10px]">Board of Studies Approval</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExportReportModal;
