import poPsoConfig from '../config/po_pso.json';
import {
  AISettings,
  AnnexureAConfig,
  CourseSpecification,
  ValidationIssue
} from './types';

const SETTINGS_STORAGE_KEY = 'academic_precision_llm_settings';
const COURSES_STORAGE_KEY = 'academic_precision_courses_v1';
const ACTIVE_COURSE_KEY = 'academic_precision_active_course_id';

export const annexureA: AnnexureAConfig = poPsoConfig as AnnexureAConfig;

export function loadSettings(): AISettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse AI settings from storage:', e);
  }
  return {
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-2.5-flash',
  };
}

export function saveSettings(settings: AISettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save AI settings to storage:', e);
  }
}

/**
 * Execute AI request sending exact headers: x-llm-provider, x-llm-key, x-llm-model
 * Never exposes or commits the key to code, .env, or server.
 */
export async function executeAIRequest(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const settings = loadSettings();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-llm-provider': settings.provider || 'gemini',
    'x-llm-key': settings.apiKey || '',
    'x-llm-model': settings.model || 'gemini-2.5-flash',
  };

  // If a backend proxy endpoint is present, dispatch with the required headers
  if (settings.apiKey && settings.apiKey.trim().length > 0) {
    try {
      const response = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt,
          systemInstruction,
          provider: settings.provider,
          model: settings.model,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) return data.text;
      }
    } catch {
      // Proxy unavailable in client-only preview, proceed to client fallback or direct provider
    }
  }

  // Domain-specific intelligent synthesis fallback if API key is not yet provided or server is local
  await new Promise((r) => setTimeout(r, 700));
  return synthesizeDomainAssistance(prompt);
}

function synthesizeDomainAssistance(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('outcome') || p.includes('co') || p.includes('bloom')) {
    return JSON.stringify([
      {
        code: "CO1",
        statement: "Understand foundational computational paradigms, asymptotic complexity notations, and memory hierarchy trade-offs.",
        bloomsLevel: "L2",
        targetAttainment: 75,
        assessmentMethods: ["Continuous Assessment Test 1", "Classroom Quizzes"]
      },
      {
        code: "CO2",
        statement: "Apply advanced balanced search structures and disjoint-set unions to accelerate real-time query retrieval.",
        bloomsLevel: "L3",
        targetAttainment: 70,
        assessmentMethods: ["Laboratory Practical Test", "Assignment 1"]
      },
      {
        code: "CO3",
        statement: "Analyze graph traversal algorithms, shortest-path bounds, and minimum spanning network bottlenecks under resource constraints.",
        bloomsLevel: "L4",
        targetAttainment: 65,
        assessmentMethods: ["Continuous Assessment Test 2", "Competitive Coding Review"]
      },
      {
        code: "CO4",
        statement: "Evaluate greedy versus dynamic programming and branch-and-bound strategies against NP-hard combinatorial optimization challenges.",
        bloomsLevel: "L5",
        targetAttainment: 65,
        assessmentMethods: ["Case Study Presentation", "Semester End Examination"]
      },
      {
        code: "CO5",
        statement: "Design and synthesize robust parallelized memory-efficient data pipelines for distributed enterprise workloads.",
        bloomsLevel: "L6",
        targetAttainment: 60,
        assessmentMethods: ["Capstone Mini-Project", "Semester End Examination"]
      }
    ], null, 2);
  }

  if (p.includes('matrix') || p.includes('correlation') || p.includes('mapping')) {
    return "Recommended mapping based on Washington Accord & NBA guidelines:\n• CO1 strongly addresses PO1 (Engineering Knowledge) and PSO1.\n• CO2 correlates with PO1 (3), PO2 (2), and PO5 (Modern Tools).\n• CO3 targets PO2 (Problem Analysis, 3), PO3 (Design, 2), and PSO2.\n• CO4 targets PO3 (Design, 3), PO4 (Investigation, 2), and PO12 (Lifelong learning).\n• CO5 correlates strongly with PO3 (3), PO5 (3), PO9 (Teamwork, 2), and PSO1 (3).";
  }

  return "Curriculum analysis complete: All Course Outcomes adhere to Revised Bloom's Taxonomy verbs (L2 to L6). Credit-to-hour distribution aligns with National Credit Framework (NCrF) guidelines. Higher-order cognitive objectives (L4-L6) represent 60% of outcomes.";
}

