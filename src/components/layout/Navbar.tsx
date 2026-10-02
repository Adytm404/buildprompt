import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { AppLogo } from '@/components/layout/AppLogo';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0B0F]/80 border-b border-white/10 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Lovable-style Logo */}
        <div className="flex items-center gap-8">
          <AppLogo dark />

          {/* Center Links (Lovable style) */}
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-white/70">
            <div className="flex items-center gap-1 cursor-pointer transition hover:text-white">
              <span>Fitur</span>
              <ChevronDown size={14} className="opacity-50" />
            </div>
            <div className="flex items-center gap-1 cursor-pointer transition hover:text-white">
              <span>Alur AI</span>
              <ChevronDown size={14} className="opacity-50" />
            </div>
            <Link to="/projects/all" className="transition hover:text-white">
              Proyek
            </Link>
            <span className="cursor-pointer transition hover:text-white">Templat</span>
          </nav>
        </div>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-[14px] font-medium text-white/70 transition hover:text-white"
          >
            Masuk
          </Link>
          <Link
            to="/new"
            className="hidden sm:inline-flex items-center rounded-full bg-white px-4 py-2 text-[14px] font-medium text-black transition hover:bg-white/90 shadow-sm active:scale-95"
          >
            Mulai sekarang
          </Link>
        </div>
      </div>
    </header>
  );
}
