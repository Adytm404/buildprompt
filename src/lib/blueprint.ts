import type {
  ApiEndpoint,
  DatabaseSimple,
  DatabaseTable,
  PageItem,
  PrdSection,
  Project,
  ResultData,
  ResultFeature,
  StackItem,
} from '@/types';
import {
  FEATURE_DETAILS,
  FEATURE_ENDPOINTS,
  FEATURE_PAGES,
  FEATURE_TABLES,
  SIMPLE_DATA,
  defaultFeatureIds,
  deploymentLabel,
  userLabel,
  type IdeaKind,
} from '@/data/blueprintCatalogs';
import { summarizeIdea } from '@/lib/utils';

export function detectKind(idea: string): IdeaKind {
  const lower = idea.toLowerCase();
  if (/(kasir|warung|\bpos\b|toko|retail|transaksi|stok)/.test(lower)) return 'pos';
  if (/(booking|barber|salon|reservasi|appointment)/.test(lower)) return 'booking';
  if (/(keuangan|finansial|catatan|budget|pengeluaran|pemasukan)/.test(lower)) return 'finance';
  if (/(absensi|kehadiran|presensi)/.test(lower)) return 'attendance';
  if (/(landing|company profile|profil|portofolio)/.test(lower)) return 'landing';
  return 'generic';
}

function platformInfo(answers: Record<string, unknown>): { badge: string; platform: string } {
  const platform = answers.platform as string | undefined;
  const websiteType = answers.website_type as string | undefined;

  if (platform === 'mobile') return { badge: 'Aplikasi Seluler', platform: 'Aplikasi Seluler (Android & iOS)' };
  if (platform === 'desktop') return { badge: 'Aplikasi Desktop', platform: 'Aplikasi Desktop (Windows, macOS, Linux)' };

  switch (websiteType) {
    case 'landing':
      return { badge: 'Laman Landas', platform: 'Laman Landas (Landing Page)' };
    case 'company':
      return { badge: 'Profil Perusahaan', platform: 'Profil Perusahaan (Company Profile)' };
    case 'marketplace':
      return { badge: 'Lokapasar', platform: 'Lokapasar (Marketplace)' };
    default:
      return { badge: 'Aplikasi Web', platform: 'Aplikasi Web' };
  }
}

export function deriveBadge(answers: Record<string, unknown>): string {
  return platformInfo(answers).badge;
}

function designStyleLabel(answers: Record<string, unknown>): string {
  switch (answers.design_style) {
    case 'minimal':
      return 'Bersih & Minimalis';
    case 'saas':
      return 'SaaS Modern';
    case 'fun':
      return 'Ceria & Bersahabat';
    case 'corporate':
      return 'Korporat & Profesional';
    default:
      return 'Ditentukan AI sesuai jenis aplikasi';
  }
}

function selectedFeatures(project: Project, kind: IdeaKind): string[] {
  const value = project.answers.features;
  const ids = Array.isArray(value) ? (value as string[]) : [];
  const chosen = ids.length > 0 ? ids : defaultFeatureIds(kind);
  const unique = Array.from(new Set(chosen));
  return unique.sort((a, b) => (a === 'dashboard' ? -1 : b === 'dashboard' ? 1 : 0));
}

function toFeature(id: string): ResultFeature {
  const detail = FEATURE_DETAILS[id];
  if (detail) return { id, title: detail.title, description: detail.description, items: detail.items };
  return {
    id,
    title: id,
    description: 'Fitur tambahan sesuai kebutuhan Anda.',
    items: ['Alur utama fitur', 'Tampilan data', 'Aksi yang dibutuhkan'],
  };
}

function toUsers(project: Project, kind: IdeaKind): string[] {
  const value = project.answers.user_type;
  const ids = Array.isArray(value) ? (value as string[]) : [];
  const fallback = kind === 'pos' ? ['owner', 'staff'] : kind === 'booking' ? ['customer', 'owner', 'staff'] : ['owner'];
  const chosen = ids.length > 0 ? ids : fallback;
  return Array.from(new Set(chosen.map((id) => userLabel(kind, id))));
}

