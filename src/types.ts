/**
 * Academic Precision Data Structures & Types
 * Defined in compliance with NBA (National Board of Accreditation) & ABET Criteria.
 */

export type Role = 'faculty' | 'hod' | 'reviewer';

export interface ProgramOutcome {
  id: string;
  code: string;
  title: string;
  statement: string;
  category: string;
}

export interface ProgramSpecificOutcome {
  id: string;
  code: string;
  title: string;
  statement: string;
  category: string;
}

export interface BloomsLevel {
  level: string; // 'L1' - 'L6'
  name: string;
  cognitiveDomain: string;
  description: string;
  actionVerbs: string[];
  typicalAssessments: string[];
  order: number;
  badgeColor: string;
}

export interface CorrelationLevel {
  value: number;
  label: string;
  description: string;
}

export interface AnnexureAConfig {
  programOutcomes: ProgramOutcome[];
  programSpecificOutcomes: ProgramSpecificOutcome[];
  bloomsLevels: BloomsLevel[];
  correlationLevels: CorrelationLevel[];
}

export interface CourseOutcome {
  id: string;
  code: string; // e.g. "CO1"
  statement: string;
  bloomsLevel: string; // "L1" - "L6"
  targetAttainment: number; // percentage (e.g. 70%)
  assessmentMethods: string[];
}

export interface CreditDistribution {
  lecture: number; // L
  tutorial: number; // T
  practical: number; // P
  experiential: number; // S
  totalCredits: number;
  contactHoursPerWeek: number;
  totalSemesterHours: number;
  ectsEquivalence: number;
}

export interface SyllabusUnit {
  id: string;
  unitNumber: number;
  title: string;
  contactHours: number;
  mappedCOs: string[]; // ["CO1", "CO2"]
  topics: string;
  pedagogicalMethod: string;
}

export interface AssessmentComponent {
  id: string;
  name: string;
  type: 'CIE' | 'SEE';
  weightage: number; // e.g. 25
  maxMarks: number;
  mappedCOs: string[];
}

export interface BookReference {
  title: string;
  author: string;
  publisher: string;
  editionYear: string;
}

export interface WebReference {
  title: string;
  source: string;
  url?: string;
}

export type CourseStatus = 'draft' | 'under_review' | 'approved' | 'revision_requested';

export interface CourseSpecification {
  id: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  program: string;
  regulation: string;
  semester: number;
  academicYear: string;
  courseCategory: string;
  prerequisites: string;
  courseDescription: string;
  credits: CreditDistribution;
  courseOutcomes: CourseOutcome[];
  copoMatrix: Record<string, Record<string, number>>; // [coId][poOrPsoId] = 0, 1, 2, 3
  copoJustifications: Record<string, Record<string, string>>; // [coId][poOrPsoId] = text
  syllabus: SyllabusUnit[];
  assessments: AssessmentComponent[];
  textbooks: BookReference[];
  referenceMaterials: WebReference[];
  status: CourseStatus;
  version: string;
  lastModified: string;
  author: string;
  reviewerFeedback?: string;
}

export interface AISettings {
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  customEndpoint?: string;
}

export interface ValidationIssue {
  id: string;
  section: 'overview' | 'outcomes' | 'matrix' | 'syllabus' | 'assessments';
  severity: 'error' | 'warning' | 'info';
  message: string;
  recommendation: string;
}
