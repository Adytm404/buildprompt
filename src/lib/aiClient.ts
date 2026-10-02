import { getAIConfig } from '@/lib/aiConfig';

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatOptions {
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  onDelta?: (delta: string) => void;
  timeoutMs?: number;
}

export type AIErrorCode = 'auth' | 'network' | 'timeout' | 'http' | 'parse' | 'aborted';

export class AIError extends Error {
  code: AIErrorCode;
  status?: number;

  constructor(code: AIErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.status = status;
  }
}

interface ErrorBody {
  error?: { message?: string };
  message?: string;
}

function readErrorMessage(raw: string, status: number): string {
  try {
    const parsed = JSON.parse(raw) as ErrorBody;
    return parsed.error?.message || parsed.message || `Request gagal (${status})`;
  } catch {
    return raw.trim() || `Request gagal (${status})`;
  }
}

export async function chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<string> {
  const config = getAIConfig();
  if (!config.apiKey) {
    throw new AIError('auth', 'API key belum dikonfigurasi.');
  }

  const controller = new AbortController();
  let timedOut = false;
  const timeoutMs = options.timeoutMs ?? (options.onDelta ? 180_000 : 90_000);

  const onExternalAbort = () => controller.abort();
  options.signal?.addEventListener('abort', onExternalAbort);

  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const body: Record<string, unknown> = {
      model: config.model,
      messages,
      temperature: options.temperature ?? 0.4,
    };
    if (options.maxTokens) body.max_tokens = options.maxTokens;
    if (options.json && !options.onDelta) {
      body.response_format = { type: 'json_object' };
    }
    if (options.onDelta) body.stream = true;

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const raw = await response.text().catch(() => '');
      const code: AIErrorCode = response.status === 401 || response.status === 403 ? 'auth' : 'http';
      throw new AIError(code, readErrorMessage(raw, response.status), response.status);
    }

    if (options.onDelta) {
      return await readStream(response, options.onDelta);
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };
    return payload.choices?.[0]?.message?.content ?? '';
  } catch (error) {
    if (error instanceof AIError) throw error;
    if (timedOut) throw new AIError('timeout', 'AI tidak merespons tepat waktu.');
    if (controller.signal.aborted) throw new AIError('aborted', 'Permintaan dibatalkan.');
    throw new AIError('network', error instanceof Error ? error.message : 'Gagal menghubungi AI.');
  } finally {
    window.clearTimeout(timer);
    options.signal?.removeEventListener('abort', onExternalAbort);
  }
}

async function readStream(response: Response, onDelta: (delta: string) => void): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    onDelta(text);
    return text;
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
        const delta = parsed.choices?.[0]?.delta?.content ?? '';
        if (delta) {
          full += delta;
          onDelta(delta);
        }
      } catch {
        /* ignore malformed keep-alive chunks */
      }
    }
  }

  return full;
}

export function extractJson<T>(content: string): T {
  const cleaned = content
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new AIError('parse', 'Respons AI tidak berisi JSON yang valid.');
  }

  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    throw new AIError('parse', 'Gagal membaca JSON dari respons AI.');
  }
}

export async function chatJson<T>(messages: ChatMessage[], options: ChatOptions = {}): Promise<T> {
  try {
    const content = await chat(messages, { ...options, json: true, onDelta: undefined });
    return extractJson<T>(content);
  } catch (error) {
    // Some OpenAI-compatible servers reject response_format; retry without it.
    if (error instanceof AIError && error.code === 'http') {
      const content = await chat(messages, { ...options, json: false, onDelta: undefined });
      return extractJson<T>(content);
    }
    throw error;
  }
}