function toRoles(users: string[]): { title: string; description: string }[] {
  return users.map((title) => ({
    title,
    description: `Peran ${title} dengan hak akses yang disesuaikan.`,
  }));
}

function buildPages(project: Project, features: string[]): PageItem[] {
  const login = project.answers.login !== 'no';
  const pages: PageItem[] = [];
  if (login) {
    pages.push({ path: '/login', label: 'Login', group: 'Autentikasi', description: 'Masuk ke akun pengguna.' });
  }
  features.forEach((id) => {
    (FEATURE_PAGES[id] ?? []).forEach((page) => {
      if (!pages.some((existing) => existing.path === page.path)) pages.push(page);
    });
  });
  pages.push({ path: '/settings', label: 'Pengaturan', group: 'Sistem', description: 'Pengaturan aplikasi dan akun.' });
  return pages;
}

function buildTables(project: Project, features: string[]): DatabaseTable[] {
  const tables: DatabaseTable[] = [];
  if (project.answers.login !== 'no') {
    tables.push({
      name: 'users',
      description: 'Akun pengguna aplikasi.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'name', type: 'varchar(100)' },
        { name: 'email', type: 'varchar(150)', note: 'unique' },
        { name: 'password', type: 'varchar(255)' },
        { name: 'role', type: 'varchar(50)' },
        { name: 'created_at', type: 'timestamp' },
      ],
    });
  }
  features.forEach((id) => {
    (FEATURE_TABLES[id] ?? []).forEach((table) => {
      if (!tables.some((existing) => existing.name === table.name)) tables.push(table);
    });
  });
  return tables;
}

function buildEndpoints(project: Project, features: string[]): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = [];
  if (project.answers.login !== 'no') {
    endpoints.push(
      { method: 'POST', path: '/api/auth/login', description: 'Masuk dan mendapatkan token akses.' },
      { method: 'POST', path: '/api/auth/logout', description: 'Keluar dari sesi saat ini.' },
    );
  }
  features.forEach((id) => {
    (FEATURE_ENDPOINTS[id] ?? []).forEach((endpoint) => {
      if (!endpoints.some((existing) => existing.method === endpoint.method && existing.path === endpoint.path)) {
        endpoints.push(endpoint);
      }
    });
  });
  return endpoints;
}

function buildSimpleData(project: Project, features: string[]): DatabaseSimple[] {
  const simple: DatabaseSimple[] = [];
  if (project.answers.login !== 'no') {
    simple.push({ title: 'Data Pengguna', description: 'Menyimpan akun dan hak akses pengguna.' });
  }
  features.forEach((id) => {
    const item = SIMPLE_DATA[id];
    if (item && !simple.some((existing) => existing.title === item.title)) simple.push(item);
  });
  return simple;
}

function buildStack(project: Project): StackItem[] {
  const platform = project.answers.platform;
  const deployment = project.answers.deployment as string | undefined;

  if (platform === 'mobile') {
    return [
      { label: 'Antarmuka', value: 'React Native', icon: 'Atom' },
      { label: 'Sisi Server', value: 'Laravel', icon: 'Server' },
      { label: 'Basis Data', value: 'MySQL', icon: 'Database' },
      { label: 'Distribusi', value: 'Google Play / App Store', icon: 'Cloud' },
    ];
  }
  if (platform === 'desktop') {
    return [
      { label: 'Antarmuka', value: 'React + Electron', icon: 'Atom' },
      { label: 'Sisi Server', value: 'Laravel', icon: 'Server' },
      { label: 'Basis Data', value: 'MySQL', icon: 'Database' },
      { label: 'Distribusi', value: 'Installer (Windows/macOS)', icon: 'Cloud' },
    ];
  }
  if (deployment === 'vercel') {
    return [
      { label: 'Antarmuka', value: 'React + Vite', icon: 'Atom' },
      { label: 'Sisi Server', value: 'Node.js (Express)', icon: 'Server' },
      { label: 'Basis Data', value: 'PostgreSQL', icon: 'Database' },
      { label: 'Penyedia Hosting', value: 'Vercel', icon: 'Cloud' },
    ];
  }
  if (deployment === 'vps') {
    return [
      { label: 'Antarmuka', value: 'React + Vite', icon: 'Atom' },
      { label: 'Sisi Server', value: 'Laravel', icon: 'Server' },
      { label: 'Basis Data', value: 'MySQL', icon: 'Database' },
      { label: 'Penyedia Hosting', value: 'VPS', icon: 'Cloud' },
    ];
  }
  return [
    { label: 'Antarmuka', value: 'React + Vite', icon: 'Atom' },
    { label: 'Sisi Server', value: 'Laravel', icon: 'Server' },
    { label: 'Basis Data', value: 'MySQL', icon: 'Database' },
    { label: 'Penyedia Hosting', value: 'cPanel / Shared Hosting', icon: 'Cloud' },
  ];
}

