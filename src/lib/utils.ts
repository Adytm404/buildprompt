export type ClassValue = string | number | null | undefined | false | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    out.push(String(value));
  };
  inputs.forEach(walk);
  return out.join(' ');
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function firstSentence(text: string): string {
  const clean = text.trim().replace(/\s+/g, ' ');
  const match = clean.match(/^[^.?!]+/);
  return (match?.[0] ?? clean).trim();
}

export function summarizeIdea(idea: string): string {
  const stripped = idea
    .trim()
    .replace(/^(saya|aku|kami)\s+(ingin|mau|pengen|pingin|butuh)\s+(membuat|buat|bikin|punya)?\s*/i, '')
    .trim();
  const first = firstSentence(stripped).replace(/[.,;:]+$/, '');
  return first.length > 0 ? first : idea.trim();
}

export function deriveProjectName(idea: string): string {
  const lower = idea.toLowerCase();
  if (/(kasir|warung|\bpos\b|toko|retail)/.test(lower)) return 'Kasir Warung';
  if (/(booking|barber|salon|reservasi|appointment)/.test(lower)) return 'Booking Barbershop';
  if (/(keuangan|finansial|catatan|budget|pengeluaran)/.test(lower)) return 'Catatan Keuangan';
  if (/(absensi|kehadiran|presensi|karyawan)/.test(lower)) return 'Sistem Absensi';
  if (/(landing|company profile|profil|bisnis|jasa)/.test(lower)) return 'Laman Landas Bisnis';
  if (/(sekolah|siswa|belajar|kursus|lms)/.test(lower)) return 'Platform Belajar';
  const summary = summarizeIdea(idea).replace(/\b\w/g, (c) => c.toUpperCase());
  return summary.split(' ').slice(0, 3).join(' ') || 'Proyek Baru';
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return 'Baru saja';
  if (diff < hour) return `${Math.floor(diff / minute)} menit lalu`;
  if (diff < day) return `${Math.floor(diff / hour)} jam lalu`;
  if (diff < 2 * day) return 'Kemarin';
  if (diff < 7 * day) return `${Math.floor(diff / day)} hari lalu`;
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function truncate(value: string, length: number): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}...`;
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}
