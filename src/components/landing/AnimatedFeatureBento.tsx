import { AnimatePresence, motion } from 'framer-motion';
import { Check, Database, MessageSquare, Terminal } from 'lucide-react';
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
          {/* Step Pill in Top Right */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[9px] font-bold font-compact tracking-wider text-purple-200 shadow-sm">
              LANGKAH 01
            </span>
          </div>

          {/* Wireframe Illustration Area (Aspect Ratio ~16:11) */}
          <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-[16px] border border-purple-500/15 bg-[#07090F]">
            {/* Blueprint Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Schematic Illustration: Casual Idea to Extracted Entities */}
            <div className="relative z-10 w-full px-3.5">
              <AnimatePresence mode="wait">
                {phase === 0 ? (
                  /* Phase 0: Casual conversational prompt input with blinking cursor */
                  <motion.div
                    key="b0-p0"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-300/60">
                      <MessageSquare size={11} />
                      <span>Masukan Pengguna:</span>
                    </div>
                    <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-2.5 text-[11px] leading-relaxed text-purple-100 italic font-sans">
                      &ldquo;Mau buat aplikasi kasir warung yang bisa kurangi stok barang otomatis...&rdquo;
                      <span className="inline-block h-3 w-1.5 bg-purple-400 ml-1 animate-pulse align-middle" />
                    </div>
                  </motion.div>
                ) : (
                  /* Phase 1: Extracted Key Technical Entities */
                  <motion.div
                    key="b0-p1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2.5"
                  >
                    <div className="text-[10px] font-mono text-purple-300/70 flex items-center justify-between">
                      <span>Entitas Terdeteksi:</span>
                      <span className="text-[9px] text-emerald-400 font-bold">100% Cocok</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-md border border-purple-400/40 bg-purple-500/20 px-2 py-1 text-[10px] font-mono text-purple-200">
                        🏷️ Produk
                      </span>
                      <span className="rounded-md border border-purple-400/40 bg-purple-500/20 px-2 py-1 text-[10px] font-mono text-purple-200">
                        🏷️ Stok Atomik
                      </span>
                      <span className="rounded-md border border-purple-400/40 bg-purple-500/20 px-2 py-1 text-[10px] font-mono text-purple-200">
                        🏷️ Laporan Harian
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Card Text Content */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-rounded">
              Ide Bahasa Awam
            </h3>
            <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/60 font-sans">
              Cukup ceritakan ide aplikasi dengan bahasa sehari-hari tanpa pusing memikirkan framework atau database.
            </p>
          </div>
        </div>

        {/* CARD 2: Wawancara Adaptif */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-purple-500/20 bg-[#0D111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_8px_30px_rgba(109,40,217,0.15)]">
          {/* Step Pill */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[9px] font-bold font-compact tracking-wider text-purple-200 shadow-sm">
              LANGKAH 02
            </span>
          </div>

          {/* Wireframe Area */}
          <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-[16px] border border-purple-500/15 bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Schematic Illustration: Dynamic Question & Selection */}
            <div className="relative z-10 w-full px-3.5">
              <AnimatePresence mode="wait">
                {phase === 0 ? (
                  /* Phase 0: Question shown, options unselected */
                  <motion.div
                    key="b1-p0"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-purple-300/50">
                      <span>Langkah 2 / 8</span>
                      <span>Wawancara AI</span>
                    </div>
                    <p className="text-[11px] font-semibold text-white/90 leading-snug">
                      Perlu pemisahan hak kasir &amp; pemilik?
                    </p>
                    <div className="space-y-1 text-[10px]">
                      <div className="rounded-lg border border-white/15 bg-white/[0.03] px-2 py-1 text-white/60">
                        A. Ya, pisahkan hak akses
                      </div>
                      <div className="rounded-lg border border-white/15 bg-white/[0.03] px-2 py-1 text-white/40">
                        B. Tidak, akses sama
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Phase 1: Option A selected with purple glow and step advances! */
                  <motion.div
                    key="b1-p1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 font-bold">
                      <span>Langkah 3 / 8 ✓</span>
                      <span className="text-purple-300">Tersimpan</span>
                    </div>
                    <p className="text-[11px] font-semibold text-white leading-snug">
                      Perlu pemisahan hak kasir &amp; pemilik?
                    </p>
                    <div className="space-y-1 text-[10px]">
                      <div className="rounded-lg border border-purple-500 bg-purple-500/20 px-2 py-1 text-white font-semibold flex items-center justify-between shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                        <span>A. Ya, pisahkan hak akses</span>
                        <Check size={11} className="text-purple-300" strokeWidth={3} />
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1 text-white/30">
                        B. Tidak, akses sama
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Card Text Content */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-rounded">
              Wawancara Cerdas AI
            </h3>
            <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/60 font-sans">
              AI memandu layaknya Product Manager: menanyakan hak akses, alur transaksi, dan celah bisnis penting.
            </p>
          </div>
        </div>

        {/* CARD 3: Arsitektur & Skema */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-purple-500/20 bg-[#0D111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_8px_30px_rgba(109,40,217,0.15)]">
          {/* Step Pill */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[9px] font-bold font-compact tracking-wider text-purple-200 shadow-sm">
              LANGKAH 03
            </span>
          </div>

          {/* Wireframe Area */}
          <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-[16px] border border-purple-500/15 bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Schematic Illustration: SQLite Schema & REST API Contract */}
            <div className="relative z-10 w-full px-3.5">
              <AnimatePresence mode="wait">
                {phase === 0 ? (
                  /* Phase 0: Table Schema Relations */
                  <motion.div
                    key="b2-p0"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2 font-mono text-[9px]"
                  >
                    <div className="flex items-center justify-between text-purple-300/70 border-b border-white/10 pb-1">
                      <span className="flex items-center gap-1">
                        <Database size={10} />
                        <span>SQLite Schema</span>
                      </span>
                      <span className="text-white/40">Prisma ORM</span>
                    </div>
                    <div className="rounded-lg border border-purple-500/25 bg-black/40 p-2 space-y-1">
                      <div className="text-purple-300 font-bold">model Product &#123;</div>
                      <div className="text-white/60 pl-2">id, name, stock_qty</div>
                      <div className="text-purple-300 font-bold">&#125;</div>
                    </div>
                  </motion.div>
                ) : (
                  /* Phase 1: REST API Endpoint Generated */
                  <motion.div
                    key="b2-p1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2 font-mono text-[9px]"
                  >
                    <div className="flex items-center justify-between text-purple-300/70 border-b border-white/10 pb-1">
                      <span>Next.js 15 Route Handler</span>
                      <span className="text-emerald-400 font-bold">✓ Valid</span>
                    </div>
                    <div className="rounded-lg border border-purple-500/30 bg-purple-950/40 p-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-purple-500/30 px-1 py-0.2 text-[8px] font-bold text-purple-200">
                          POST
                        </span>
                        <span className="text-white/90">/api/pos/checkout</span>
                      </div>
                      <p className="text-[8px] text-white/50 font-sans">
                        Validasi transaksi &amp; potong stok atomik
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Card Text Content */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-rounded">
              Arsitektur &amp; Skema
            </h3>
            <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/60 font-sans">
              Menyusun skema SQLite terelasi, rincian titik akhir REST API, dan aturan validasi secara terstruktur.
            </p>
          </div>
        </div>

        {/* CARD 4: Prompt PRD Siap Koding */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-purple-500/20 bg-[#0D111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_8px_30px_rgba(109,40,217,0.15)]">
          {/* Step Pill */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/15 px-2.5 py-0.5 text-[9px] font-bold font-compact tracking-wider text-purple-200 shadow-sm">
              LANGKAH 04
            </span>
          </div>

          {/* Wireframe Area */}
          <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-[16px] border border-purple-500/15 bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Schematic Illustration: PRD Prompt to AI Agent Execution */}
            <div className="relative z-10 w-full px-3.5">
              <AnimatePresence mode="wait">
                {phase === 0 ? (
                  /* Phase 0: Formatted Markdown PRD ready to copy */
                  <motion.div
                    key="b3-p0"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1.5 font-mono text-[9px]"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-1 text-white/40">
                      <span className="text-purple-300 font-bold"># PRD &amp; BUILD PROMPT</span>
                      <span className="rounded bg-white/10 px-1 py-0.2 text-[8px]">Cursor ▾</span>
                    </div>
                    <div className="text-white/60 space-y-0.5">
                      <div className="text-purple-400">## 1. Stack: Next.js + SQLite</div>
                      <div className="text-white/40 pl-2">- App Router TypeScript</div>
                      <div className="text-purple-400">## 2. Fitur &amp; Aturan Bisnis</div>
                    </div>
                  </motion.div>
                ) : (
                  /* Phase 1: Copied feedback + Agent Execution simulation */
                  <motion.div
                    key="b3-p1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2 font-mono text-[9px]"
                  >
                    <div className="flex items-center justify-between rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-emerald-300 font-bold">
                      <span>Prompt Tersalin ✓</span>
                      <span className="text-[8px] text-white/50">Markdown</span>
                    </div>
                    <div className="rounded-lg border border-purple-500/30 bg-[#090A0E] p-2 space-y-1">
                      <div className="flex items-center gap-1 text-purple-300">
                        <Terminal size={10} />
                        <span>Claude Code / Cursor</span>
                      </div>
                      <div className="text-white/50 text-[8px] pl-2">&gt; Generating components...</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Card Text Content */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-rounded">
              Prompt Siap Eksekusi
            </h3>
            <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/60 font-sans">
              Satu prompt PRD lengkap berformat Markdown siap ditempelkan langsung ke Cursor, Claude Code, atau OpenCode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
