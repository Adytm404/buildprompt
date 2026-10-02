import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { AppLogo } from '@/components/layout/AppLogo';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0B0F]/80 border-b border-white/10 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <AppLogo dark />

          {/* Center Links */}
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
            <Link to="/pricing" className="transition hover:text-white flex items-center gap-1">
              <span>Harga</span>
              <span className="rounded-full bg-purple-500/20 border border-purple-400/30 px-1.5 py-0.2 text-[9px] font-bold text-purple-300">
                PRO
              </span>
            </Link>
          </nav>
        </div>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/pricing"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200 hover:bg-purple-500/20 transition"
              >
                <span>{user.plan === 'free' ? 'Upgrade Paket' : 'Paket Pro Aktif'}</span>
              </Link>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 px-3 text-xs text-white/80">
                <User size={13} className="text-white/40" />
                <span className="max-w-[100px] truncate font-medium">{user.name}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="ml-1 text-white/40 hover:text-rose-400 transition"
                  title="Keluar"
                >
                  <LogOut size={12} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-[14px] font-medium text-white/70 transition hover:text-white"
            >
              Masuk
            </Link>
          )}

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
