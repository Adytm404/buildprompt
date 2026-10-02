import type { Project } from '@/types';

export function encodeProjectPayload(project: Project): string {
  try {
    const payload = {
      id: project.id,
      name: project.name,
      idea: project.idea,
      badge: project.badge,
      description: project.description,
      answers: project.answers,
      prdPrompt: project.prdPrompt,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

export function decodeProjectPayload(encoded: string): Project | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    if (!data.id || !data.name) return null;
    return {
      id: data.id,
      name: data.name,
      idea: data.idea || '',
      badge: data.badge || 'Aplikasi Web',
      description: data.description || '',
      status: 'generated',
      completeness: 100,
      currentStep: 5,
      completed: true,
      answers: data.answers || {},
      createdAt: data.createdAt || Date.now(),
      updatedAt: data.updatedAt || Date.now(),
      prdPrompt: data.prdPrompt,
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(project: Project): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const hash = encodeProjectPayload(project);
  return `${origin}/share/${project.id}${hash ? `#d=${hash}` : ''}`;
}
