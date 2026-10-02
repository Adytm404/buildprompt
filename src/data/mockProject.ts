import type { Answers, Project } from '@/types';
import { deriveProjectName, uid } from '@/lib/utils';

export const DEFAULT_IDEA =
  'Saya ingin membuat aplikasi kasir sederhana untuk warung kecil. Pemilik bisa mengelola produk dan stok, kasir bisa melakukan transaksi, dan pemilik bisa melihat laporan penjualan.';

export const IDEA_SUGGESTIONS = [
  { id: 'kasir', label: 'Aplikasi kasir', idea: DEFAULT_IDEA },
  {
    id: 'barbershop',
    label: 'Booking barbershop',
    idea: 'Saya ingin membuat aplikasi booking barbershop supaya pelanggan bisa memesan jadwal potong rambut dan memilih barber favoritnya.',
  },
  {
    id: 'keuangan',
    label: 'Catatan keuangan',
    idea: 'Saya ingin membuat aplikasi catatan keuangan sederhana untuk mencatat pemasukan, pengeluaran, dan melihat ringkasan keuangan bulanan.',
  },
  {
    id: 'landing',
    label: 'Landing page bisnis',
    idea: 'Saya ingin membuat landing page untuk bisnis jasa saya agar calon pelanggan bisa melihat layanan dan menghubungi saya.',
  },
  {
    id: 'absensi',
    label: 'Sistem absensi',
    idea: 'Saya ingin membuat sistem absensi karyawan dengan catatan kehadiran harian dan rekap bulanan untuk admin.',
  },
];

export function createProject(idea: string, overrides: Partial<Project> = {}): Project {
  const now = Date.now();
  const name = deriveProjectName(idea);
  return {
    id: uid('proj'),
    name,
    idea: idea.trim(),
    badge: 'Aplikasi Web',
    description: buildDescription(idea),
    answers: {},
    currentStep: 0,
    completed: false,
    status: 'draft',
    completeness: 12,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function buildDescription(idea: string): string {
  const lower = idea.toLowerCase();
  if (/(kasir|warung|\bpos\b|toko|retail)/.test(lower)) {
    return 'Aplikasi kasir berbasis web untuk membantu warung mengelola transaksi, produk, stok, dan laporan sederhana.';
  }
  if (/(booking|barber|salon|reservasi)/.test(lower)) {
    return 'Aplikasi booking berbasis web agar pelanggan dapat memesan jadwal dan mengelola ketersediaan karyawan.';
  }
  if (/(keuangan|finansial|catatan|budget)/.test(lower)) {
    return 'Aplikasi pencatatan keuangan sederhana untuk memantau pemasukan, pengeluaran, dan ringkasan bulanan.';
  }
  return 'Aplikasi berbasis web yang dirancang dari ide Anda, lengkap dengan fitur utama dan tampilan yang mudah digunakan.';
}

export function seedProjects(): Project[] {
  const now = Date.now();
  const kasir = createProject(DEFAULT_IDEA, {
    id: 'proj_demo_kasir',
    name: 'Kasir Warung',
    badge: 'Aplikasi Web',
    status: 'reviewing',
    completeness: 92,
    completed: true,
    currentStep: 0,
    updatedAt: now - 1000 * 60 * 2,
    answers: {
      idea_confirmation: 'correct',
      platform: 'website',
      website_type: 'webapp',
      user_type: ['owner', 'staff'],
      login: 'yes',
      data: 'yes',
      features: ['pos', 'products', 'stock', 'transactions', 'reports'],
      dynamic_stock: 'yes',
      design_style: 'saas',
      device_priority: 'both',
      deployment: 'shared',
    },
  });

  const booking = createProject(
    'Saya ingin membuat aplikasi booking barbershop supaya pelanggan bisa memesan jadwal potong rambut dan memilih barber favoritnya.',
    {
      id: 'proj_demo_booking',
      name: 'Booking Barbershop',
      badge: 'Aplikasi Web',
      status: 'generated',
      completeness: 100,
      completed: true,
      currentStep: 0,
      updatedAt: now - 1000 * 60 * 60 * 26,
      answers: {
        idea_confirmation: 'correct',
        platform: 'website',
        website_type: 'webapp',
        user_type: ['customer', 'owner', 'staff'],
        login: 'yes',
        data: 'yes',
        features: ['booking', 'schedule', 'staff', 'services', 'reminder'],
        dynamic_stock: 'yes',
        design_style: 'minimal',
        device_priority: 'mobile',
        deployment: 'vercel',
      },
    },
  );

  return [kasir, booking];
}

export function createDemoProject(): Project {
  const project = createProject(DEFAULT_IDEA);
  const answers: Answers = {
    idea_confirmation: 'correct',
    platform: 'website',
    website_type: 'webapp',
    user_type: ['owner', 'staff'],
    login: 'yes',
    data: 'yes',
    features: ['pos', 'products', 'stock', 'transactions', 'reports'],
    dynamic_stock: 'yes',
    design_style: 'saas',
    device_priority: 'both',
    deployment: 'shared',
  };
  return {
    ...project,
    id: 'demo-project',
    name: 'Kasir Warung',
    answers,
    completed: true,
    status: 'reviewing',
    completeness: 92,
  };
}
