import React, { useState } from 'react';
import { CourseSpecification, Role, SyllabusUnit, BookReference, WebReference } from '../types';
import {
  BookMarked,
  Clock,
  Plus,
  Trash2,
  BookOpen,
  Globe,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SyllabusScreenProps {
  course: CourseSpecification;
  role: Role;
  onChange: (updated: CourseSpecification) => void;
}

export const SyllabusScreen: React.FC<SyllabusScreenProps> = ({
  course,
  role,
  onChange,
}) => {
  const isReadOnly = role === 'reviewer';
  const totalSyllabusHours = course.syllabus.reduce((acc, u) => acc + (u.contactHours || 0), 0);
  const targetSemesterHours = course.credits.totalSemesterHours;
  const hoursMatch = totalSyllabusHours === targetSemesterHours;

  const handleUpdateUnit = (id: string, updates: Partial<SyllabusUnit>) => {
    const updated = course.syllabus.map((u) => (u.id === id ? { ...u, ...updates } : u));
    onChange({ ...course, syllabus: updated });
  };

  const handleToggleUnitCO = (unitId: string, coCode: string) => {
    const unit = course.syllabus.find((u) => u.id === unitId);
    if (!unit) return;
    const current = unit.mappedCOs || [];
    const exists = current.includes(coCode);
    const updatedCOs = exists ? current.filter((c) => c !== coCode) : [...current, coCode];
    handleUpdateUnit(unitId, { mappedCOs: updatedCOs });
  };

  const handleAddUnit = () => {
    const nextNum = course.syllabus.length + 1;
    const newUnit: SyllabusUnit = {
      id: `unit-${Date.now()}`,
      unitNumber: nextNum,
      title: `Curriculum Module ${nextNum}`,
      contactHours: 12,
      mappedCOs: course.courseOutcomes.length > 0 ? [course.courseOutcomes[0].code] : [],
      topics: 'Fundamental theoretical concepts, algorithmic procedures, and practical implementations.',
      pedagogicalMethod: 'Interactive classroom seminar and case study problem solving.',
    };
    onChange({ ...course, syllabus: [...course.syllabus, newUnit] });
  };

  const handleDeleteUnit = (id: string) => {
    const updated = course.syllabus.filter((u) => u.id !== id);
    const renumbered = updated.map((u, idx) => ({ ...u, unitNumber: idx + 1 }));
    onChange({ ...course, syllabus: renumbered });
  };

  // Textbooks
  const handleAddTextbook = () => {
    const newBook: BookReference = {
      title: 'Advanced Engineering Principles',
      author: 'Author Name',
      publisher: 'Academic Press',
      editionYear: '2024',
    };
    onChange({ ...course, textbooks: [...course.textbooks, newBook] });
  };

  const handleUpdateTextbook = (index: number, updates: Partial<BookReference>) => {
    const books = [...course.textbooks];
    books[index] = { ...books[index], ...updates };
    onChange({ ...course, textbooks: books });
  };

  const handleDeleteTextbook = (index: number) => {
    const books = course.textbooks.filter((_, idx) => idx !== index);
    onChange({ ...course, textbooks: books });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Hours Sync Indicator */}
      <div className="academic-card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#1E3A5F]" />
            <h2 className="font-headline text-base font-bold text-[#1E3A5F]">
              Modular Curriculum & Syllabus Architecture
            </h2>
            <span className="academic-badge bg-[#E6F7F5] text-[#006F61] border border-[#80F3DD]">
              Outcome-Based Units
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured units mapped to Course Outcomes with pedagogical delivery guidelines.
          </p>
        </div>

        {/* Contact Hours Status Pill */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded border text-xs font-semibold ${
            hoursMatch
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {hoursMatch ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>
            Total: <strong>{totalSyllabusHours} hrs</strong> / Target:{' '}
            <strong>{targetSemesterHours} hrs</strong>
          </span>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {course.syllabus.map((unit) => (
          <div
            key={unit.id}
            className="academic-card p-5 bg-white border border-slate-200 shadow-2xs space-y-4"
          >
            {/* Unit Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#1E3A5F] text-white">
                  UNIT {unit.unitNumber}
                </span>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={unit.title}
                  onChange={(e) => handleUpdateUnit(unit.id, { title: e.target.value })}
                  placeholder="Module Title..."
                  className="academic-input font-headline font-bold text-slate-900 text-sm flex-1 min-w-[200px]"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <label className="text-[11px] font-semibold text-slate-500 uppercase">
                    Hours:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    disabled={isReadOnly}
                    value={unit.contactHours}
                    onChange={(e) =>
                      handleUpdateUnit(unit.id, {
                        contactHours: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-16 academic-input text-xs font-mono font-bold text-center"
                  />
                </div>

                {!isReadOnly && course.syllabus.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteUnit(unit.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    title="Remove Unit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mapped COs Toggle Chips */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                Targeted Course Outcomes (COs) for this Module:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {course.courseOutcomes.map((co) => {
                  const isMapped = (unit.mappedCOs || []).includes(co.code);
                  return (
                    <button
                      key={co.code}
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => handleToggleUnitCO(unit.id, co.code)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors flex items-center gap-1 ${
                        isMapped
                          ? 'bg-[#0F9D8A] text-white border-[#0F9D8A] shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {co.code}
                      {isMapped && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Topics */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Detailed Module Content & Syllabus Sub-topics:
              </label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={unit.topics}
                onChange={(e) => handleUpdateUnit(unit.id, { topics: e.target.value })}
                className="w-full academic-input p-2.5 h-auto text-xs leading-relaxed text-slate-900 bg-white"
              />
            </div>

            {/* Pedagogical Methodology */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Instructional & Pedagogical Delivery Strategy:
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={unit.pedagogicalMethod}
                onChange={(e) =>
                  handleUpdateUnit(unit.id, { pedagogicalMethod: e.target.value })
                }
                placeholder="e.g. Flipped classroom, Laboratory hands-on demonstration, Problem-Based Learning"
                className="w-full academic-input text-xs text-slate-900"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Unit Trigger */}
      {!isReadOnly && (
        <button
          type="button"
          onClick={handleAddUnit}
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-[#0F9D8A] text-slate-600 hover:text-[#0F9D8A] rounded font-semibold text-xs flex items-center justify-center gap-2 transition-colors bg-white/50 hover:bg-[#F5F7FA]"
        >
          <Plus className="w-4 h-4" />
          Add Curriculum Module (Unit {course.syllabus.length + 1})
        </button>
      )}

      {/* Prescribed Literature & Reference Materials */}
      <div className="academic-card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1E3A5F]" />
            <h3 className="font-headline text-base font-bold text-[#1E3A5F]">
              Prescribed Textbooks & Bibliographic References
            </h3>
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleAddTextbook}
              className="academic-btn-secondary text-xs h-8"
            >
              <Plus className="w-3.5 h-3.5 text-[#1E3A5F]" />
              Add Textbook
            </button>
          )}
        </div>

        <div className="space-y-3">
          {course.textbooks.map((book, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#F8FAFC] border border-slate-200 rounded grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              <div className="sm:col-span-5">
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={book.title}
                  onChange={(e) => handleUpdateTextbook(idx, { title: e.target.value })}
                  placeholder="Book Title (e.g. Introduction to Algorithms)"
                  className="w-full academic-input text-xs font-semibold text-slate-900 bg-white"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={book.author}
                  onChange={(e) => handleUpdateTextbook(idx, { author: e.target.value })}
                  placeholder="Authors"
                  className="w-full academic-input text-xs text-slate-800 bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={book.publisher}
                  onChange={(e) => handleUpdateTextbook(idx, { publisher: e.target.value })}
                  placeholder="Publisher"
                  className="w-full academic-input text-xs text-slate-800 bg-white"
                />
              </div>
              <div className="sm:col-span-1">
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={book.editionYear}
                  onChange={(e) => handleUpdateTextbook(idx, { editionYear: e.target.value })}
                  placeholder="Year"
                  className="w-full academic-input text-xs font-mono text-center text-slate-800 bg-white"
                />
              </div>
              <div className="sm:col-span-1 text-right">
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTextbook(idx)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SyllabusScreen;
