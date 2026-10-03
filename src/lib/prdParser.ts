import { buildResult } from '@/lib/blueprint';
import { slugify } from '@/lib/utils';
import type {
  ApiEndpoint,
  DatabaseSimple,
  DatabaseTable,
  PageItem,
  Project,
  ResultData,
  ResultFeature,
  StackItem,
} from '@/types';

/**
 * Splits a markdown document into top-level sections delimited by `## `.
 */
function splitSections(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = markdown.split('\n');
  let currentKey = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      if (currentKey) {
        sections.set(currentKey, currentContent.join('\n').trim());
      }
      // e.g. "## 1. Ringkasan Produk" -> "1. ringkasan produk"
      currentKey = trimmed.slice(3).trim().toLowerCase();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentKey) {
    sections.set(currentKey, currentContent.join('\n').trim());
  }

  return sections;
}

/**
 * Finds a section by matching one or more keyword substrings.
 */
function findSectionContent(sections: Map<string, string>, keywords: string[]): string {
  for (const [key, content] of sections.entries()) {
    for (const kw of keywords) {
      if (key.includes(kw)) {
        return content;
      }
    }
  }
  return '';
}

/**
 * Parses ## 1. Ringkasan Produk into clean paragraph text.
 */
function parseSummary(content: string, fallback: string): string {
  if (!content) return fallback;
  const lines = content.split('\n');
  const paragraphs: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    // Strip leading list bullet if any
    const clean = trimmed.replace(/^[-*•]\s+/, '').trim();
    if (clean) paragraphs.push(clean);
  }

  return paragraphs.slice(0, 3).join(' ') || fallback;
}

/**
 * Parses ## 3. Target Users & Roles into roles and user names.
 */
function parseUsersAndRoles(content: string): { users: string[]; roles: { title: string; description: string }[] } {
  const roles: { title: string; description: string }[] = [];
  const users: string[] = [];
  if (!content) return { users, roles };

  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-') && !trimmed.startsWith('*')) continue;

    // Pattern: - **Owner** — Deskripsi role
    const boldMatch = trimmed.match(/^[-*]\s+\*\*([^*]+)\*\*[:—\-]?\s*(.*)$/);
    if (boldMatch) {
      const title = boldMatch[1].trim();
      const description = boldMatch[2].trim() || 'Pengguna sistem';
      roles.push({ title, description });
      users.push(title);
      continue;
    }

    // Pattern: - Owner — Deskripsi role
    const dashMatch = trimmed.match(/^[-*]\s+([^—:\-]+)[—:\-]\s*(.*)$/);
    if (dashMatch) {
      const title = dashMatch[1].trim();
      const description = dashMatch[2].trim() || 'Pengguna sistem';
      roles.push({ title, description });
      users.push(title);
    }
  }

  return { users, roles };
}

/**
 * Parses ## 6. Tech Stack into structured items with appropriate icons.
 */
function parseStack(content: string): StackItem[] {
  const stack: StackItem[] = [];
  if (!content) return stack;

  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-') && !trimmed.startsWith('*')) continue;

    const match = trimmed.match(/^[-*]\s+\*{0,2}([^:*]+)\*{0,2}[:—\-]\s*(.+)$/);
    if (!match) continue;

    const label = match[1].trim();
    const value = match[2].trim().replace(/^\*\*|\*\*$/g, '');
    const lowerLabel = label.toLowerCase();

    let icon = 'Server';
    if (lowerLabel.includes('framework') || lowerLabel.includes('frontend') || lowerLabel.includes('antarmuka')) {
      icon = 'Atom';
    } else if (lowerLabel.includes('database') || lowerLabel.includes('basis data')) {
      icon = 'Database';
    } else if (lowerLabel.includes('hosting') || lowerLabel.includes('deploy') || lowerLabel.includes('cloud')) {
      icon = 'Cloud';
    } else if (lowerLabel.includes('styling') || lowerLabel.includes('css')) {
      icon = 'Layers';
    } else if (lowerLabel.includes('auth') || lowerLabel.includes('keamanan')) {
      icon = 'SquareTerminal';
    }

    stack.push({ label, value, icon });
  }

  return stack;
}

/**
 * Parses ## 9. Fitur Utama into subsections with descriptions and sub-items.
 */
