import {
  ArrowLeft,
  ClipboardList,
  Cpu,
  CreditCard,
  Database,
  FileText,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  MessagesSquare,
  Network,
  PlusCircle,
  Settings,
  Sparkles,
  SquareTerminal,
  UserCircle,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
}

export const GLOBAL_NAV_ITEMS: NavItem[] = [
  { id: 'new', label: 'Proyek Baru', icon: PlusCircle, to: '/new' },
  { id: 'studio', label: 'Studio AI', icon: MessagesSquare, to: '/projects' },
  { id: 'projects', label: 'Semua Proyek', icon: LayoutGrid, to: '/projects/all' },
  { id: 'pricing', label: 'Paket Langganan', icon: CreditCard, to: '/pricing' },
];

export function projectReviewNavItems(projectId: string): NavItem[] {
  return [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'features', label: 'Fitur', icon: Sparkles },
    { id: 'pages', label: 'Halaman', icon: Layers },
    { id: 'database', label: 'Basis Data', icon: Database },
    { id: 'api', label: 'API', icon: Network },
    { id: 'prd', label: 'PRD', icon: FileText },
    { id: 'stack', label: 'Teknologi', icon: Cpu },
    { id: 'prompt', label: 'Prompt PRD', icon: SquareTerminal, to: `/project/${projectId}/prompt` },
  ];
}

export function projectPromptNavItems(projectId: string): NavItem[] {
  return [
    { id: 'prompt', label: 'Prompt PRD', icon: SquareTerminal },
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard, to: `/project/${projectId}/review?section=overview` },
    { id: 'features', label: 'Fitur', icon: Sparkles, to: `/project/${projectId}/review?section=features` },
    { id: 'pages', label: 'Halaman', icon: Layers, to: `/project/${projectId}/review?section=pages` },
    { id: 'database', label: 'Basis Data', icon: Database, to: `/project/${projectId}/review?section=database` },
    { id: 'api', label: 'API', icon: Network, to: `/project/${projectId}/review?section=api` },
    { id: 'prd', label: 'PRD', icon: FileText, to: `/project/${projectId}/review?section=prd` },
    { id: 'stack', label: 'Teknologi', icon: Cpu, to: `/project/${projectId}/review?section=stack` },
  ];
}

export function projectInterviewNavItems(_projectId: string): NavItem[] {
  return [
    { id: 'interview', label: 'Wawancara', icon: MessagesSquare },
    { id: 'review', label: 'Cetak Biru', icon: ClipboardList, disabled: true },
    { id: 'prompt', label: 'Prompt PRD', icon: SquareTerminal, disabled: true },
  ];
}

export const ICONS = {
  settings: Settings,
  back: ArrowLeft,
  signIn: UserCircle,
};