function buildSummary(project: Project, platform: string, features: ResultFeature[], designStyle: string): string {
  const core = summarizeIdea(project.idea);
  const names = features.map((feature) => feature.title).join(', ');
  return `${platform} untuk: ${core}. Fokus utamanya adalah ${names.toLowerCase()}. Tampilan dirancang dengan gaya ${designStyle} agar mudah digunakan pengguna non-teknis.`;
}

function buildPrd(context: {
  project: Project;
  platform: string;
  users: string[];
  roles: { title: string; description: string }[];
  features: ResultFeature[];
  pages: PageItem[];
  login: boolean;
  hasData: boolean;
  deployment: string;
  designStyle: string;
}): PrdSection[] {
  const { project, platform, roles, features, pages, login, hasData, deployment, designStyle } = context;
  const featureTitles = features.map((feature) => feature.title);
  return [
    {
      id: 'overview',
      title: 'Ikhtisar Produk',
      body: [
        `${project.name} adalah ${platform.toLowerCase()} yang dibuat dari ide: "${summarizeIdea(project.idea)}".`,
        `Tampilan dirancang dengan gaya ${designStyle} dan menekankan kemudahan penggunaan.`,
      ],
    },
    {
      id: 'problem',
      title: 'Permasalahan',
      body: (hasData
        ? [
            'Proses kerja masih dilakukan secara manual sehingga rawan kesalahan dan sulit direkap.',
            'Data penting belum terpusat dan sulit diakses kembali ketika dibutuhkan.',
          ]
        : [
            'Informasi belum tersaji secara terstruktur dan mudah diakses.',
            'Pengunjung atau pengguna kesulitan menemukan informasi yang dibutuhkan.',
          ]),
    },
    {
      id: 'users',
      title: 'Target Pengguna',
      body: roles.map((role) => `${role.title} — ${role.description}`),
    },
    {
      id: 'goals',
      title: 'Tujuan',
      body: [
        'Menyediakan satu tempat untuk mengelola kebutuhan utama aplikasi.',
        'Mempercepat pekerjaan harian pengguna.',
        'Menyajikan informasi yang mudah dibaca dan dipahami.',
      ],
    },
    {
      id: 'features',
      title: 'Fitur Utama',
      body: features.map((feature) => `${feature.title} — ${feature.description}`),
    },
    {
      id: 'roles',
      title: 'Peran Pengguna',
      body: roles.map((role, index) => `${role.title}: hak akses ${index === 0 ? 'penuh' : 'terbatas sesuai kebutuhan'}.`),
    },
    {
      id: 'flow',
      title: 'Alur Pengguna',
      body: [
        login ? 'Pengguna masuk ke akun → diarahkan ke halaman utama.' : 'Pengguna langsung membuka halaman utama tanpa login.',
        `Pengguna menggunakan fitur utama: ${featureTitles.join(', ')}.`,
        hasData ? 'Data tersimpan otomatis dan dapat dibuka kembali kapan saja.' : 'Aplikasi menampilkan informasi tanpa menyimpan data pengguna.',
      ],
    },
    {
      id: 'pages',
      title: 'Halaman Aplikasi',
      body: pages.map((page) => `${page.path} — ${page.label}`),
    },
    {
      id: 'rules',
      title: 'Aturan Bisnis',
      body: [
        login ? 'Setiap pengguna memiliki akun masing-masing.' : 'Semua fitur dapat digunakan tanpa login.',
        hasData ? 'Data yang tersimpan dapat diubah dan dihapus oleh pengguna berwenang.' : 'Aplikasi tidak menyimpan data pribadi pengguna.',
        'Aksi penting menampilkan konfirmasi sebelum dijalankan.',
        'Hak akses dibedakan sesuai peran pengguna.',
      ],
    },
    {
      id: 'technical',
      title: 'Kebutuhan Teknis',
      body: [
        `Tampilan dibuat untuk ${platform}.`,
        'Antarmuka responsif dan nyaman di berbagai ukuran layar.',
        login ? 'Autentikasi pengguna diperlukan.' : 'Tidak memerlukan autentikasi.',
        hasData ? 'Menyediakan penyimpanan data yang terstruktur.' : 'Fokus pada penyajian informasi.',
      ],
    },
    {
      id: 'security',
      title: 'Keamanan',
      body: [
        login ? 'Autentikasi berbasis token dengan masa berlaku terbatas.' : 'Tidak ada kredensial pengguna yang disimpan.',
        'Validasi input pada setiap masukan pengguna.',
        'Hak akses berbasis peran.',
      ],
    },
    {
      id: 'deployment',
      title: 'Pemasangan & Penerapan',
      body: [
        `Rekomendasi pemasangan: ${deployment}.`,
        'Konfigurasi environment dipisahkan antara development dan production.',
      ],
    },
    {
      id: 'dod',
      title: 'Kriteria Selesai (Definition of Done)',
      body: [
        'Semua halaman utama dapat diakses tanpa error.',
        'Fitur utama berjalan sesuai alur yang ditentukan.',
        'Tampilan nyaman digunakan pada perangkat target.',
        'Tidak ada tombol atau tautan yang tidak berfungsi.',
      ],
    },
  ];
}

