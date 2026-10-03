import { ArrowLeft, ArrowUp, Github, Lock, ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppLogo } from '@/components/layout/AppLogo';
import { DitherWave } from '@/components/landing/DitherWave';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const rawRedirect = searchParams.get('redirect');
  const redirectTarget = rawRedirect ? decodeURIComponent(rawRedirect) : '/dashboard/projects';

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast({
        title: 'Berhasil masuk',
        description: 'Selamat datang di buildprompt Studio.',
        variant: 'success',
      });
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      toast({
        title: 'Gagal masuk',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthNotice = () => {
    toast({
      title: 'Segera hadir',
      description: 'Masuk dengan Google dan GitHub sedang disiapkan. Gunakan email dan kata sandi untuk sekarang.',
      variant: 'default',
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white flex flex-col md:grid md:grid-cols-2">
      {/* Left Column: Form Section */}
      <div className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 border-b md:border-b-0 md:border-r border-white/10 bg-[#0E0F15]">
        <div>
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke beranda</span>
          </Link>

          <div className="mb-6">
            <AppLogo dark />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Masuk</h1>
          <p className="mt-1 text-xs sm:text-sm text-white/50">
            Masuk untuk menyimpan dan mengelola seluruh dokumen PRD proyek Anda.
          </p>

          {rawRedirect && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2.5 text-xs text-purple-200">
              <ShieldCheck size={16} className="text-purple-400 shrink-0" />
              <span>Silakan masuk terlebih dahulu untuk mengakses halaman langganan.</span>
            </div>
          )}

          {/* Social Logins (segera hadir) */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={handleOAuthNotice}
              disabled
              className="relative flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.02] py-2.5 px-4 text-xs font-semibold text-white/50 cursor-not-allowed"
            >
              <svg className="h-4 w-4 shrink-0 opacity-60" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9c-.2-.8-.4-1.6-.4-2.4z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17C3.7 20.7 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>Lanjutkan dengan Google</span>
              <span className="absolute right-3 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/50">
                Segera hadir
              </span>
            </button>

            <button
              type="button"
              onClick={handleOAuthNotice}
              disabled
              className="relative flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.02] py-2.5 px-4 text-xs font-semibold text-white/50 cursor-not-allowed"
            >
              <Github size={15} />
              <span>Lanjutkan dengan GitHub</span>
              <span className="absolute right-3 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/50">
                Segera hadir
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/35">ATAU</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-white/70 mb-1.5">
                Alamat email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-medium text-white/70">
                  Kata sandi
                </label>
                <span className="text-[11px] text-pink-400 hover:text-pink-300 transition cursor-pointer">
                  Lupa sandi?
                </span>
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 outline-none transition focus:border-white/40 focus:ring-1 focus:ring-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full rounded-full bg-white py-2.5 text-xs sm:text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50 active:scale-[0.99] shadow-md mt-2"
            >
              {loading ? 'Memproses...' : 'Masuk ke Akun'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-white/40 space-y-2">
          <p>
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-white font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
          <p className="flex items-center justify-center gap-1 text-[11px] text-white/30">
            <Lock size={11} />
            SSO dan proteksi tingkat perusahaan tersedia
          </p>
        </div>
      </div>

      {/* Right Column: Studio Canvas with Animated Dither Wave Accent */}
      <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden bg-[#0A0512] p-10 lg:p-16">
        {/* Animated Dither Wave Canvas Background */}
        <div className="absolute inset-0 z-0">
          <DitherWave
            pixelSize={5}
            speed={0.65}
            primaryColor="#6D28D9"
            secondaryColor="#3B0764"
            backgroundColor="#0A0512"
            waveBaseHeight={0.65}
            amplitude={50}
            ditherDepth={85}
            interactive={true}
          />
        </div>

        {/* Ambient Top & Bottom Vignettes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 z-0 bg-gradient-to-b from-[#0A0512] via-[#0A0512]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 z-0 bg-gradient-to-t from-[#0A0512] to-transparent" />

        {/* Floating Mockup Card */}
        <div className="relative z-10 w-full max-w-sm rounded-[24px] border border-purple-500/25 bg-[#120F22]/90 p-5 shadow-[0_16px_50px_rgba(109,40,217,0.25)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-white/80">PRD Architecture Engine</span>
            </div>
            <span className="rounded-md border border-purple-400/20 bg-purple-500/15 px-1.5 py-0.5 text-[9px] font-mono text-purple-200">
              Next.js + SQLite
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-[#090A0E] p-3 font-mono text-[11px] text-white/70 space-y-1.5">
            <p className="text-purple-300 font-bold"># Kasir Warung — PRD</p>
            <p className="text-white/40">&gt; Target: Cursor &amp; Claude Code</p>
            <p className="text-emerald-400">## 1. Skema Basis Data SQLite</p>
            <p className="text-white/60">- transactions (id, user_id, total)</p>
            <p className="text-white/60">- stock_movements (id, qty, type)</p>
            <p className="text-emerald-400">## 2. Next.js API Routes</p>
            <p className="text-white/60">POST /api/pos/checkout</p>
          </div>

          {/* Floating Pill Input */}
          <div className="mt-4 flex items-center justify-between gap-2 rounded-full border border-purple-400/25 bg-[#0A0B0E] p-1.5 pl-3">
            <span className="text-xs text-white/60 truncate font-sans">
              Minta buildprompt menyusun prototipe...
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white shrink-0 shadow">
              <ArrowUp size={13} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