function parseFeatures(content: string): ResultFeature[] {
  const features: ResultFeature[] = [];
  if (!content) return features;

  const lines = content.split('\n');
  let currentFeature: ResultFeature | null = null;
  const descBuffer: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Subsection header: ### 9.1 Kasir / POS (`/pos`) or ### Manajemen Produk
    if (trimmed.startsWith('### ')) {
      if (currentFeature) {
        currentFeature.description = descBuffer.join(' ').trim() || currentFeature.description;
        features.push(currentFeature);
        descBuffer.length = 0;
      }

      const rawTitle = trimmed.slice(4).trim();
      // Remove numbering like "9.1 " or "1. " and route badges like "(`/pos`)"
      const cleanTitle = rawTitle
        .replace(/^\d+(\.\d+)*\s*[:.\-]?\s*/, '')
        .replace(/\s*\([^)]*\)\s*$/, '')
        .trim();

      currentFeature = {
        id: slugify(cleanTitle) || `feature-${features.length + 1}`,
        title: cleanTitle,
        description: '',
        items: [],
      };
      continue;
    }

    if (!currentFeature) continue;

    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const itemText = trimmed.replace(/^[-*]\s+/, '').trim();
      if (itemText) {
        currentFeature.items.push(itemText);
      }
    } else if (trimmed && !trimmed.startsWith('#')) {
      descBuffer.push(trimmed);
    }
  }

  if (currentFeature) {
    currentFeature.description = descBuffer.join(' ').trim() || currentFeature.description;
    features.push(currentFeature);
  }

  return features;
}

/**
 * Parses ## 10. Halaman into PageItem routes with automatic grouping.
 */
function parsePages(content: string): PageItem[] {
  const pages: PageItem[] = [];
  if (!content) return pages;

  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-') && !trimmed.startsWith('*')) continue;

    // Pattern: - `/dashboard` — Halaman ringkasan penjualan
    const match = trimmed.match(/`(\/[^`]+)`\s*[—:\-]?\s*(.*)/);
    if (!match) continue;

    const path = match[1].trim();
    const label = match[2].trim() || path;

    let group = 'Halaman Utama';
    if (path.startsWith('/admin') || path.includes('kelola') || path.includes('settings')) {
      group = 'Pengaturan & Admin';
    } else if (path.startsWith('/pos') || path.startsWith('/kasir') || path.startsWith('/transaksi')) {
      group = 'Operasional';
    } else if (path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/auth')) {
      group = 'Autentikasi';
    } else if (path.startsWith('/laporan') || path.startsWith('/reports') || path.startsWith('/statistik')) {
      group = 'Laporan & Analitik';
    }

    pages.push({ path, label, group });
  }

  return pages;
}

/**
 * Parses ## 13. Database into DatabaseTable[] with columns, types, and notes.
 */
function parseDatabaseTables(content: string): { tables: DatabaseTable[]; simple: DatabaseSimple[] } {
  const tables: DatabaseTable[] = [];
  const simple: DatabaseSimple[] = [];
  if (!content) return { tables, simple };

  const lines = content.split('\n');
  let currentTable: DatabaseTable | null = null;
  const descBuffer: string[] = [];

  const flushTable = () => {
    if (currentTable) {
      currentTable.description = descBuffer.join(' ').trim() || `${currentTable.columns.length} kolom data`;
      tables.push(currentTable);
      simple.push({
        title: currentTable.name,
        description: currentTable.description,
      });
      descBuffer.length = 0;
      currentTable = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Table header forms:
    // ### Tabel `users`
    // ### users
    // **users**
    // #### `products`
    const isHeadingTable =
      trimmed.startsWith('### ') || trimmed.startsWith('#### ') || /^(\*\*|__)[a-zA-Z0-9_]+(\*\*|__)$/.test(trimmed);

    if (isHeadingTable && !trimmed.toLowerCase().includes('skema') && !trimmed.toLowerCase().includes('relasi')) {
      flushTable();
      const rawName = trimmed
        .replace(/^#+\s*(Tabel\s*)?/i, '')
        .replace(/[*_`]/g, '')
        .trim();

      currentTable = {
        name: rawName,
        description: '',
        columns: [],
      };
      continue;
    }

    if (!currentTable) continue;

    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      // Parse column bullet:
      // - `id` Int PK autoincrement
      // - `name` String (nama barang)
      // - `category_id` Int? FK → categories.id
      const colMatch = trimmed.match(/^[-*]\s+`?([a-zA-Z0-9_]+)`?\s+([a-zA-Z0-9_?]+)?\s*(.*)$/);
      if (colMatch) {
        const name = colMatch[1].trim();
        const type = colMatch[2]?.trim() || 'String';
        let note = colMatch[3]?.trim() || '';
        // clean surrounding parentheses if present
        note = note.replace(/^\((.*)\)$/, '$1').replace(/^—\s*/, '').trim();

        currentTable.columns.push({
          name,
          type,
          note: note || undefined,
        });
      }
    } else if (trimmed && !trimmed.startsWith('#')) {
      descBuffer.push(trimmed);
    }
  }

  flushTable();
  return { tables, simple };
}