function buildPrompt(context: {
  project: Project;
  platform: string;
  features: ResultFeature[];
  pages: PageItem[];
  tables: DatabaseTable[];
  endpoints: ApiEndpoint[];
  login: boolean;
  hasData: boolean;
  deployment: string;
  designStyle: string;
}): string {
  const { project, platform, features, pages, tables, endpoints, login, hasData, deployment, designStyle } = context;
  return `# ROLE

You are a senior full-stack software engineer. Build a production-ready application based on the specification below.

# PROJECT OBJECTIVE

Build ${project.name}: ${summarizeIdea(project.idea)}.

# PLATFORM

${platform}

# TECH STACK

${buildStack(project)
  .map((item) => `- ${item.label}: ${item.value}`)
  .join('\n')}

# DESIGN STYLE

${designStyle}

# AUTHENTICATION

${login ? 'Users must be able to register, log in, and log out.' : 'No authentication required.'}

# DATA

${hasData ? 'The application stores data that users can create, read, update, and delete.' : 'The application does not persist user data.'}

# APPLICATION FEATURES

${features.map((feature) => `- ${feature.title}: ${feature.description}`).join('\n')}

# PAGES

${pages.map((page) => `- ${page.path} — ${page.label}`).join('\n')}

# DATABASE

${tables.length > 0 ? tables.map((table) => `- ${table.name} (${table.columns.map((column) => column.name).join(', ')})`).join('\n') : '- No database required.'}

# API

${endpoints.length > 0 ? endpoints.map((endpoint) => `- ${endpoint.method} ${endpoint.path} — ${endpoint.description}`).join('\n') : '- No API required.'}

# BUSINESS RULES

${login ? '- Each user has their own account.' : '- All features are usable without login.'}
${hasData ? '- Stored data can be edited and deleted by authorized users.' : '- No personal data is stored.'}
- Important actions ask for confirmation.

# UI REQUIREMENTS

- Style: ${designStyle}.
- Clean, minimal, and easy to use.
- Responsive across screen sizes.
- Clear typography with generous whitespace.

# SECURITY

${login ? '- Token-based authentication.' : '- No credentials are stored.'}
- Validate input on every endpoint.
- Role-based authorization.

# TESTING

- Write unit tests for the main logic.
- Verify the primary user flow end to end.

# DEFINITION OF DONE

- All main features work.
- No console errors.
- Usable on the target device.
- Deployment steps: ${deployment}.`;
}