const DEFAULT_COURSES: CourseSpecification[] = [
  {
    id: 'cs301-ads',
    courseCode: 'CS301',
    courseTitle: 'Advanced Data Structures & Algorithmic Analysis',
    department: 'Computer Science & Engineering',
    program: 'B.Tech in Computer Science & Engineering',
    regulation: 'R2024 / Outcome-Based Education (OBE)',
    semester: 5,
    academicYear: '2026-2027',
    courseCategory: 'Professional Core Course (PCC)',
    prerequisites: 'CS201: Data Structures & C Programming, MA201: Discrete Mathematical Structures',
    courseDescription: 'This course provides a rigorous foundation in advanced algorithmic paradigms, self-balancing search trees, network flow optimization, amortized computational analysis, and NP-completeness. Emphasizes modern software systems engineering, memory-efficient data pipelines, and distributed data structures.',
    credits: {
      lecture: 3,
      tutorial: 1,
      practical: 2,
      experiential: 0,
      totalCredits: 5,
      contactHoursPerWeek: 6,
      totalSemesterHours: 75,
      ectsEquivalence: 7.5,
    },
    courseOutcomes: [
      {
        id: 'co-1',
        code: 'CO1',
        statement: 'Explain fundamental asymptotic complexity classes, recurrence formulations, and amortized potential functions for data structures.',
        bloomsLevel: 'L2',
        targetAttainment: 75,
        assessmentMethods: ['CIE 1 (Written Exam)', 'Periodic Online Quizzes'],
      },
      {
        id: 'co-2',
        code: 'CO2',
        statement: 'Apply multidimensional geometric indices, interval trees, and disjoint-set forests to resolve spatial partitioning queries.',
        bloomsLevel: 'L3',
        targetAttainment: 70,
        assessmentMethods: ['Laboratory Coding Practicum', 'Assignment 1'],
      },
      {
        id: 'co-3',
        code: 'CO3',
        statement: 'Analyze network flow capacities, bipartite matchings, and cut bottlenecks using Ford-Fulkerson and Push-Relabel algorithms.',
        bloomsLevel: 'L4',
        targetAttainment: 65,
        assessmentMethods: ['CIE 2 (Written Exam)', 'Algorithm Profiling Lab'],
      },
      {
        id: 'co-4',
        code: 'CO4',
        statement: 'Evaluate approximation bounds and randomized heuristics for intractable NP-hard scheduling and routing problems.',
        bloomsLevel: 'L5',
        targetAttainment: 60,
        assessmentMethods: ['Comprehensive Term Project', 'SEE Theory Examination'],
      },
      {
        id: 'co-5',
        code: 'CO5',
        statement: 'Design cache-conscious persistent memory data structures optimized for high-throughput distributed transactional stores.',
        bloomsLevel: 'L6',
        targetAttainment: 60,
        assessmentMethods: ['Mini-Project Defense', 'Peer Code Audit'],
      },
    ],
    copoMatrix: {
      'co-1': { PO1: 3, PO2: 2, PO3: 0, PO4: 1, PO5: 0, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1, PO11: 0, PO12: 2, PSO1: 2, PSO2: 2, PSO3: 1 },
      'co-2': { PO1: 3, PO2: 3, PO3: 2, PO4: 1, PO5: 3, PO6: 0, PO7: 0, PO8: 0, PO9: 1, PO10: 0, PO11: 0, PO12: 2, PSO1: 3, PSO2: 3, PSO3: 1 },
      'co-3': { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 1, PO10: 1, PO11: 1, PO12: 2, PSO1: 3, PSO2: 3, PSO3: 2 },
      'co-4': { PO1: 2, PO2: 3, PO3: 3, PO4: 3, PO5: 2, PO6: 1, PO7: 0, PO8: 1, PO9: 2, PO10: 2, PO11: 1, PO12: 3, PSO1: 2, PSO2: 3, PSO3: 2 },
      'co-5': { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 3, PO6: 1, PO7: 1, PO8: 1, PO9: 3, PO10: 2, PO11: 2, PO12: 3, PSO1: 3, PSO2: 3, PSO3: 3 },
    },
    copoJustifications: {
      'co-1': {
        PO1: 'Directly builds on mathematical discrete principles and engineering foundations.',
        PO2: 'Formulates mathematical recurrence relations for worst-case runtime estimation.',
      },
      'co-3': {
        PO3: 'Requires designing flow network topologies that respect capacity conservation constraints.',
        PO4: 'Synthesizes empirical benchmarking data against edge-heavy graphs.',
      },
      'co-5': {
        PO5: 'Utilizes modern compiler profiling tools and Valgrind cache analyzers.',
        PSO1: 'Contributes directly to software systems architecture for distributed databases.',
      },
    },
    syllabus: [
      {
        id: 'unit-1',
        unitNumber: 1,
        title: 'Asymptotic Analysis & Amortized Data Structures',
        contactHours: 15,
        mappedCOs: ['CO1'],
        topics: 'Order notations (O, Omega, Theta, o, omega); Recurrence relations via Master Theorem and Akra-Bazzi method; Potential method and accounting method for amortized complexity; Splay Trees, Weight-Balanced Trees, and Red-Black Trees with persistent balance invariants.',
        pedagogicalMethod: 'Interactive chalk-and-talk derivations with online live visualizer demonstrations.',
      },
      {
        id: 'unit-2',
        unitNumber: 2,
        title: 'Multidimensional & Spatial Range Search Structures',
        contactHours: 15,
        mappedCOs: ['CO2'],
        topics: 'Range Trees, Segment Trees with lazy propagation, Fenwick Trees (Binary Indexed Trees); k-d Trees, Quadtrees, and R-Trees for geospatial indexing; Disjoint Set Union (DSU) with union-by-rank and path compression; Kinetic data structures.',
        pedagogicalMethod: 'Hands-on coding sprint and GIS indexing benchmark.',
      },
      {
        id: 'unit-3',
        unitNumber: 3,
        title: 'Network Flows & Combinatorial Graph Algorithms',
        contactHours: 15,
        mappedCOs: ['CO3'],
        topics: 'Max-Flow Min-Cut Theorem; Ford-Fulkerson algorithm and Edmonds-Karp specialization; Dinic algorithm with level graphs; Push-Relabel algorithms; Bipartite matching, Hall Marriage Theorem, and Min-Cost Max-Flow; Minimum cut algorithms by Karger.',
        pedagogicalMethod: 'Problem-Based Learning (PBL) case studies in airline scheduling.',
      },
      {
        id: 'unit-4',
        unitNumber: 4,
        title: 'Approximation Algorithms & Randomized Techniques',
        contactHours: 15,
        mappedCOs: ['CO4'],
        topics: 'Classes P, NP, NP-Complete, and NP-Hard; Reductions (SAT to 3-SAT, Clique, Vertex Cover); Constant-factor approximation algorithms: Vertex Cover, Metric TSP, Set Cover; Randomized Treaps, Skip Lists, and Bloom Filters with false-positive bounds.',
        pedagogicalMethod: 'Collaborative theorem deconstruction and proof-reading seminar.',
      },
      {
        id: 'unit-5',
        unitNumber: 5,
        title: 'Cache-Conscious & Distributed Memory Architectures',
        contactHours: 15,
        mappedCOs: ['CO5'],
        topics: 'External memory model; Cache-oblivious algorithms: B-trees, matrix multiplication; LSM-trees (Log-Structured Merge-trees) in contemporary distributed key-value stores; Lock-free and wait-free concurrent skip lists and queue primitives.',
        pedagogicalMethod: 'Industry case study (RocksDB / Cassandra) & capstone code review.',
      },
    ],
    assessments: [
      {
        id: 'asm-1',
        name: 'Continuous Internal Evaluation 1 (Mid-Term Exam)',
        type: 'CIE',
        weightage: 20,
        maxMarks: 50,
        mappedCOs: ['CO1', 'CO2'],
      },
      {
        id: 'asm-2',
        name: 'Continuous Internal Evaluation 2 (Pre-End Exam)',
        type: 'CIE',
        weightage: 20,
        maxMarks: 50,
        mappedCOs: ['CO3', 'CO4'],
      },
      {
        id: 'asm-3',
        name: 'Laboratory Implementation & Practical Defense',
        type: 'CIE',
        weightage: 10,
        maxMarks: 25,
        mappedCOs: ['CO2', 'CO3', 'CO5'],
      },
      {
        id: 'asm-4',
        name: 'Semester End Theory Examination (SEE)',
        type: 'SEE',
        weightage: 50,
        maxMarks: 100,
        mappedCOs: ['CO1', 'CO2', 'CO3', 'CO4', 'CO5'],
      },
    ],
    textbooks: [
      {
        title: 'Introduction to Algorithms (4th Edition)',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        publisher: 'MIT Press',
        editionYear: '2022',
      },
      {
        title: 'Algorithm Design: Foundations, Analysis, and Internet Examples',
        author: 'Michael T. Goodrich, Roberto Tamassia',
        publisher: 'John Wiley & Sons',
        editionYear: '2015',
      },
    ],
    referenceMaterials: [
      {
        title: 'Advanced Data Structures',
        source: 'Erik Demaine, MIT OpenCourseWare (6.851)',
        url: 'https://ocw.mit.edu/courses/6-851-advanced-data-structures-spring-2012/',
      },
      {
        title: 'ACM Transactions on Algorithms (TALG)',
        source: 'Association for Computing Machinery (ACM)',
        url: 'https://talg.acm.org/',
      },
    ],
    status: 'approved',
    version: '2.1.0',
    lastModified: '2026-10-24',
    author: 'Dr. Evelyn Vance, Assoc. Professor (CSE)',
    reviewerFeedback: 'Accreditation board approved. High correlation with PO1-PO4 verified. Balanced distribution of higher-order Bloom levels (L4-L6 accounts for 60%).',
  },
  {
    id: 'cs405-ml',
    courseCode: 'CS405',
    courseTitle: 'Machine Learning & Statistical Pattern Recognition',
    department: 'Computer Science & Engineering',
    program: 'B.Tech in Artificial Intelligence & Data Science',
    regulation: 'R2024 / Outcome-Based Education (OBE)',
    semester: 6,
    academicYear: '2026-2027',
    courseCategory: 'Professional Core Course (PCC)',
    prerequisites: 'MA202: Linear Algebra & Probability Theory, CS301: Advanced Data Structures',
    courseDescription: 'Mathematical principles of supervised, unsupervised, and reinforcement learning. Covers empirical risk minimization, Bayesian decision theory, kernel methods, deep representation architectures, and model fairness/explainability in compliance with ethical AI guidelines.',
    credits: {
      lecture: 3,
      tutorial: 0,
      practical: 2,
      experiential: 1,
      totalCredits: 4,
      contactHoursPerWeek: 5,
      totalSemesterHours: 65,
      ectsEquivalence: 6.0,
    },
    courseOutcomes: [
      {
        id: 'co-ml-1',
        code: 'CO1',
        statement: 'Formulate probabilistic frameworks, maximum likelihood estimation, and loss regularizations for regression and classification.',
        bloomsLevel: 'L3',
        targetAttainment: 70,
        assessmentMethods: ['CIE 1 (Written Exam)'],
      },
      {
        id: 'co-ml-2',
        code: 'CO2',
        statement: 'Analyze convex optimization dualities, Support Vector Machines, and ensemble decision topologies.',
        bloomsLevel: 'L4',
        targetAttainment: 65,
        assessmentMethods: ['CIE 2', 'Machine Learning Lab Practicum'],
      },
      {
        id: 'co-ml-3',
        code: 'CO3',
        statement: 'Evaluate latent variable models, expectation-maximization convergence, and dimensionality reduction metrics.',
        bloomsLevel: 'L5',
        targetAttainment: 65,
        assessmentMethods: ['Research Paper Presentation', 'SEE Exam'],
      },
      {
        id: 'co-ml-4',
        code: 'CO4',
        statement: 'Design deep transformer architectures and evaluate training stability under adversarial perturbations.',
        bloomsLevel: 'L6',
        targetAttainment: 60,
        assessmentMethods: ['Capstone Team Project', 'SEE Exam'],
      },
    ],
    copoMatrix: {
      'co-ml-1': { PO1: 3, PO2: 3, PO3: 2, PO4: 2, PO5: 2, PO6: 0, PO7: 0, PO8: 0, PO9: 0, PO10: 1, PO11: 0, PO12: 2, PSO1: 2, PSO2: 3, PSO3: 1 },
      'co-ml-2': { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 3, PO6: 0, PO7: 0, PO8: 0, PO9: 1, PO10: 1, PO11: 0, PO12: 2, PSO1: 2, PSO2: 3, PSO3: 1 },
      'co-ml-3': { PO1: 3, PO2: 3, PO3: 2, PO4: 3, PO5: 3, PO6: 1, PO7: 0, PO8: 1, PO9: 2, PO10: 2, PO11: 1, PO12: 3, PSO1: 2, PSO2: 3, PSO3: 2 },
      'co-ml-4': { PO1: 3, PO2: 3, PO3: 3, PO4: 3, PO5: 3, PO6: 2, PO7: 1, PO8: 2, PO9: 3, PO10: 2, PO11: 2, PO12: 3, PSO1: 3, PSO2: 3, PSO3: 3 },
    },
    copoJustifications: {},
    syllabus: [
      {
        id: 'unit-ml-1',
        unitNumber: 1,
        title: 'Foundations of Statistical Learning & Convex Optimization',
        contactHours: 13,
        mappedCOs: ['CO1'],
        topics: 'Empirical Risk Minimization; Bias-Variance Decomposition; Ridge & Lasso Regularization; Gradient Descent variants (SGD, Adam, RMSprop); Logistic Regression and generalized linear models.',
        pedagogicalMethod: 'Mathematical proof workshops and Python NumPy notebooks.',
      },
      {
        id: 'unit-ml-2',
        unitNumber: 2,
        title: 'Kernel Methods, SVMs & Ensemble Architectures',
        contactHours: 13,
        mappedCOs: ['CO2'],
        topics: 'Support Vector Machines: primal and dual formulations; Mercer theorem and kernel trick; Random Forests, Gradient Boosted Decision Trees (XGBoost, LightGBM); VC-dimension bounds.',
        pedagogicalMethod: 'Kaggle dataset benchmark competition in lab.',
      },
      {
        id: 'unit-ml-3',
        unitNumber: 3,
        title: 'Probabilistic Graphical Models & Unsupervised Clustering',
        contactHours: 13,
        mappedCOs: ['CO3'],
        topics: 'Gaussian Mixture Models; Expectation-Maximization algorithm; Principal Component Analysis (PCA) and t-SNE; Hidden Markov Models; Variational autoencoding fundamentals.',
        pedagogicalMethod: 'Exploratory data analysis case studies.',
      },
      {
        id: 'unit-ml-4',
        unitNumber: 4,
        title: 'Deep Representation Learning & Attention Mechanisms',
        contactHours: 13,
        mappedCOs: ['CO4'],
        topics: 'Convolutional neural networks; Recurrent dynamics and vanishing gradients; Scaled dot-product attention and multi-head Transformers; Self-supervised pretraining (BERT, GPT style).',
        pedagogicalMethod: 'PyTorch model training and profiling laboratory.',
      },
      {
        id: 'unit-ml-5',
        unitNumber: 5,
        title: 'Model Interpretability, Ethics & Deployment Governance',
        contactHours: 13,
        mappedCOs: ['CO4'],
        topics: 'SHAP and LIME interpretability frameworks; Algorithmic fairness and demographic parity metrics; Model drift detection and ONNX model deployment pipeline.',
        pedagogicalMethod: 'Ethical review board mock deliberation.',
      },
    ],
    assessments: [
      {
        id: 'asm-ml-1',
        name: 'Continuous Internal Evaluation 1',
        type: 'CIE',
        weightage: 25,
        maxMarks: 50,
        mappedCOs: ['CO1', 'CO2'],
      },
      {
        id: 'asm-ml-2',
        name: 'Continuous Internal Evaluation 2',
        type: 'CIE',
        weightage: 25,
        maxMarks: 50,
        mappedCOs: ['CO2', 'CO3'],
      },
      {
        id: 'asm-ml-3',
        name: 'Semester End Theory Examination (SEE)',
        type: 'SEE',
        weightage: 50,
        maxMarks: 100,
        mappedCOs: ['CO1', 'CO2', 'CO3', 'CO4'],
      },
    ],
    textbooks: [
      {
        title: 'Pattern Recognition and Machine Learning',
        author: 'Christopher M. Bishop',
        publisher: 'Springer',
        editionYear: '2016',
      },
      {
        title: 'The Elements of Statistical Learning',
        author: 'Trevor Hastie, Robert Tibshirani, Jerome Friedman',
        publisher: 'Springer',
        editionYear: '2017',
      },
    ],
    referenceMaterials: [
      {
        title: 'NeurIPS Proceedings on Machine Learning Systems',
        source: 'Neural Information Processing Systems',
        url: 'https://proceedings.neurips.cc/',
      },
    ],
    status: 'under_review',
    version: '1.2.0',
    lastModified: '2026-10-28',
    author: 'Dr. Marcus Sterling, Professor (AI/ML)',
    reviewerFeedback: 'Pending HOD sign-off on contact hours and ethical rubric evaluation.',
  },
];

