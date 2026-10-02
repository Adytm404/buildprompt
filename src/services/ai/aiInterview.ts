import { chatJson } from '@/lib/aiClient';
import { summarizeIdea } from '@/lib/utils';
import type { Answers, IdeaAnalysis, Question, QuestionOption, QuestionType } from '@/types';
import {
  followUpSystemPrompt,
  followUpUserPrompt,
  interviewSystemPrompt,
  interviewUserPrompt,
} from '@/services/ai/prompts';

const ALLOWED_ICONS = new Set(['Globe', 'Smartphone', 'Monitor', 'Sparkles']);
const VALID_TYPES: QuestionType[] = ['single', 'multiple', 'text', 'confirm'];

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function slug(value: string, fallback: string): string {
  const result = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return result || fallback;
}

function normalizeOption(raw: unknown, index: number): QuestionOption | null {
  const record = asRecord(raw);
  const title = asString(record.title);
  if (!title) return null;
  const id = slug(asString(record.id) ?? title, `opt_${index}`);
  const iconRaw = asString(record.icon);
  return {
    id,
    title,
    description: asString(record.description),
    icon: iconRaw && ALLOWED_ICONS.has(iconRaw) ? iconRaw : undefined,
    preselected: asBoolean(record.preselected) ?? false,
  };
}

function normalizeQuestion(raw: unknown, index: number): Question | null {
  const record = asRecord(raw);
  const title = asString(record.title);
  if (!title) return null;

  const rawType = asString(record.type) as QuestionType | undefined;
  let type: QuestionType = rawType && VALID_TYPES.includes(rawType) ? rawType : 'single';

  const options = Array.isArray(record.options)
    ? (record.options.map(normalizeOption).filter(Boolean) as QuestionOption[])
    : [];

  if ((type === 'single' || type === 'multiple') && options.length < 2) {
    type = 'text';
  }
  if (type === 'confirm' && options.length < 2) {
    return null;
  }

  const columns = record.columns === 2 ? 2 : record.columns === 1 ? 1 : undefined;
  const autoAdvance = asBoolean(record.autoAdvance) ?? (type === 'single');

  const question: Question = {
    id: slug(asString(record.id) ?? title, `q_${index}`),
    type,
    label: asString(record.label),
    title,
    description: asString(record.description),
    helper: asString(record.helper),
    placeholder: asString(record.placeholder),
    contextual: asBoolean(record.contextual) ?? false,
    allowCustom: asBoolean(record.allowCustom) ?? type === 'multiple',
    autoAdvance,
    columns,
    source: 'ai',
  };

  if (type === 'single' || type === 'multiple' || type === 'confirm') {
    question.options = options;
  }

  return question;
}

export function normalizeQuestions(raw: unknown): Question[] {
  if (!Array.isArray(raw)) return [];
  const questions: Question[] = [];
  const seen = new Set<string>();

  raw.forEach((item, index) => {
    const question = normalizeQuestion(item, index);
    if (!question) return;
    let id = question.id;
    let suffix = 2;
    while (seen.has(id)) {
      id = `${question.id}_${suffix}`;
      suffix += 1;
    }
    seen.add(id);
    questions.push({ ...question, id });
  });

  return questions;
}

function normalizeAnalysis(raw: unknown, idea: string): IdeaAnalysis {
  const record = asRecord(raw);
  const features = Array.isArray(record.suggestedFeatures)
    ? (record.suggestedFeatures.filter((item): item is string => typeof item === 'string').slice(0, 8))
    : [];

  return {
    summary: asString(record.summary) ?? summarizeIdea(idea),
    kind: asString(record.kind) ?? 'generic',
    platformHint: asString(record.platformHint) ?? 'unsure',
    appType: asString(record.appType) ?? 'web application',
    suggestedFeatures: features,
    notes: asString(record.notes),
  };
}

export interface InterviewResult {
  analysis: IdeaAnalysis;
  questions: Question[];
}

export async function generateInterview(idea: string): Promise<InterviewResult | null> {
  const payload = await chatJson<{ analysis?: unknown; questions?: unknown }>([
    { role: 'system', content: interviewSystemPrompt() },
    { role: 'user', content: interviewUserPrompt(idea) },
  ]);

  const questions = normalizeQuestions(payload.questions);
  if (questions.length < 4) return null;

  return { analysis: normalizeAnalysis(payload.analysis, idea), questions };
}

export async function generateFollowUps(
  idea: string,
  answers: Answers,
  existingIds: string[],
): Promise<Question[]> {
  const payload = await chatJson<{ questions?: unknown }>([
    { role: 'system', content: followUpSystemPrompt() },
    { role: 'user', content: followUpUserPrompt(idea, answers, existingIds) },
  ]);

  return normalizeQuestions(payload.questions)
    .filter((question) => !existingIds.includes(question.id))
    .slice(0, 2)
    .map((question) => ({ ...question, contextual: true }));
}
