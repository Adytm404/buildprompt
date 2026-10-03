import { storageKey } from '@/lib/storage';
import type { Answers, IdeaAnalysis, Project, Question } from '@/types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const TOKEN_KEY = storageKey('auth_token');

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT = 30_000;

interface TimedSignal {
  signal: AbortSignal;
  timedOut: () => boolean;
  cleanup: () => void;
}

/** Combines an optional caller signal with a hard timeout. */
function withTimeout(external: AbortSignal | undefined, timeoutMs: number): TimedSignal {
  const controller = new AbortController();
  let didTimeout = false;

  const onExternalAbort = () => controller.abort();
  if (external) {
    if (external.aborted) controller.abort();
    else external.addEventListener('abort', onExternalAbort);
  }

  const timer = window.setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);

  return {
    signal: controller.signal,
    timedOut: () => didTimeout,
    cleanup: () => {
      window.clearTimeout(timer);
      external?.removeEventListener('abort', onExternalAbort);
    },
  };
}

async function readError(response: Response): Promise<string> {
  try {
    const raw = await response.text();
    const parsed = JSON.parse(raw) as { error?: { message?: string }; message?: string };
    return parsed.error?.message || parsed.message || `Permintaan gagal (${response.status})`;
  } catch {
    return `Permintaan gagal (${response.status})`;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, signal, timeoutMs = DEFAULT_TIMEOUT } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const timed = withTimeout(signal, timeoutMs);
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: timed.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        timed.timedOut() ? 'Server tidak merespons tepat waktu.' : 'Permintaan dibatalkan.',
        0,
      );
    }
    throw new ApiError('Tidak dapat menghubungi server. Pastikan backend berjalan.', 0);
  } finally {
    timed.cleanup();
  }

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status);
  }
  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return (await response.text()) as unknown as T;
  }
  return (await response.json()) as T;
}

/**
 * Streams a plain-text response (used for PRD generation), invoking onDelta for
 * each chunk and returning the accumulated text.
 */
async function streamRequest(
  path: string,
  options: { body?: unknown; onDelta?: (delta: string) => void; signal?: AbortSignal; auth?: boolean; timeoutMs?: number } = {},
): Promise<string> {
  const { body, onDelta, signal, auth = true, timeoutMs = 300_000 } = options;
  const headers: Record<string, string> = { Accept: 'text/plain', 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const timed = withTimeout(signal, timeoutMs);
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: timed.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        timed.timedOut() ? 'Server tidak merespons tepat waktu.' : 'Permintaan dibatalkan.',
        0,
      );
    }
    throw new ApiError('Tidak dapat menghubungi server. Pastikan backend berjalan.', 0);
  }

  try {
    if (!response.ok) {
      throw new ApiError(await readError(response), response.status);
    }

    if (!response.body) {
      const text = await response.text();
      onDelta?.(text);
      return text;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let full = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        full += chunk;
        onDelta?.(chunk);
      }
    }
    return full;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError' && timed.timedOut()) {
      throw new ApiError('Server tidak merespons tepat waktu.', 0);
    }
    throw error;
  } finally {
    timed.cleanup();
  }
}

// ── API surface ─────────────────────────────────────────────────────────────

export type SubscriptionPlan = 'free' | 'pro_monthly' | 'pro_quarterly';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  dailyLimit: number;
  monthlyLimit: number;
  dailyUsed: number;
  monthlyUsed: number;
  planStartedAt?: string;
  planExpiresAt?: string;
  joinedAt: number;
}

export interface AuthSession {
  token: string;
  expiresAt: number;
  user: ApiUser;
}

export interface InterviewResponse {
  analysis: IdeaAnalysis;
  questions: Question[];
  source: 'ai' | 'local';
}

export interface PaymentInvoiceResponse {
  orderId: string;
  reference: string;
  paymentUrl: string;
  amount: number;
  plan: SubscriptionPlan;
}

export interface PaymentStatusResponse {
  orderId: string;
  status: 'pending' | 'success' | 'failed' | 'expired';
  plan: SubscriptionPlan;
  amount: number;
  reference: string;
  paidAt?: string;
  createdAt: string;
}

export const api = {
  register: (payload: { name: string; email: string; password: string }) =>
    request<AuthSession>('/auth/register', { method: 'POST', body: payload, auth: false }),

  login: (payload: { email: string; password: string }) =>
    request<AuthSession>('/auth/login', { method: 'POST', body: payload, auth: false }),

  me: (signal?: AbortSignal) => request<{ user: ApiUser }>('/auth/me', { signal, timeoutMs: 20_000 }),

  upgradePlan: (plan: SubscriptionPlan) =>
    request<{ user: ApiUser }>('/plans/upgrade', { method: 'POST', body: { plan } }),

  createPaymentInvoice: (plan: SubscriptionPlan, paymentMethod?: string) =>
    request<PaymentInvoiceResponse>('/payment/create-invoice', {
      method: 'POST',
      body: { plan, paymentMethod },
    }),

  getPaymentStatus: (orderId: string) =>
    request<PaymentStatusResponse>(`/payment/status/${orderId}`),

  listProjects: (signal?: AbortSignal) => request<{ projects: Project[] }>('/projects', { signal }),

  createProject: (idea: string) =>
    request<{ project: Project }>('/projects', { method: 'POST', body: { idea } }),

  getProject: (id: string) => request<{ project: Project }>(`/projects/${id}`),

  updateProject: (id: string, patch: Partial<Project>) =>
    request<{ project: Project }>(`/projects/${id}`, { method: 'PATCH', body: patch }),

  deleteProject: (id: string) => request<{ ok: boolean }>(`/projects/${id}`, { method: 'DELETE' }),

  duplicateProject: (id: string) =>
    request<{ project: Project }>(`/projects/${id}/duplicate`, { method: 'POST' }),

  createShare: (id: string) =>
    request<{ token: string; path: string; views: number; createdAt: number }>(`/projects/${id}/share`, {
      method: 'POST',
    }),

  publicShare: (token: string) =>
    request<{ project: Project; share: { token: string; views: number } }>(`/share/${token}`, { auth: false }),

  interview: (idea: string, signal?: AbortSignal) =>
    request<InterviewResponse>('/ai/interview', { method: 'POST', body: { idea }, signal, timeoutMs: 180_000 }),

  followUps: (payload: { idea: string; answers: Answers; existingIds: string[] }, signal?: AbortSignal) =>
    request<{ questions: Question[] }>('/ai/interview/followups', {
      method: 'POST',
      body: payload,
      signal,
      timeoutMs: 120_000,
    }),

  generatePrd: (payload: {
    projectId: string;
    target: string;
    structured?: unknown;
    onDelta?: (delta: string) => void;
    signal?: AbortSignal;
  }) =>
    streamRequest('/ai/prd', {
      body: { projectId: payload.projectId, target: payload.target, structured: payload.structured },
      onDelta: payload.onDelta,
      signal: payload.signal,
    }),

  publicPrd: (token: string, payload: { target: string; structured?: unknown; onDelta?: (delta: string) => void; signal?: AbortSignal }) =>
    streamRequest(`/share/${token}/prd`, {
      body: { target: payload.target, structured: payload.structured },
      onDelta: payload.onDelta,
      signal: payload.signal,
      auth: false,
    }),
};