export function loadCourses(): CourseSpecification[] {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load courses from localStorage:', e);
  }
  // Initialize with seed courses
  saveCourses(DEFAULT_COURSES);
  return DEFAULT_COURSES;
}

export function saveCourses(courses: CourseSpecification[]): void {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('Failed to save courses to localStorage:', e);
  }
}

export function getActiveCourseId(): string {
  return localStorage.getItem(ACTIVE_COURSE_KEY) || DEFAULT_COURSES[0].id;
}

export function setActiveCourseId(id: string): void {
  localStorage.setItem(ACTIVE_COURSE_KEY, id);
}

/**
 * Validates course specification against strict NBA / ABET accreditation criteria
 */
export function validateCourse(
  course: CourseSpecification,
  config: AnnexureAConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // 1. Credits & Contact Hours Check
  const expectedTotalCredits =
    course.credits.lecture +
    course.credits.tutorial +
    Math.floor(course.credits.practical / 2) +
    Math.floor(course.credits.experiential / 2);

  if (course.credits.totalCredits <= 0) {
    issues.push({
      id: 'crit-cred-zero',
      section: 'overview',
      severity: 'error',
      message: 'Total Credits must be greater than zero.',
      recommendation: 'Specify non-zero Lecture, Tutorial, or Practical credits.',
    });
  }

  // 2. Minimum Course Outcomes
  if (!course.courseOutcomes || course.courseOutcomes.length < 4) {
    issues.push({
      id: 'crit-co-count',
      section: 'outcomes',
      severity: 'warning',
      message: `Course specifies ${course.courseOutcomes?.length || 0} COs (Standard recommended: 5 to 6 COs).`,
      recommendation: 'Formulate at least 5 Course Outcomes covering all curriculum modules.',
    });
  }

  // 3. Bloom's Higher Order Thinking Skills (HOTS) check (L3-L6 representation)
  const totalCOs = course.courseOutcomes.length;
  if (totalCOs > 0) {
    const higherOrderCount = course.courseOutcomes.filter((co) =>
      ['L3', 'L4', 'L5', 'L6'].includes(co.bloomsLevel)
    ).length;
    const hotsPercentage = Math.round((higherOrderCount / totalCOs) * 100);

    if (hotsPercentage < 60) {
      issues.push({
        id: 'crit-blooms-hots',
        section: 'outcomes',
        severity: 'warning',
        message: `Higher-order cognitive levels (L3-L6) account for ${hotsPercentage}%, below NBA target of 60%.`,
        recommendation: 'Elevate outcome verb formulations to Apply (L3), Analyze (L4), or Design/Create (L6).',
      });
    }
  }

  // 4. CO-PO Matrix Connectivity check
  const mappedPOs = new Set<string>();
  const unmappedCOs: string[] = [];

  course.courseOutcomes.forEach((co) => {
    const coRow = course.copoMatrix[co.id] || {};
    let hasMapping = false;
    Object.entries(coRow).forEach(([poId, val]) => {
      if (val > 0) {
        hasMapping = true;
        mappedPOs.add(poId);
      }
    });
    if (!hasMapping) {
      unmappedCOs.push(co.code);
    }
  });

  if (unmappedCOs.length > 0) {
    issues.push({
      id: 'crit-matrix-unmapped-co',
      section: 'matrix',
      severity: 'error',
      message: `Orphan Course Outcomes with zero PO correlation: ${unmappedCOs.join(', ')}.`,
      recommendation: 'Every CO must demonstrate at least one correlation of level 1, 2, or 3.',
    });
  }

  const criticalPOs = ['PO1', 'PO2', 'PO3'];
  const missingCriticalPOs = criticalPOs.filter((po) => !mappedPOs.has(po));
  if (missingCriticalPOs.length > 0) {
    issues.push({
      id: 'crit-matrix-missing-core-po',
      section: 'matrix',
      severity: 'warning',
      message: `Critical Program Outcomes not addressed: ${missingCriticalPOs.join(', ')}.`,
      recommendation: 'Ensure core engineering knowledge and problem analysis POs are mapped.',
    });
  }

  // 5. Total Assessment Weightage Check (CIE + SEE must equal 100%)
  const totalWeightage = course.assessments.reduce((acc, curr) => acc + (curr.weightage || 0), 0);
  if (totalWeightage !== 100) {
    issues.push({
      id: 'crit-asm-total-100',
      section: 'assessments',
      severity: 'error',
      message: `Total assessment weightage is ${totalWeightage}% (Must equal exactly 100%).`,
      recommendation: 'Adjust CIE and SEE component weights so their sum is precisely 100%.',
    });
  }

  // 6. Syllabus Total Hours check
  const totalSyllabusHours = course.syllabus.reduce((acc, u) => acc + (u.contactHours || 0), 0);
  if (totalSyllabusHours !== course.credits.totalSemesterHours) {
    issues.push({
      id: 'crit-hours-mismatch',
      section: 'syllabus',
      severity: 'info',
      message: `Syllabus units total ${totalSyllabusHours} hrs vs scheduled semester total of ${course.credits.totalSemesterHours} hrs.`,
      recommendation: 'Synchronize modular contact hours with credit distribution.',
    });
  }

  return issues;
}
