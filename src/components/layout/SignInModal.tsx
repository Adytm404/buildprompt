import { AnimatePresence, motion } from 'framer-motion';
import { Apple, ArrowUp, Github, Lock, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { AppLogo } from '@/components/layout/AppLogo';
import { useToast } from '@/components/ui/ToastProvider';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onClose();
      setEmail('');
      toast({
        title: 'Selamat datang di demo',
        description: 'Autentikasi tersimulasi berhasil.',
        variant: 'success',
      });
    }, 600);
  };

  const handleOAuth = (provider: string) => {
    toast({
      title: `Login ${provider}`,
      description: 'Login sosial tersimulasi aktif untuk demo.',
      variant: 'success',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container: Split Screen ala Gambar 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 grid w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0E0F15] shadow-2xl md:grid-cols-2"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3.5 top-3.5 z-20 rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Tutup"
            >
              <X size={17} />
            </button>

            {/* Left Side: Dark Form (Gambar 2 kiri) */}
            <div className="flex flex-col justify-between p-6 sm:p-8 text-white">
              <div>
                <div className="mb-4">
                  <AppLogo dark />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Masuk</h2>
                <p className="mt-1 text-xs text-white/50">Masuk untuk mengelola seluruh dokumen PRD proyek Anda.</p>

                {/* Social Login Pills */}
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleOAuth('Google')}
                    className="relative flex w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] py-2 px-4 text-xs font-medium text-white transition hover:bg-white/10 active:scale-[0.99]"
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
                    <span className="absolute right-3 rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-medium text-blue-400">
                      Terakhir digunakan
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth('GitHub')}
                    className="flex w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] py-2 px-4 text-xs font-medium text-white transition hover:bg-white/10 active:scale-[0.99]"
                  >
                    <Github size={15} />
                    <span>Lanjutkan dengan GitHub</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuth('Apple')}
                    className="flex w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] py-2 px-4 text-xs font-medium text-white transition hover:bg-white/10 active:scale-[0.99]"
                  >
                    <Apple size={15} />
                    <span>Lanjutkan dengan Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] font-medium uppercase text-white/35">ATAU</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Email Form */}
                <form onSubmit={handleContinue} className="space-y-2.5">
                  <div>
                    <label htmlFor="auth-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Alamat email"
                      className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs text-white placeholder:text-white/35 outline-none transition focus:border-white/40"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full rounded-full bg-white py-2 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-50 active:scale-[0.99]"
                  >
                    {loading ? 'Memproses...' : 'Lanjutkan'}
                  </button>
                </form>
              </div>

              <div className="mt-5 text-center text-[10px] text-white/40">
                <p>
                  Belum memiliki akun?{' '}
                  <span className="text-white hover:underline cursor-pointer">Buat akun baru</span>
                </p>
                <p className="mt-1.5 flex items-center justify-center gap-1 text-[9px]">
                  <Lock size={9} />
                  SSO tersedia pada paket Bisnis
                </p>
              </div>
            </div>

            {/* Right Side: Aurora Glow Canvas with floating prompt (Gambar 2 kanan) */}
            <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden border-l border-white/10 bg-[#07080B] p-6">
              {/* Aurora Glow Circles */}
              <div className="pointer-events-none absolute -top-1/4 -right-1/4 h-64 w-64 rounded-full bg-blue-600/30 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-64 w-64 rounded-full bg-pink-600/35 blur-[80px]" />
              <div className="pointer-events-none absolute top-1/3 left-1/4 h-56 w-56 rounded-full bg-purple-600/30 blur-[70px]" />

              {/* Floating Prompt Pill Mockup */}
              <div className="relative z-10 w-full max-w-xs rounded-full border border-white/15 bg-[#12141D]/90 p-2.5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2 px-3">
                  <span className="text-[11px] text-white/80 truncate">
                    Minta buildprompt menyusun prototipe dan PRD teknis.<span className="animate-pulse">|</span>
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shrink-0">
                    <ArrowUp size={12} strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
