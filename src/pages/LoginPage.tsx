import { ArrowLeft, ArrowUp, Github, Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLogo } from '@/components/layout/AppLogo';
import { useToast } from '@/components/ui/ToastProvider';

export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Berhasil masuk',
        description: 'Selamat datang kembali di buildprompt Studio.',
        variant: 'success',
      });
      navigate('/projects');
    }, 600);
  };

  const handleOAuth = (provider: string) => {
    toast({
      title: `Masuk dengan ${provider}`,
      description: `Autentikasi sosial ${provider} berhasil (mode demo).`,
      variant: 'success',
    });
    navigate('/projects');
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

          {/* Social Logins */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={() => handleOAuth('Google')}
              className="relative flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.04] py-2.5 px-4 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
              <span className="absolute right-3 rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-semibold text-blue-400">
                Terakhir digunakan
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('GitHub')}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.04] py-2.5 px-4 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
            >
              <Github size={15} />
              <span>Lanjutkan dengan GitHub</span>
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
              disabled={loading || !email.trim()}
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

      {/* Right Column: Aurora Glow Studio Canvas (Gambar 2 style) */}
      <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden bg-[#07080B] p-10 lg:p-16">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -top-1/4 -right-1/4 h-96 w-96 rounded-full bg-blue-600/30 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-pink-600/35 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-purple-600/30 blur-[100px]" />

        {/* Floating Mockup Card */}
        <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/15 bg-[#12141D]/90 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-white/80">PRD Architecture Engine</span>
            </div>
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-mono text-white/40">
              Markdown Ready
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-[#090A0E] p-3 font-mono text-[11px] text-white/70 space-y-1.5">
            <p className="text-pink-400 font-bold"># Kasir Warung — PRD</p>
            <p className="text-white/40">&gt; Target: Cursor &amp; Claude Code</p>
            <p className="text-emerald-400">## 1. Skema Basis Data</p>
            <p className="text-white/60">- transactions (id, user_id, total)</p>
            <p className="text-white/60">- stock_movements (id, qty, type)</p>
            <p className="text-emerald-400">## 2. API Endpoints</p>
            <p className="text-white/60">POST /api/pos/checkout</p>
          </div>

          {/* Floating Pill Input */}
          <div className="mt-4 flex items-center justify-between gap-2 rounded-full border border-white/15 bg-[#0A0B0E] p-1.5 pl-3">
            <span className="text-xs text-white/60 truncate">
              Minta buildprompt menyusun prototipe...
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shrink-0 shadow">
              <ArrowUp size={13} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