function buildStepPrompts(project: Project, features: ResultFeature[], tables: DatabaseTable[], login: boolean): ResultData['stepPrompts'] {
  return [
    {
      step: '01',
      title: 'Project Setup',
      description: 'Menyiapkan struktur dasar aplikasi.',
      prompt: `Buat project ${project.name} dengan stack yang direkomendasikan. Siapkan struktur folder, routing, dan layout dasar.`,
    },
    ...(login
      ? [
          {
            step: '02',
            title: 'Authentication',
            description: 'Membuat alur login dan hak akses.',
            prompt: 'Buat halaman login, penyimpanan token, proteksi route, dan pembedaan hak akses per peran.',
          },
        ]
      : []),
    {
      step: login ? '03' : '02',
      title: 'Database',
      description: 'Menyiapkan model dan migrasi data.',
      prompt:
        tables.length > 0
          ? `Buat migrasi dan model untuk tabel: ${tables.map((table) => table.name).join(', ')}. Sertakan relasi antar tabel.`
          : 'Aplikasi ini tidak memerlukan database. Lewati tahap ini.',
    },
    {
      step: login ? '04' : '03',
      title: 'Main Features',
      description: 'Mengerjakan fitur utama aplikasi.',
      prompt: `Implementasikan fitur inti: ${features.map((feature) => feature.title).join(', ')} beserta interaksi utamanya.`,
    },
    {
      step: login ? '05' : '04',
      title: 'Testing',
      description: 'Memastikan alur berjalan benar.',
      prompt: 'Tulis pengujian untuk alur utama dan pastikan tidak ada error.',
    },
    {
      step: login ? '06' : '05',
      title: 'Deployment',
      description: 'Menyiapkan aplikasi untuk dipasang.',
      prompt: 'Siapkan konfigurasi build production dan panduan deployment.',
    },
  ];
}

export function buildResult(project: Project): ResultData {
  const kind = detectKind(project.idea);
  const { badge, platform } = platformInfo(project.answers);
  const designStyle = designStyleLabel(project.answers);
  const featureIds = selectedFeatures(project, kind);
  const features = featureIds.map(toFeature);
  const users = toUsers(project, kind);
  const roles = toRoles(users);
  const loginRequired = project.answers.login !== 'no';
  const hasData = project.answers.data !== 'no';
  const deployment = deploymentLabel(project.answers.deployment as string | undefined);
  const pages = buildPages(project, featureIds);
  const tables = hasData ? buildTables(project, featureIds) : [];
  const endpoints = buildEndpoints(project, featureIds);
  const simpleData = hasData ? buildSimpleData(project, featureIds) : [];

  return {
    projectId: project.id,
    summary: buildSummary(project, platform, features, designStyle),
    platform,
    badge,
    users,
    roles,
    hasData,
    loginRequired,
    designStyle,
    features,
    pages,
    stack: buildStack(project),
    deployment,
    database: { simple: simpleData, tables },
    api: {
      simple: hasData
        ? `Aplikasi ini bertukar data melalui ${endpoints.length} permintaan utama, misalnya mengambil daftar data, menyimpan perubahan, dan menampilkan ringkasan.`
        : 'Aplikasi ini tidak menyimpan data, sehingga tidak banyak komunikasi data yang dibutuhkan.',
      endpoints,
    },
    prd: buildPrd({ project, platform, users, roles, features, pages, login: loginRequired, hasData, deployment, designStyle }),
    buildPrompt: buildPrompt({
      project,
      platform,
      features,
      pages,
      tables,
      endpoints,
      login: loginRequired,
      hasData,
      deployment,
      designStyle,
    }),
    stepPrompts: buildStepPrompts(project, features, tables, loginRequired),
    generatedAt: Date.now(),
  };
}

