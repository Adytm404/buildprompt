import { buildQuestions } from '@/data/mockQuestions';
import { sleep } from '@/lib/utils';
import type { Answers, Question } from '@/types';

export async function analyzeIdea(idea: string): Promise<{ idea: string; summary: string }> {
  await sleep(900);
  return { idea, summary: idea.trim() };
}

export function getQuestions(idea: string): Question[] {
  return buildQuestions(idea);
}

export function filterVisible(questions: Question[], answers: Answers): Question[] {
  return questions.filter((question) => !question.showIf || question.showIf(answers));
}

export function getVisibleQuestions(idea: string, answers: Answers): Question[] {
  return filterVisible(getQuestions(idea), answers);
}

export function getQuestionAt(idea: string, answers: Answers, index: number): Question | undefined {
  return getVisibleQuestions(idea, answers)[index];
}

export function isQuestionAnswered(question: Question, answers: Answers): boolean {
  const value = answers[question.id];
  if (question.type === 'multiple') {
    return Array.isArray(value) && value.length > 0;
  }
  if (question.type === 'text' || question.type === 'confirm') {
    return typeof value === 'string' && value.trim().length > 0;
  }
  return typeof value === 'string' && value.length > 0;
}

export function getPreselectedIds(question: Question): string[] {
  return (question.options ?? []).filter((option) => option.preselected).map((option) => option.id);
}

export function computeCompletenessFrom(questions: Question[], answers: Answers): number {
  const visible = filterVisible(questions, answers);
  if (visible.length === 0) return 12;
  const answered = visible.filter((question) => isQuestionAnswered(question, answers)).length;
  const ratio = answered / visible.length;
  return Math.round(12 + 80 * ratio);
}

export function computeCompleteness(idea: string, answers: Answers): number {
  return computeCompletenessFrom(getQuestions(idea), answers);
}

export function totalVisibleSteps(idea: string, answers: Answers): number {
  return getVisibleQuestions(idea, answers).length;
}

export function fallbackQuestions(idea: string): Question[] {
  return buildQuestions(idea);
}
