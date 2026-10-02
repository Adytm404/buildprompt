import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, Plus, Sparkles, UserCircle, X } from 'lucide-react';
import { AppLogo } from '@/components/layout/AppLogo';
import { useAuth } from '@/context/AuthContext';
import { GLOBAL_NAV_ITEMS, type NavItem } from '@/data/navigation';
import { cn } from '@/lib/utils';

export interface AppSidebarProps {
  projectName?: string;
  projectItems?: NavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onClose?: () => void;
  onSettings?: () => void;
  className?: string;
}

export function AppSidebar({
  projectName,
  projectItems,
  activeId,
  onSelect,
  onClose,
  onSettings: _onSettings,
  className,
}: AppSidebarProps) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isGlobalActive = (item: NavItem) => {
    if (projectName) return false;
    if (item.to) {
      if (item.to === '/dashboard/projects/all') return location.pathname.startsWith('/dashboard/projects/all') || location.pathname.startsWith('/projects/all');
      if (item.to === '/dashboard/projects') return location.pathname === '/dashboard/projects' || location.pathname === '/dashboard' || location.pathname === '/projects';
      if (item.to === '/dashboard/pricing') return location.pathname === '/dashboard/pricing' || location.pathname === '/pricing';
      if (item.to === '/new') return location.pathname === '/new';
      return location.pathname === item.to;
    }
    return activeId === item.id;
  };

  const renderItem = (item: NavItem, isContextual = false) => {
    const Icon = item.icon;
    const active = isContextual ? activeId === item.id : isGlobalActive(item);

    const buttonClass = cn(
      'group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition-all duration-150',
      item.disabled
        ? 'cursor-not-allowed text-white/20 opacity-40'
        : active
          ? 'bg-white/10 text-white font-semibold shadow-inner'
          : 'text-white/65 hover:bg-white/[0.06] hover:text-white',
    );

    const iconClass = cn(
      'shrink-0 transition-colors',
      item.disabled ? 'text-white/20' : active ? 'text-white' : 'text-white/45 group-hover:text-white/80',
    );

    const content = (
      <>
        <Icon size={15} className={iconClass} />
        <span className="truncate">{item.label}</span>
        {item.badge ? (
          <span className="ml-auto rounded-full bg-pink-500/20 border border-pink-500/30 px-1.5 py-0.5 text-[9px] font-medium text-pink-300">
            {item.badge}
          </span>
        ) : null}
      </>
    );

    if (item.disabled) {
      return (
        <span key={item.id} className={buttonClass} aria-disabled="true">
          {content}
        </span>
      );
    }

    if (item.to) {
      return (
        <Link
          key={item.id}
          to={item.to}
          onClick={onClose}
          className={buttonClass}
          aria-current={active ? 'page' : undefined}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          if (item.onClick) item.onClick();
          if (onSelect) onSelect(item.id);
          if (onClose) onClose();
        }}
        className={buttonClass}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        'flex h-full w-56 flex-col border-r border-white/10 bg-[#0B0C10] select-none text-white',
        className,
      )}
    >
      {/* Top Workspace Selector (Lovable Gambar 3 style) */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <AppLogo withText={false} dark />
          <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-white/5 cursor-pointer transition min-w-0">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shrink-0">
              B
            </span>
            <span className="truncate text-xs font-semibold text-white/90">
              {projectName || 'Studio buildprompt'}
            </span>
            <ChevronDown size={12} className="text-white/40 shrink-0" />
          </div>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/50 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {/* Prominent "+ New" Button (Gambar 3 style) */}
        <Link
          to="/new"
          onClick={onClose}
          className="flex w-full items-center gap-2 rounded-lg bg-white/[0.08] border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15 active:scale-[0.98]"
        >
          <Plus size={15} />
          <span>Proyek Baru</span>
        </Link>

        {/* Global Navigation */}
        <div>
          <nav className="space-y-0.5">
            {GLOBAL_NAV_ITEMS.filter((i) => i.id !== 'new').map((item) => renderItem(item, false))}
          </nav>
        </div>

        {/* Contextual Project Sections */}
        {projectName && projectItems && projectItems.length > 0 ? (
          <div className="pt-2 border-t border-white/10">
            <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Bagian Proyek
            </p>
            <nav className="space-y-0.5">
              {projectItems.map((item) => renderItem(item, true))}
            </nav>
          </div>
        ) : null}
      </div>

      {/* Bottom Area: Status & Profile Card (Gambar 3 style) */}
      <div className="border-t border-white/10 p-2.5 space-y-2">
        {/* Subscription Plan & Usage Status Card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-left">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
              <Sparkles size={12} className="text-pink-400" />
              {user ? (user.plan === 'free' ? 'Paket Gratis' : user.plan === 'pro_monthly' ? 'Paket Pro Bulanan' : 'Paket Pro 3 Bulan') : 'Studio AI'}
            </span>
            <span className="text-[10px] font-mono text-purple-300 font-bold">
              {user?.plan === 'free' ? '1x / hari' : user ? 'Unlimited' : 'Aktif'}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px]">
            <span className="text-white/40">
              {user?.plan === 'free' ? 'Maks. 5x / bulan' : user ? 'Bebas Kuota' : 'DeepSeek v4.1 Siap'}
            </span>
            <Link
              to="/dashboard/pricing"
              onClick={onClose}
              className="font-medium text-purple-400 hover:text-purple-300 transition"
            >
              {user?.plan === 'free' ? 'Upgrade →' : 'Kelola →'}
            </Link>
          </div>
        </div>

        {/* Bottom Profile Pill */}
        <div className="flex items-center justify-between pt-1">
          {isAuthenticated && user ? (
            <div className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs text-white/80">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-[10px] font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="truncate text-xs font-medium text-white/80" title={user.email}>
                  {user.name}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="text-white/40 hover:text-rose-400 transition p-1"
                title="Keluar akun"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium text-white/70 hover:bg-white/5 hover:text-white transition"
            >
              <UserCircle size={17} className="text-white/50" />
              <span>Masuk Akun</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
