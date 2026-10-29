import React from 'react';
import { CourseSpecification, Role } from '../types';
import { BookOpen, Clock, Award, Shield, FileText, CheckCircle2 } from 'lucide-react';

interface CourseOverviewScreenProps {
  course: CourseSpecification;
  role: Role;
  onChange: (updated: CourseSpecification) => void;
}

export const CourseOverviewScreen: React.FC<CourseOverviewScreenProps> = ({
  course,
  role,
  onChange,
}) => {
  const isReadOnly = role === 'reviewer';

  const updateCredits = (key: keyof CourseSpecification['credits'], val: number) => {
    const newL = key === 'lecture' ? val : course.credits.lecture;
    const newT = key === 'tutorial' ? val : course.credits.tutorial;
    const newP = key === 'practical' ? val : course.credits.practical;
    const newS = key === 'experiential' ? val : course.credits.experiential;

    // Academic credit formula: L + T + P/2 + S/2
    const totalCredits = newL + newT + Math.floor(newP / 2) + Math.floor(newS / 2);
    const weeklyContactHours = newL + newT + newP + newS;
    const totalSemesterHours = weeklyContactHours * 15; // 15 standard teaching weeks
    const ectsEquivalence = Number((totalCredits * 1.5).toFixed(1));

    onChange({
      ...course,
      credits: {
        ...course.credits,
        [key]: val,
        totalCredits,
        contactHoursPerWeek: weeklyContactHours,
        totalSemesterHours,
        ectsEquivalence,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Accreditation Progress Stepper as specified in Design System */}
      <div className="academic-card p-4 bg-white">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
          <span>Accreditation Life Cycle Stage</span>
          <span className="text-[#1E3A5F] font-bold">
            Regulation: {course.regulation}
          </span>
        </div>
        <div className="relative flex items-center justify-between">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

          {/* Step 1: Draft */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-xs shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-[#1E3A5F] mt-1.5">1. Faculty Authoring</span>
          </div>

          {/* Step 2: Internal Review */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                course.status === 'under_review' || course.status === 'approved'
                  ? 'bg-[#1E3A5F] text-white shadow-xs'
                  : 'border-2 border-[#0F9D8A] bg-white text-[#0F9D8A]'
              }`}
            >
              {course.status === 'approved' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#0F9D8A]" />
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5">2. Department Review (HOD)</span>
          </div>

          {/* Step 3: Board Audit */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                course.status === 'approved'
                  ? 'border-2 border-[#0F9D8A] bg-white text-[#0F9D8A]'
                  : 'border border-slate-300 bg-white text-slate-400'
              }`}
            >
              {course.status === 'approved' ? (
                <span className="w-2 h-2 rounded-full bg-[#0F9D8A]" />
              ) : (
                '3'
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-500 mt-1.5">3. Academic Board Audit</span>
          </div>

          {/* Step 4: Accredited */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                course.status === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'border border-slate-300 bg-white text-slate-400'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium text-slate-500 mt-1.5">4. NBA Accredited</span>
          </div>
        </div>
      </div>

      {/* Primary Course Metadata Card */}
      <div className="academic-card p-6 bg-white space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-headline text-base font-bold text-[#1E3A5F]">
              Course Identification & General Nomenclature
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Version <strong className="text-slate-800 font-mono">{course.version}</strong> • Last Modified: {course.lastModified}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Course Code
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={course.courseCode}
              onChange={(e) => onChange({ ...course, courseCode: e.target.value })}
              className="w-full academic-input font-mono font-bold text-slate-900 uppercase"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={course.courseTitle}
              onChange={(e) => onChange({ ...course, courseTitle: e.target.value })}
              className="w-full academic-input font-semibold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Department
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={course.department}
              onChange={(e) => onChange({ ...course, department: e.target.value })}
              className="w-full academic-input text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Degree / Program
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={course.program}
              onChange={(e) => onChange({ ...course, program: e.target.value })}
              className="w-full academic-input text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Academic Regulation
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={course.regulation}
              onChange={(e) => onChange({ ...course, regulation: e.target.value })}
              className="w-full academic-input text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Semester
            </label>
            <input
              type="number"
              min={1}
              max={8}
              disabled={isReadOnly}
              value={course.semester}
              onChange={(e) => onChange({ ...course, semester: parseInt(e.target.value) || 1 })}
              className="w-full academic-input text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Academic Year
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={course.academicYear}
              onChange={(e) => onChange({ ...course, academicYear: e.target.value })}
              className="w-full academic-input text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Curriculum Category
            </label>
            <select
              disabled={isReadOnly}
              value={course.courseCategory}
              onChange={(e) => onChange({ ...course, courseCategory: e.target.value })}
              className="w-full academic-input text-slate-900 bg-white"
            >
              <option value="Professional Core Course (PCC)">Professional Core Course (PCC)</option>
              <option value="Professional Elective Course (PEC)">Professional Elective Course (PEC)</option>
              <option value="Engineering Science Course (ESC)">Engineering Science Course (ESC)</option>
              <option value="Basic Science Course (BSC)">Basic Science Course (BSC)</option>
              <option value="Open Elective Course (OEC)">Open Elective Course (OEC)</option>
              <option value="Humanities & Social Sciences (HSMC)">Humanities & Social Sciences (HSMC)</option>
            </select>
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Prerequisites & Foundational Courses
          </label>
          <input
            type="text"
            disabled={isReadOnly}
            value={course.prerequisites}
            onChange={(e) => onChange({ ...course, prerequisites: e.target.value })}
            placeholder="e.g. CS201: Data Structures, MA201: Discrete Mathematics"
            className="w-full academic-input text-slate-900"
          />
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Course Description & Academic Rationale
          </label>
          <textarea
            rows={3}
            disabled={isReadOnly}
            value={course.courseDescription}
            onChange={(e) => onChange({ ...course, courseDescription: e.target.value })}
            className="w-full academic-input text-slate-900 p-2.5 h-auto leading-relaxed"
          />
        </div>
      </div>

      {/* Credit Distribution Matrix Card */}
      <div className="academic-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0F9D8A]" />
            <h2 className="font-headline text-base font-bold text-[#1E3A5F]">
              Credit Structure & Instructional Contact Hours (L-T-P-S)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Standard: 1 Lecture = 1 Credit, 2 Lab/Tutorial = 1 Credit
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Lecture */}
          <div className="p-3.5 rounded border border-slate-200 bg-[#F8FAFC]">
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Lecture (L)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={10}
                disabled={isReadOnly}
                value={course.credits.lecture}
                onChange={(e) => updateCredits('lecture', parseInt(e.target.value) || 0)}
                className="w-20 academic-input font-mono font-bold text-lg text-[#1E3A5F]"
              />
              <span className="text-xs text-slate-500">hrs/week</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Direct classroom instruction</p>
          </div>

          {/* Tutorial */}
          <div className="p-3.5 rounded border border-slate-200 bg-[#F8FAFC]">
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Tutorial (T)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={6}
                disabled={isReadOnly}
                value={course.credits.tutorial}
                onChange={(e) => updateCredits('tutorial', parseInt(e.target.value) || 0)}
                className="w-20 academic-input font-mono font-bold text-lg text-[#1E3A5F]"
              />
              <span className="text-xs text-slate-500">hrs/week</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Guided problem solving</p>
          </div>

          {/* Practical */}
          <div className="p-3.5 rounded border border-slate-200 bg-[#F8FAFC]">
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Practical / Lab (P)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={12}
                disabled={isReadOnly}
                value={course.credits.practical}
                onChange={(e) => updateCredits('practical', parseInt(e.target.value) || 0)}
                className="w-20 academic-input font-mono font-bold text-lg text-[#1E3A5F]"
              />
              <span className="text-xs text-slate-500">hrs/week</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Hands-on coding / experiments</p>
          </div>

          {/* Experiential / Self Study */}
          <div className="p-3.5 rounded border border-slate-200 bg-[#F8FAFC]">
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Experiential (S)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={6}
                disabled={isReadOnly}
                value={course.credits.experiential}
                onChange={(e) => updateCredits('experiential', parseInt(e.target.value) || 0)}
                className="w-20 academic-input font-mono font-bold text-lg text-[#1E3A5F]"
              />
              <span className="text-xs text-slate-500">hrs/week</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Independent synthesis / mini-project</p>
          </div>
        </div>

        {/* Calculated Summary Strip with Tabular Numerics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
              Total Course Credits (C)
            </span>
            <span className="font-mono text-2xl font-bold text-blue-950 tabular-numbers">
              {course.credits.totalCredits}
            </span>
            <span className="text-[11px] text-blue-700 block mt-0.5">
              L + T + 0.5(P + S)
            </span>
          </div>

          <div className="p-3 bg-slate-100 border border-slate-200 rounded">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              Weekly Contact Hours
            </span>
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-numbers">
              {course.credits.contactHoursPerWeek}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Scheduled weekly hours
            </span>
          </div>

          <div className="p-3 bg-slate-100 border border-slate-200 rounded">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              Total Semester Hours
            </span>
            <span className="font-mono text-2xl font-bold text-slate-900 tabular-numbers">
              {course.credits.totalSemesterHours}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Based on 15 academic weeks
            </span>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              ECTS Equivalence
            </span>
            <span className="font-mono text-2xl font-bold text-emerald-950 tabular-numbers">
              {course.credits.ectsEquivalence}
            </span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">
              European Credit Transfer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseOverviewScreen;
