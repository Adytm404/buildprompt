import { AnimatePresence, motion } from 'framer-motion';
import { Check, Database, FileCode2, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AnimatedFeatureBento() {
  const [phase, setPhase] = useState<0 | 1>(0);

  // Toggle animation phase every 3.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p === 0 ? 1 : 0));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full text-white">
      {/* 4 Bento Cards Grid - Perfectly Aligned */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {/* CARD 1: Ide Bahasa Awam */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-purple-500/20 bg-[#0E111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_8px_30px_rgba(109,40,217,0.15)]">
          {/* Step Pill */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[9px] font-bold font-compact tracking-wider text-purple-200 shadow-sm">
              01
            </span>
          </div>

          {/* Wireframe Area - Simple, Crisp, Minimalist */}
          <div className="relative mb-5 flex h-40 w-full items-center justify-center overflow-hidden rounded-[16px] border border-purple-500/15 bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            <div className="relative z-10 w-full px-4">
              <AnimatePresence mode="wait">
                {phase === 0 ? (
                  /* Phase 0: Clean minimal user prompt */
                  <motion.div
                    key="step1-p0"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-300/50">
                      <MessageSquare size={11} />
                      <span>Ide Mentah:</span>
                    </div>
                    <div className="rounded-xl border border-purple-500/25 bg-purple-950/30 p-2.5 text-xs text-purple-100 font-sans leading-relaxed">
                      &ldquo;Aplikasi kasir warung yang bisa catat stok...&rdquo;
                      <span className="inline-block h-3 w-1 bg-purple-400 ml-1 animate-pulse align-middle" />
                    </div>
                  </motion.div>
                ) : (
                  /* Phase 1: Clean extracted entity tags */
                  <motion.div
                    key="step1-p1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-2"
                  >
                    <div className="text-[10px] font-mono text-purple-300/60 flex items-center justify-between">
                      <span>Ekstraksi Entitas:</span>
                      <span className="text-emerald-400 font-bold">Teridentifikasi ✓</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="rounded-lg border border-purple-400/30 bg-purple-500/20 px-2 py-1 text-[11px] font-mono text-purple-200">
                        Produk
                      </span>
                      <span className="rounded-lg border border-purple-400/30 bg-purple-500/20 px-2 py-1 text-[11px] font-mono text-purple-200">
                        Stok Atomik
                      </span>
                      <span className="rounded-lg border border-purple-400/30 bg-purple-500/20 px-2 py-1 text-[11px] font-mono text-purple-200">
                        Laporan
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Simple, Punchy Copywriting */}
          <div>
            <h3 className="text-base font-bold tracking-tight text-white font-rounded">
              Ide Bahasa Awam
            </h3>
            <p className="mt-1 text-xs text-white/55 leading-relaxed font-sans">
              Ceritakan ide aplikasi Anda dengan bahasa sehari-hari tanpa istilah teknis.
            </p>
          </div>
        </div>

        {/* CARD 2: Wawancara Cerdas AI */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-purple-500/20 bg-[#0E111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_8px_30px_rgba(109,40,217,0.15)]">
          {/* Step Pill */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[9px] font-bold font-compact tracking-wider text-purple-200 shadow-sm">
              02
            </span>
          </div>

          {/* Wireframe Area - Simple, Crisp, Minimalist */}
          <div className="relative mb-5 flex h-40 w-full items-center justify-center overflow-hidden rounded-[16px] border border-purple-500/15 bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            <div className="relative z-10 w-full px-4">
              <AnimatePresence mode="wait">
                {phase === 0 ? (
                  /* Phase 0: Question with two clear choices */
                  <motion.div
                    key="step2-p0"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-purple-300/40">
                      <span>Langkah 2 / 8</span>
                      <span>Wawancara AI</span>
                    </div>
                    <p className="text-[11px] font-semibold text-white/90 truncate">
                      Perlu hak akses kasir &amp; pemilik?
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[10px]">
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-center text-white/50">
                        A. Ya, pisahkan
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-center text-white/50">
                        B. Sama
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Phase 1: Choice A selected with checkmark */
                  <motion.div
                    key="step2-p1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 font-bold">
                      <span>Langkah 3 / 8 ✓</span>
                      <span className="text-purple-300">Tersimpan</span>
                    </div>
                    <p className="text-[11px] font-semibold text-white truncate">
                      Perlu hak akses kasir &amp; pemilik?
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[10px]">
                      <div className="rounded-lg border border-purple-500 bg-purple-500/25 p-1.5 text-center text-white font-semibold flex items-center justify-center gap-1 shadow-sm">
                        <span>A. Ya, pisahkan</span>
                        <Check size={11} className="text-purple-300" strokeWidth={3} />
                      </div>
                      <div className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-center text-white/30">
                        B. Sama
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Simple, Punchy Copywriting */}
          <div>
            <h3 className="text-base font-bold tracking-tight text-white font-rounded">
              Wawancara Cerdas AI
            </h3>
            <p className="mt-1 text-xs text-white/55 leading-relaxed font-sans">
              AI menanyakan peran pengguna, alur transaksi, dan kebutuhan penting.
            </p>
          </div>
        </div>

        {/* CARD 3: Arsitektur & Skema */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-purple-500/20 bg-[#0E111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_8px_30px_rgba(109,40,217,0.15)]">
          {/* Step Pill */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[9px] font-bold font-compact tracking-wider text-purple-200 shadow-sm">
              03
            </span>
          </div>

          {/* Wireframe Area - Simple, Crisp, Minimalist */}
          <div className="relative mb-5 flex h-40 w-full items-center justify-center overflow-hidden rounded-[16px] border border-purple-500/15 bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            <div className="relative z-10 w-full px-4 font-mono text-[10px]">
              <AnimatePresence mode="wait">
                {phase === 0 ? (
                  /* Phase 0: Clean schema box */
                  <motion.div
                    key="step3-p0"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-purple-300/60 text-[9px] border-b border-white/10 pb-1">
                      <Database size={10} />
                      <span>SQLite Schema</span>
                    </div>
                    <div className="rounded-lg border border-purple-500/20 bg-black/40 p-2 space-y-0.5">
                      <div className="text-purple-300 font-bold">table products</div>
                      <div className="text-white/50 pl-2">id, nama, harga, stok</div>
                    </div>
                  </motion.div>
                ) : (
                  /* Phase 1: Clean REST endpoint pill */
                  <motion.div
                    key="step3-p1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-purple-300/60 text-[9px] border-b border-white/10 pb-1">
                      <span>REST Endpoint</span>
                      <span className="text-emerald-400 font-bold">✓ Siap</span>
                    </div>
                    <div className="rounded-lg border border-purple-500/30 bg-purple-950/40 p-2 flex items-center justify-between">
                      <span className="rounded bg-purple-500/30 px-1.5 py-0.5 text-[8px] font-bold text-purple-200">
                        POST
                      </span>
                      <span className="text-white/90 text-[10px]">/api/pos/checkout</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Simple, Punchy Copywriting */}
          <div>
            <h3 className="text-base font-bold tracking-tight text-white font-rounded">
              Arsitektur &amp; Skema
            </h3>
            <p className="mt-1 text-xs text-white/55 leading-relaxed font-sans">
              Skema tabel SQLite, endpoint REST API, dan aturan validasi tersusun otomatis.
            </p>
          </div>
        </div>

        {/* CARD 4: Prompt Siap Eksekusi */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-purple-500/20 bg-[#0E111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_8px_30px_rgba(109,40,217,0.15)]">
          {/* Step Pill */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[9px] font-bold font-compact tracking-wider text-purple-200 shadow-sm">
              04
            </span>
          </div>

          {/* Wireframe Area - Simple, Crisp, Minimalist */}
          <div className="relative mb-5 flex h-40 w-full items-center justify-center overflow-hidden rounded-[16px] border border-purple-500/15 bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            <div className="relative z-10 w-full px-4 font-mono text-[10px]">
              <AnimatePresence mode="wait">
                {phase === 0 ? (
                  /* Phase 0: Clean Markdown prompt preview */
                  <motion.div
                    key="step4-p0"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-white/40 text-[9px] border-b border-white/10 pb-1">
                      <span className="flex items-center gap-1 text-purple-300">
                        <FileCode2 size={10} />
                        <span>prompt.md</span>
                      </span>
                      <span className="text-[8px] text-white/30">Next.js + SQLite</span>
                    </div>
                    <div className="space-y-1 text-[9px] text-white/60">
                      <div className="text-purple-400 font-bold"># PRD &amp; BUILD PROMPT</div>
                      <div className="text-white/40 pl-2">- Architecture &amp; API Plan</div>
                    </div>
                  </motion.div>
                ) : (
                  /* Phase 1: Copied notification + Cursor/Claude prompt */
                  <motion.div
                    key="step4-p1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-emerald-300 text-[9px] font-bold">
                      <span className="flex items-center gap-1">
                        <Check size={10} strokeWidth={3} />
                        <span>Prompt Tersalin</span>
                      </span>
                      <span className="text-white/50 text-[8px]">Siap Tempel</span>
                    </div>
                    <div className="rounded-lg border border-purple-500/30 bg-purple-950/40 p-1.5 text-[9px] text-purple-200/80">
                      <span>Tempel ke Cursor / Claude Code</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Simple, Punchy Copywriting */}
          <div>
            <h3 className="text-base font-bold tracking-tight text-white font-rounded">
              Prompt Siap Eksekusi
            </h3>
            <p className="mt-1 text-xs text-white/55 leading-relaxed font-sans">
              Dokumen PRD Markdown lengkap, siap dieksekusi di AI coding pilihan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
