export type QuestionType = 'single' | 'multiple' | 'text' | 'confirm';

export interface QuestionOption {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  visual?: 'minimal' | 'saas' | 'fun' | 'corporate' | 'auto';
  preselected?: boolean;
}

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

export interface Question {
  id: string;
  type: QuestionType;
  label?: string;
  title: string;
  description?: string;
  helper?: string;
  placeholder?: string;
  options?: QuestionOption[];
  contextual?: boolean;
  allowCustom?: boolean;
  autoAdvance?: boolean;
  columns?: 1 | 2;
  source?: 'ai' | 'local';
  showIf?: (answers: Answers) => boolean;
}

export interface IdeaAnalysis {
  summary: string;
  kind: string;
  platformHint: string;
  appType: string;
  suggestedFeatures: string[];
  notes?: string;
}

export type ProjectStatus = 'draft' | 'reviewing' | 'generated';

export interface Project {
  id: string;
  name: string;
  idea: string;
  badge: string;
  description: string;
  answers: Answers;
  questions?: Question[];
  followUpsDone?: boolean;
  analysis?: IdeaAnalysis | null;
  prdPrompt?: string;
  aiGenerated?: boolean;
  currentStep: number;
  completed: boolean;
  status: ProjectStatus;
  completeness: number;
  createdAt: number;
  updatedAt: number;
}

export interface ResultFeature {
  id: string;
  title: string;
  description: string;
  items: string[];
}

export interface PageItem {
  path: string;
  label: string;
  group: string;
  description?: string;
}

export interface StackItem {
  label: string;
  value: string;
  icon: string;
}

export interface DatabaseSimple {
  title: string;
  description: string;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  note?: string;
}

export interface DatabaseTable {
  name: string;
  description: string;
  columns: DatabaseColumn[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
}

export interface PrdSection {
  id: string;
  title: string;
  body: string[];
}

export interface StepPrompt {
  step: string;
  title: string;
  description: string;
  prompt: string;
}

export interface ResultData {
  projectId: string;
  summary: string;
  platform: string;
  badge: string;
  users: string[];
  roles: { title: string; description: string }[];
  hasData: boolean;
  loginRequired: boolean;
  designStyle: string;
  features: ResultFeature[];
  pages: PageItem[];
  stack: StackItem[];
  deployment: string;
  database: {
    simple: DatabaseSimple[];
    tables: DatabaseTable[];
  };
  api: {
    simple: string;
    endpoints: ApiEndpoint[];
  };
  prd: PrdSection[];
  buildPrompt: string;
  stepPrompts: StepPrompt[];
  generatedAt: number;
}

export interface ProjectSummaryCard extends Project {
  resultReady: boolean;
}