/**
 * Parses ## 14. API into ApiEndpoint[] with method, path, and description.
 */
function parseApiEndpoints(content: string): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = [];
  if (!content) return endpoints;

  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-') && !trimmed.startsWith('*')) continue;

    // Pattern: - `GET /api/products` — Mengambil daftar produk
    // Pattern: - POST /api/pos/checkout: Proses transaksi kasir
    const match = trimmed.match(
      /(GET|POST|PUT|PATCH|DELETE)\s+`?(\/[a-zA-Z0-9_\-/:*{}]+)`?\s*[—:\-]?\s*(.*)/i,
    );
    if (!match) continue;

    const method = match[1].toUpperCase() as ApiEndpoint['method'];
    const path = match[2].trim();
    const description = match[3].trim() || `Endpoint ${method} ${path}`;

    endpoints.push({ method, path, description });
  }

  return endpoints;
}

/**
 * Reads project.prdPrompt and parses all sections into a full ResultData object.
 * If project.prdPrompt is not available or empty, gracefully falls back to buildResult(project).
 */
export function parsePrdToResult(project: Project): ResultData {
  const fallback = buildResult(project);
  const prompt = project.prdPrompt?.trim();

  // If no AI prompt exists yet, use the heuristic blueprint
  if (!prompt || prompt.length < 100) {
    return fallback;
  }

  try {
    const sections = splitSections(prompt);

    // 1. Ringkasan & Problem
    const summaryRaw = findSectionContent(sections, ['ringkasan', 'ikhtisar', 'overview']);
    const summary = parseSummary(summaryRaw, fallback.summary);

    // 2. Target Users & Roles
    const usersRaw = findSectionContent(sections, ['target users', 'target pengguna', 'users & roles', 'pengguna']);
    const parsedUsers = parseUsersAndRoles(usersRaw);
    const users = parsedUsers.users.length > 0 ? parsedUsers.users : fallback.users;
    const roles = parsedUsers.roles.length > 0 ? parsedUsers.roles : fallback.roles;

    // 3. Tech Stack
    const stackRaw = findSectionContent(sections, ['tech stack', 'teknologi', 'stack']);
    const parsedStack = parseStack(stackRaw);
    const stack = parsedStack.length > 0 ? parsedStack : fallback.stack;

    // 4. Fitur Utama
    const featuresRaw = findSectionContent(sections, ['fitur utama', 'fitur']);
    const parsedFeatures = parseFeatures(featuresRaw);
    const features = parsedFeatures.length > 0 ? parsedFeatures : fallback.features;

    // 5. Halaman
    const pagesRaw = findSectionContent(sections, ['halaman', 'pages', 'struktur halaman']);
    const parsedPages = parsePages(pagesRaw);
    const pages = parsedPages.length > 0 ? parsedPages : fallback.pages;

    // 6. Database
    const dbRaw = findSectionContent(sections, ['database', 'basis data', 'skema database', 'skema']);
    const parsedDb = parseDatabaseTables(dbRaw);
    const tables = parsedDb.tables.length > 0 ? parsedDb.tables : fallback.database.tables;
    const simpleDb = parsedDb.simple.length > 0 ? parsedDb.simple : fallback.database.simple;

    // 7. API Endpoints
    const apiRaw = findSectionContent(sections, ['api', 'endpoint', 'rest api']);
    const endpoints = parseApiEndpoints(apiRaw);
    const apiEndpoints = endpoints.length > 0 ? endpoints : fallback.api.endpoints;

    return {
      ...fallback,
      summary,
      users,
      roles,
      stack,
      features,
      pages,
      database: {
        simple: simpleDb,
        tables,
      },
      api: {
        simple: `Aplikasi ini bertukar data melalui ${apiEndpoints.length} endpoint utama.`,
        endpoints: apiEndpoints,
      },
      // Keep prd sections aligned
      prd: fallback.prd,
    };
  } catch {
    return fallback;
  }
}