export const PROMPT_TARGETS = ['Generic', 'Claude Code', 'Codex', 'Cursor', 'Lovable', 'Replit'] as const;

export type PromptTarget = (typeof PROMPT_TARGETS)[number];

const TARGET_INTRO: Record<string, string> = {
  Generic:
    'Gunakan dokumen ini sebagai spesifikasi lengkap. Implementasikan aplikasi secara bertahap dan pastikan setiap bagian terpenuhi.',
  'Claude Code':
    'Baca PRD di bawah ini, lalu implementasikan langkah demi langkah langsung di repo. Jalankan test di setiap tahap dan tanyakan jika ada bagian yang ambigu.',
  Codex:
    'Gunakan PRD ini sebagai kontrak implementasi. Hasilkan kode yang bisa dijalankan, lengkap dengan migrasi database dan endpoint API.',
  Cursor:
    'Jadikan PRD ini acuan utama saat menulis kode di editor. Implementasikan per fitur dan jaga konsistensi struktur project.',
  Lovable:
    'Bangun aplikasi sesuai PRD ini dengan fokus pada tampilan yang rapi dan alur pengguna yang jelas.',
  Replit:
    'Bangun aplikasi dari PRD ini di Replit, mulai dari struktur project, database, lalu fitur utama.',
};

function targetIntro(target: string): string {
  return TARGET_INTRO[target] ?? TARGET_INTRO.Generic;
}

export function buildPrdPrompt(project: Project, target = 'Generic'): string {
  const result = buildResult(project);
  const lines: string[] = [];

  lines.push(`# ${project.name} — PRD & BUILD PROMPT`, '');
  lines.push(`> Target AI coding: **${target}**`, '');
  lines.push(targetIntro(target), '');

  result.prd.forEach((section, index) => {
    lines.push(`## ${index + 1}. ${section.title}`, '');
    section.body.forEach((paragraph) => lines.push(`- ${paragraph}`));
    lines.push('');
  });

  lines.push('---', '', '# LAMPIRAN TEKNIS', '');

  lines.push('## A. Fitur & Subfitur', '');
  result.features.forEach((feature) => {
    lines.push(`### ${feature.title}`, feature.description, '');
    feature.items.forEach((item) => lines.push(`- ${item}`));
    lines.push('');
  });

  lines.push('## B. Teknologi', '');
  result.stack.forEach((item) => lines.push(`- ${item.label}: ${item.value}`));
  lines.push('');

  lines.push('## C. Basis Data', '');
  if (result.database.tables.length === 0) {
    lines.push('- Tidak memerlukan basis data.', '');
  } else {
    result.database.tables.forEach((table) => {
      lines.push(`### ${table.name}`, table.description, '');
      table.columns.forEach((column) =>
        lines.push(`- ${column.name} (${column.type})${column.note ? ` — ${column.note}` : ''}`),
      );
      lines.push('');
    });
  }

  lines.push('## D. API', '');
  if (result.api.endpoints.length === 0) {
    lines.push('- Tidak memerlukan API.', '');
  } else {
    result.api.endpoints.forEach((endpoint) =>
      lines.push(`- ${endpoint.method} ${endpoint.path} — ${endpoint.description}`),
    );
    lines.push('');
  }

  lines.push('## E. Halaman', '');
  result.pages.forEach((page) => lines.push(`- ${page.path} — ${page.label}`));
  lines.push('');

  lines.push('## F. Pemasangan & Penerapan', '', `- ${result.deployment}`, '');
  lines.push('## G. Gaya Tampilan', '', `- ${result.designStyle}`, '');

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
