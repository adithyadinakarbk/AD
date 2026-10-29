/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Role,
  CourseSpecification,
  ValidationIssue
} from './types';
import {
  loadCourses,
  saveCourses,
  getActiveCourseId,
  setActiveCourseId,
  validateCourse,
  annexureA
} from './api';
import { CourseOverviewScreen } from './components/CourseOverviewScreen';
import { OutcomesScreen } from './components/OutcomesScreen';
import { MatrixScreen } from './components/MatrixScreen';
import { SyllabusScreen } from './components/SyllabusScreen';
import { AssessmentScreen } from './components/AssessmentScreen';
import { ValidationRail } from './components/ValidationRail';
import { ReferenceDrawer } from './components/ReferenceDrawer';
import { ExportReportModal } from './components/ExportReportModal';
import { Settings } from './Settings';

import {
  GraduationCap,
  Layers,
  Grid,
  BookMarked,
  FileCheck2,
  Settings as SettingsIcon,
  BookOpen,
  Printer,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  Send,
  CheckCircle,
  FileText,
  Plus,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState<CourseSpecification[]>([]);
  const [activeCourseId, setActiveId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'outcomes' | 'matrix' | 'syllabus' | 'assessments'>('overview');
  const [role, setRole] = useState<Role>('faculty');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [referenceTab, setReferenceTab] = useState<'po' | 'pso' | 'blooms'>('po');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRailOpen, setIsRailOpen] = useState(true);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadCourses();
    setCourses(loaded);
    const active = getActiveCourseId();
    if (loaded.some((c) => c.id === active)) {
      setActiveId(active);
    } else if (loaded.length > 0) {
      setActiveId(loaded[0].id);
      setActiveCourseId(loaded[0].id);
    }
  }, []);

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  const handleUpdateActiveCourse = (updated: CourseSpecification) => {
    const updatedCourses = courses.map((c) => (c.id === updated.id ? updated : c));
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  const handleCreateCourse = () => {
    const newCourse: CourseSpecification = {
      id: `course-${Date.now()}`,
      courseCode: 'CS420',
      courseTitle: 'Cloud Computing & Distributed Systems',
      department: 'Computer Science & Engineering',
      program: 'B.Tech in Computer Science & Engineering',
      regulation: 'R2024 / Outcome-Based Education (OBE)',
      semester: 7,
      academicYear: '2026-2027',
      courseCategory: 'Professional Core Course (PCC)',
      prerequisites: 'CS301: Advanced Data Structures, CS304: Operating Systems',
      courseDescription: 'Principles of distributed architectures, virtualization, container orchestration, microservices patterns, serverless paradigms, and cloud security frameworks.',
      credits: {
        lecture: 3,
        tutorial: 0,
        practical: 2,
        experiential: 0,
        totalCredits: 4,
        contactHoursPerWeek: 5,
        totalSemesterHours: 60,
        ectsEquivalence: 6.0,
      },
      courseOutcomes: [
        {
          id: `co-new-1`,
          code: 'CO1',
          statement: 'Explain cloud service models, hypervisor architectures, and software-defined networking fundamentals.',
          bloomsLevel: 'L2',
          targetAttainment: 70,
          assessmentMethods: ['CIE 1 Written Exam'],
        },
        {
          id: `co-new-2`,
          code: 'CO2',
          statement: 'Apply Kubernetes container orchestration and Terraform declarative infrastructure to deploy microservices.',
          bloomsLevel: 'L3',
          targetAttainment: 65,
          assessmentMethods: ['Laboratory Coding Test'],
        },
        {
          id: `co-new-3`,
          code: 'CO3',
          statement: 'Analyze distributed consensus protocols (Raft, Paxos) and CAP theorem tradeoffs under network partitions.',
          bloomsLevel: 'L4',
          targetAttainment: 65,
          assessmentMethods: ['CIE 2 Written Exam'],
        },
        {
          id: `co-new-4`,
          code: 'CO4',
          statement: 'Design fault-tolerant multi-region cloud applications adhering to Zero-Trust architecture.',
          bloomsLevel: 'L6',
          targetAttainment: 60,
          assessmentMethods: ['Capstone Cloud Project'],
        },
      ],
      copoMatrix: {},
      copoJustifications: {},
      syllabus: [
        {
          id: 'u-1',
          unitNumber: 1,
          title: 'Cloud Paradigms & Virtualization Technologies',
          contactHours: 15,
          mappedCOs: ['CO1'],
          topics: 'NIST cloud framework; Type-1 and Type-2 hypervisors; Containerization versus VMs; Docker daemon architecture; Namespace and cgroup isolation.',
          pedagogicalMethod: 'Lecture and hands-on lab demonstration.',
        },
        {
          id: 'u-2',
          unitNumber: 2,
          title: 'Distributed Storage & Consensus Protocols',
          contactHours: 15,
          mappedCOs: ['CO2', 'CO3'],
          topics: 'Distributed file systems (HDFS, Ceph); Object storage (S3); CAP and PACELC theorems; Raft consensus state machine; Distributed caching with Redis.',
          pedagogicalMethod: 'Interactive simulation of partition failures.',
        },
        {
          id: 'u-3',
          unitNumber: 3,
          title: 'Container Orchestration & Microservices',
          contactHours: 15,
          mappedCOs: ['CO2'],
          topics: 'Kubernetes Pods, Deployments, ReplicaSets; Ingress controllers; Service mesh (Istio) routing; Circuit breakers and rate limiters.',
          pedagogicalMethod: 'Mini-sprint deploying a 3-tier microservice.',
        },
        {
          id: 'u-4',
          unitNumber: 4,
          title: 'Serverless & High-Availability Cloud Design',
          contactHours: 15,
          mappedCOs: ['CO4'],
          topics: 'Function-as-a-Service (FaaS) event lifecycles; CloudWatch monitoring and distributed tracing; Disaster recovery strategies; Zero-Trust security IAM.',
          pedagogicalMethod: 'Industry case study in financial fintech resilience.',
        },
      ],
      assessments: [
        {
          id: 'a-1',
          name: 'Continuous Internal Evaluation 1',
          type: 'CIE',
          weightage: 25,
          maxMarks: 50,
          mappedCOs: ['CO1', 'CO2'],
        },
        {
          id: 'a-2',
          name: 'Continuous Internal Evaluation 2',
          type: 'CIE',
          weightage: 25,
          maxMarks: 50,
          mappedCOs: ['CO3'],
        },
        {
          id: 'a-3',
          name: 'Semester End Examination (SEE)',
          type: 'SEE',
          weightage: 50,
          maxMarks: 100,
          mappedCOs: ['CO1', 'CO2', 'CO3', 'CO4'],
        },
      ],
      textbooks: [
        {
          title: 'Cloud Computing: Concepts, Technology & Architecture',
          author: 'Thomas Erl, Ricardo Puttini, Zaigham Mahmood',
          publisher: 'Prentice Hall',
          editionYear: '2023',
        },
      ],
      referenceMaterials: [],
      status: 'draft',
      version: '1.0.0',
      lastModified: new Date().toISOString().split('T')[0],
      author: 'Faculty Coordinator (CSE)',
    };

    // Initialize blank matrix
    newCourse.courseOutcomes.forEach((co) => {
      newCourse.copoMatrix[co.id] = {};
      annexureA.programOutcomes.forEach((po) => {
        newCourse.copoMatrix[co.id][po.code] = 2;
      });
      annexureA.programSpecificOutcomes.forEach((pso) => {
        newCourse.copoMatrix[co.id][pso.code] = 2;
      });
    });

    const nextCourses = [...courses, newCourse];
    setCourses(nextCourses);
    saveCourses(nextCourses);
    setActiveId(newCourse.id);
    setActiveCourseId(newCourse.id);
  };

  // Run Real-time Accreditation Validation
  const validationIssues: ValidationIssue[] = activeCourse
    ? validateCourse(activeCourse, annexureA)
    : [];

  const hotsCount = activeCourse
    ? activeCourse.courseOutcomes.filter((co) =>
        ['L3', 'L4', 'L5', 'L6'].includes(co.bloomsLevel)
      ).length
    : 0;
  const hotsPercentage =
    activeCourse && activeCourse.courseOutcomes.length > 0
      ? Math.round((hotsCount / activeCourse.courseOutcomes.length) * 100)
      : 0;

  const totalWeightage = activeCourse
    ? activeCourse.assessments.reduce((acc, curr) => acc + (curr.weightage || 0), 0)
    : 0;

  const handleRoleAction = () => {
    if (!activeCourse) return;
    if (role === 'faculty') {
      const updated: CourseSpecification = {
        ...activeCourse,
        status: 'under_review',
        lastModified: new Date().toISOString().split('T')[0],
      };
      handleUpdateActiveCourse(updated);
      setStatusNotification('Course specification submitted to Department Chair (HOD) for review.');
      setTimeout(() => setStatusNotification(null), 3500);
    } else if (role === 'hod') {
      const updated: CourseSpecification = {
        ...activeCourse,
        status: 'approved',
        lastModified: new Date().toISOString().split('T')[0],
      };
      handleUpdateActiveCourse(updated);
      setStatusNotification('Course specification approved and signed off by Department Chair.');
      setTimeout(() => setStatusNotification(null), 3500);
    }
  };

  const handleOpenReference = (tab: 'po' | 'pso' | 'blooms') => {
    setReferenceTab(tab);
    setIsReferenceOpen(true);
  };

  if (!activeCourse) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center text-slate-600">
        Loading CurriculaPro Academic Precision...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col text-slate-800 antialiased">
      {/* Top Authoritative Institutional Header */}
      <header className="bg-[#1E3A5F] text-white border-b border-[#022448] shrink-0 sticky top-0 z-30">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center text-[#80F3DD] border border-white/10">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-base tracking-tight text-white">
                  CurriculaPro
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-slate-200">
                  OBE Precision
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Course Specification & Accreditation Management
              </p>
            </div>
          </div>

          {/* Active Course Selector & Course Status Badge */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-300 pl-2">
                Course:
              </span>
              <select
                value={activeCourse.id}
                onChange={(e) => {
                  setActiveId(e.target.value);
                  setActiveCourseId(e.target.value);
                }}
                className="bg-transparent text-white font-mono font-bold text-xs pr-6 py-1 focus:outline-none cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white font-mono">
                    {c.courseCode}: {c.courseTitle.slice(0, 32)}...
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleCreateCourse}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-white/10 transition-colors"
                title="Create New Course Specification"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Status Semantic Badge - strictly adhering to Design System */}
            <span
              className={`academic-badge text-[10px] ${
                activeCourse.status === 'approved'
                  ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                  : activeCourse.status === 'under_review'
                  ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]'
                  : activeCourse.status === 'revision_requested'
                  ? 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'
                  : 'bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              {activeCourse.status === 'approved'
                ? 'Board Approved'
                : activeCourse.status === 'under_review'
                ? 'Under Review (HOD)'
                : activeCourse.status === 'revision_requested'
                ? 'Revisions Required'
                : 'Drafting Phase'}
            </span>
          </div>

          {/* Institutional Role Switcher & Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded border border-white/10">
              <UserCheck className="w-3.5 h-3.5 text-[#80F3DD]" />
              <span className="text-[10px] uppercase font-bold text-slate-300">
                Role:
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="bg-transparent text-white font-semibold text-xs py-0.5 focus:outline-none cursor-pointer"
              >
                <option value="faculty" className="bg-slate-900 text-white">Faculty Author</option>
                <option value="hod" className="bg-slate-900 text-white">Department Chair (HOD)</option>
                <option value="reviewer" className="bg-slate-900 text-white">Accreditation Reviewer</option>
              </select>
            </div>

            {/* Annexure A Drawer Trigger */}
            <button
              type="button"
              onClick={() => handleOpenReference('po')}
              className="academic-btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs h-8 px-2.5"
              title="Annexure A: Program Outcomes & Bloom's Taxonomy Reference"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#80F3DD]" />
              <span className="hidden md:inline">Annexure A</span>
            </button>

            {/* AI Settings Trigger */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="academic-btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs h-8 px-2.5"
              title="AI Curriculum Synthesis Settings"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden lg:inline">AI Settings</span>
            </button>

            {/* Export Dossier Trigger */}
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="academic-btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs h-8 px-2.5"
              title="Export Course Specification Dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export Dossier</span>
            </button>

            {/* Primary Workflow Trigger */}
            {role === 'faculty' && activeCourse.status !== 'approved' && (
              <button
                type="button"
                onClick={handleRoleAction}
                className="academic-btn-primary bg-[#0F9D8A] hover:bg-[#006F61] text-xs h-8 px-3"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            )}

            {role === 'hod' && activeCourse.status !== 'approved' && (
              <button
                type="button"
                onClick={handleRoleAction}
                className="academic-btn-primary bg-emerald-700 hover:bg-emerald-800 text-xs h-8 px-3"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Sign Off & Approve</span>
              </button>
            )}

            {/* Rail Toggle */}
            <button
              type="button"
              onClick={() => setIsRailOpen(!isRailOpen)}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title={isRailOpen ? 'Collapse Compliance Rail' : 'Expand Compliance Rail'}
            >
              {isRailOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Global Notification Toast */}
        {statusNotification && (
          <div className="bg-[#0F9D8A] text-white text-xs py-1.5 px-6 text-center font-semibold animate-in slide-in-from-top duration-200">
            {statusNotification}
          </div>
        )}
      </header>

      {/* Screen Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#1E3A5F] text-[#1E3A5F] bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            1. Overview & Credits
          </button>

          <button
            onClick={() => setActiveTab('outcomes')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'outcomes'
                ? 'border-[#1E3A5F] text-[#1E3A5F] bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            2. Course Learning Outcomes (COs)
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
              {activeCourse.courseOutcomes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'border-[#1E3A5F] text-[#1E3A5F] bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            3. CO-PO Alignment Matrix
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'syllabus'
                ? 'border-[#1E3A5F] text-[#1E3A5F] bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            4. Modular Curriculum
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
              {activeCourse.syllabus.length} Units
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assessments')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'assessments'
                ? 'border-[#1E3A5F] text-[#1E3A5F] bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            5. Assessment & Evaluation
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                totalWeightage === 100
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {totalWeightage}%
            </span>
          </button>
        </div>
      </nav>

      {/* Main Multi-Pane Workspace Layout */}
      <div className="flex-1 flex overflow-hidden max-w-[1720px] w-full mx-auto">
        {/* Left / Center Authoring Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Screen 1: Course Overview */}
            {activeTab === 'overview' && (
              <CourseOverviewScreen
                course={activeCourse}
                role={role}
                onChange={handleUpdateActiveCourse}
              />
            )}

            {/* Screen 2: Course Outcomes */}
            {activeTab === 'outcomes' && (
              <OutcomesScreen
                course={activeCourse}
                role={role}
                onChange={handleUpdateActiveCourse}
                onOpenReference={handleOpenReference}
              />
            )}

            {/* Screen 3: CO-PO Matrix */}
            {activeTab === 'matrix' && (
              <MatrixScreen
                course={activeCourse}
                role={role}
                onChange={handleUpdateActiveCourse}
                onOpenReference={handleOpenReference}
              />
            )}

            {/* Screen 4: Syllabus */}
            {activeTab === 'syllabus' && (
              <SyllabusScreen
                course={activeCourse}
                role={role}
                onChange={handleUpdateActiveCourse}
              />
            )}

            {/* Screen 5: Assessments */}
            {activeTab === 'assessments' && (
              <AssessmentScreen
                course={activeCourse}
                role={role}
                onChange={handleUpdateActiveCourse}
              />
            )}
          </div>
        </main>

        {/* Right Accreditation Validation & Compliance Rail (Persistent in 3-column view) */}
        {isRailOpen && (
          <aside className="hidden xl:block">
            <ValidationRail
              issues={validationIssues}
              hotsPercentage={hotsPercentage}
              totalWeightage={totalWeightage}
              onNavigateSection={(section) => setActiveTab(section)}
            />
          </aside>
        )}
      </div>

      {/* Modal Dialogs & Drawers */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ReferenceDrawer
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
        initialTab={referenceTab}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        course={activeCourse}
      />
    </div>
  );
}
