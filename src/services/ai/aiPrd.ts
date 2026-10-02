import { chat } from '@/lib/aiClient';
import { buildPrdPrompt, buildResult } from '@/lib/blueprint';
import { prdSystemPrompt, prdUserPrompt } from '@/services/ai/prompts';
import type { Project } from '@/types';

export function localPrdPrompt(project: Project, target: string): string {
  return buildPrdPrompt(project, target);
}

export interface StreamPrdOptions {
  target: string;
  onDelta?: (delta: string) => void;
  signal?: AbortSignal;
}

export async function streamPrdPrompt(project: Project, options: StreamPrdOptions): Promise<string> {
  const result = buildResult(project);

  const structured = {
    platform: result.platform,
    badge: result.badge,
    users: result.users,
    roles: result.roles,
    hasData: result.hasData,
    loginRequired: result.loginRequired,
    designStyle: result.designStyle,
    deployment: result.deployment,
    stack: result.stack,
    features: result.features,
    pages: result.pages,
    database: result.database,
    api: result.api,
  };

  const markdown = await chat(
    [
      { role: 'system', content: prdSystemPrompt() },
      {
        role: 'user',
        content: prdUserPrompt({
          projectName: project.name,
          idea: project.idea,
          analysis: project.analysis ?? null,
          answers: project.answers,
          target: options.target,
          structured,
        }),
      },
    ],
    {
      temperature: 0.5,
      maxTokens: 6000,
      onDelta: options.onDelta,
      signal: options.signal,
    },
  );

  return markdown.trim().length > 0 ? markdown : localPrdPrompt(project, options.target);
}
