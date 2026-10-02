import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { AppLogo } from '@/components/layout/AppLogo';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DitherWave } from '@/components/landing/DitherWave';
import { Drawer } from '@/components/ui/Drawer';
import type { NavItem } from '@/data/navigation';
import { cn } from '@/lib/utils';

export interface SidebarLayoutProps {
  projectName?: string;
  projectItems?: NavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onSettings?: () => void;
  title?: ReactNode;
  actions?: ReactNode;
  contentClassName?: string;
  children: ReactNode;
}

export function SidebarLayout({
  projectName,
  projectItems,
  activeId,
  onSelect,
  onSettings,
  title,
  actions,
  contentClassName,
  children,
}: SidebarLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0A0B0F] text-white">
      {/* Desktop Sticky Dark Sidebar (Lovable Gambar 3) */}
      <div className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen">
          <AppSidebar
            projectName={projectName}
            projectItems={projectItems}
            activeId={activeId}
            onSelect={onSelect}
            onSettings={onSettings}
          />
        </div>
      </div>

      {/* Main Content Area with Dark Studio Canvas */}
      <div className="relative flex flex-1 flex-col min-w-0 aurora-bg-dark overflow-x-hidden">
        {/* Subtle Animated Dither Wave Ambient Accent across /projects and /projects/* */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 overflow-hidden opacity-25 z-0">
          <DitherWave
            pixelSize={6}
            speed={0.4}
            primaryColor="#7C3AED"
            secondaryColor="#3B0764"
            waveBaseHeight={0.4}
            amplitude={32}
            ditherDepth={65}
            interactive={false}
          />
        </div>

        {/* Mobile Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0B0C10]/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Buka menu navigasi"
            >
              <Menu size={18} />
            </button>
            {title ? (
              <div className="truncate text-sm font-semibold text-white">{title}</div>
            ) : (
              <AppLogo dark />
            )}
          </div>
          {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
        </header>

        {/* Page Content */}
        <main className={cn('relative z-10 flex-1 min-w-0', contentClassName)}>{children}</main>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <AppSidebar
          projectName={projectName}
          projectItems={projectItems}
          activeId={activeId}
          onSelect={onSelect}
          onSettings={onSettings}
          onClose={() => setMobileOpen(false)}
          className="border-r-0 w-full max-w-none"
        />
      </Drawer>
    </div>
  );
}
