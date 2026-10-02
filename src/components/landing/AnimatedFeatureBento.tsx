import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Lightbulb, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AnimatedFeatureBento() {
  const [phase, setPhase] = useState<0 | 1>(0);

  // Toggle animation phase every 3.2 seconds between Frame 1 & Frame 2
  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p === 0 ? 1 : 0));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 text-white">
      {/* 4 Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {/* CARD 1: Bikin Plan */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-white/10 bg-[#0D111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-white/20">
          {/* Orange Badge in Top Right */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center rounded-full bg-[#FF5500] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
              UPDATE BARU
            </span>
          </div>

          {/* Wireframe Illustration Area (Aspect Ratio ~16:11) */}
          <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#07090F]">
            {/* Blueprint Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Schematic Illustration Content */}
            <div className="relative z-10 flex w-full items-center justify-center gap-3 px-4">
              {/* Lightbulb Ide Source */}
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/[0.04]">
                  <Lightbulb size={20} className="text-white/80" />
                </div>
                {/* Arrow lines pointing to PRD box */}
                <div className="mt-1 flex items-center text-[10px] text-white/30 font-mono tracking-tighter">
                  &gt;&gt;&gt;
                </div>
              </div>

              {/* PRD Box / Document Frame */}
              <div className="relative w-36">
                <AnimatePresence mode="wait">
                  {phase === 0 ? (
                    /* Frame 1: Simple Outline Box */
                    <motion.div
                      key="p0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-24 w-full rounded-xl border border-white/30 bg-white/[0.02] p-2.5"
                    >
                      <span className="font-mono text-xs font-bold text-white/90">PRD</span>
                    </motion.div>
                  ) : (
                    /* Frame 2: PRD with Lines of Text + Resizing Bounding Box */
                    <motion.div
                      key="p1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-24 w-full rounded-xl border border-white/40 bg-white/[0.04] p-2.5"
                    >
                      <span className="font-mono text-xs font-bold text-white">PRD</span>
                      <div className="mt-2 space-y-1.5 opacity-60">
                        <div className="h-1 w-20 rounded-full bg-white/40" />
                        <div className="h-1 w-16 rounded-full bg-white/30" />
                        <div className="h-1 w-24 rounded-full bg-white/30" />
                      </div>

                      {/* Moving Bounding Box with Corner Dots */}
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1.05, opacity: 1 }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                        className="absolute -inset-1.5 rounded-lg border border-white/70 pointer-events-none"
                      >
                        <span className="absolute -top-1 -left-1 h-2 w-2 bg-white" />
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-white" />
                        <span className="absolute -bottom-1 -left-1 h-2 w-2 bg-white" />
                        <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-white" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Card Text Content */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-rounded">
              Bikin Plan
            </h3>
            <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/60 font-sans">
              Dari ide jadi PRD, spec fitur dan task yang siap dipake AI coding agent
            </p>
          </div>
        </div>

        {/* CARD 2: DesainPakeAI */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-white/10 bg-[#0D111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-white/20">
          {/* Wireframe Area */}
          <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Canvas Window Mockup */}
            <div className="relative z-10 w-full max-w-[210px] rounded-xl border border-white/30 bg-[#0B0D14]/90 p-2 shadow-lg">
              {/* Window Header */}
              <div className="flex items-center gap-1 border-b border-white/10 pb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span className="ml-1 text-[8px] font-mono text-white/40">Canvas</span>
              </div>

              {/* Window Body with Animated UI Preview */}
              <div className="py-3 px-1 min-h-[56px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {phase === 0 ? (
                    /* Frame 1: Empty Canvas Space */
                    <motion.div
                      key="c0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-9 w-full flex items-center justify-center"
                    >
                      <div className="h-full w-full rounded border border-dashed border-white/15 flex items-center justify-center">
                        <span className="text-[9px] font-mono text-white/30">Wireframe View</span>
                      </div>
                    </motion.div>
                  ) : (
                    /* Frame 2: Assembled Layout Mockup Box Inside */
                    <motion.div
                      key="c1"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-9 w-full rounded border border-white/40 bg-white/[0.03] p-1 flex gap-1"
                    >
                      <div className="w-5 h-full rounded-sm bg-white/10" />
                      <div className="flex-1 space-y-0.5">
                        <div className="h-2 w-full rounded-sm bg-white/20" />
                        <div className="h-2 w-2/3 rounded-sm bg-white/15" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Capsule Input Bar */}
              <div className="flex items-center justify-between rounded-full border border-purple-500/40 bg-purple-950/40 py-1 px-2.5 text-[9px] text-white/80">
                <span className="flex items-center gap-1 truncate text-white/70">
                  <Sparkles size={10} className="text-purple-400 shrink-0" />
                  <span className="truncate">Buatkan dashboard CRM...</span>
                </span>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white ml-1">
                  <ArrowUp size={9} strokeWidth={2.4} />
                </span>
              </div>
            </div>
          </div>

          {/* Card Text Content */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-rounded">
              DesainPakeAI
            </h3>
            <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/60 font-sans">
              Rancang tampilan website dan aplikasi bareng AI, dari ide sampai prototipe.
            </p>
          </div>
        </div>

        {/* CARD 3: AndalAI */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-white/10 bg-[#0D111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-white/20">
          {/* Wireframe Area */}
          <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Model Icons & Prompt Bar Selector */}
            <div className="relative z-10 flex flex-col items-center gap-3.5 w-full px-4">
              {/* Top Icons Row */}
              <div className="flex items-center justify-center gap-2">
                {/* Icon 1: Anthropic/Claude Asterisk */}
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/[0.03] text-white/70 font-mono text-xs">
                  *
                </div>
                {/* Icon 2: OpenAI */}
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/[0.03] text-white/70 font-mono text-xs">
                  O
                </div>
                {/* Icon 3: DeepSeek with animated active highlight in Frame 0 */}
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs transition-all duration-300 ${
                    phase === 0
                      ? 'border-2 border-orange-500 bg-orange-500/15 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.4)] scale-110'
                      : 'border border-white/20 bg-white/[0.03] text-white/70'
                  }`}
                >
                  +
                </div>
                {/* Icon 4: Cursor / Code */}
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-white/[0.03] text-white/70 font-mono text-xs">
                  C
                </div>
              </div>

              {/* Bottom Prompt / Context Bar with animated active highlight in Frame 1 */}
              <div
                className={`w-full max-w-[190px] rounded-lg py-1.5 px-3 transition-all duration-300 ${
                  phase === 1
                    ? 'border-2 border-orange-500 bg-orange-500/10 shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                    : 'border border-white/15 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 rounded-full bg-white/40" />
                  <div className="h-1.5 w-10 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Secondary pill bar */}
              <div className="h-4 w-16 rounded-md border border-white/10 bg-white/[0.02]" />
            </div>
          </div>

          {/* Card Text Content */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-rounded">
              AndalAI
            </h3>
            <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/60 font-sans">
              Ngechat dan bikin PRD dengan DeepSeek v4.1, Claude Code, Cursor, dan model lainnya.
            </p>
          </div>
        </div>

        {/* CARD 4: Template */}
        <div className="relative flex flex-col justify-between rounded-[24px] border border-white/10 bg-[#0D111C]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-white/20">
          {/* Wireframe Area */}
          <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#07090F]">
            {/* Dotted Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Browser Mockup Window */}
            <div className="relative z-10 w-full max-w-[210px] rounded-xl border border-white/30 bg-[#0B0D14]/90 p-2 shadow-lg">
              {/* Window Header */}
              <div className="flex items-center gap-1 border-b border-white/10 pb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              </div>

              {/* Alternating Layout: Frame 1 wireframe placeholder vs Frame 2 assembled codebase */}
              <div className="py-2 min-h-[75px]">
                <AnimatePresence mode="wait">
                  {phase === 0 ? (
                    /* Frame 1: Wireframe with dashed X placeholder boxes */
                    <motion.div
                      key="w0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-12 gap-1.5 h-16"
                    >
                      <div className="col-span-3 rounded border border-dashed border-white/30 p-1 flex flex-col justify-between">
                        <div className="h-1 w-full bg-white/30" />
                        <div className="h-1 w-2/3 bg-white/20" />
                        <div className="h-1 w-full bg-white/20" />
                      </div>
                      <div className="col-span-9 rounded border border-dashed border-white/30 p-1 flex items-center justify-center">
                        <span className="font-mono text-[9px] text-white/30">Next.js 15 &bull; SQLite</span>
                      </div>
                    </motion.div>
                  ) : (
                    /* Frame 2: Rendered UI blocks with cards */
                    <motion.div
                      key="w1"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-12 gap-1.5 h-16"
                    >
                      <div className="col-span-3 rounded border border-white/40 bg-white/[0.04] p-1 flex flex-col justify-between">
                        <div className="h-1.5 w-full rounded-sm bg-purple-400/60" />
                        <div className="h-1.5 w-3/4 rounded-sm bg-white/30" />
                        <div className="h-1.5 w-full rounded-sm bg-white/20" />
                      </div>
                      <div className="col-span-9 grid grid-cols-2 gap-1">
                        <div className="rounded border border-white/30 bg-white/[0.03] p-1 space-y-1">
                          <div className="h-2 w-full rounded bg-white/30" />
                          <div className="h-1.5 w-3/4 rounded bg-white/20" />
                        </div>
                        <div className="rounded border border-white/30 bg-white/[0.03] p-1 space-y-1">
                          <div className="h-2 w-full rounded bg-white/30" />
                          <div className="h-1.5 w-1/2 rounded bg-white/20" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Card Text Content */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-rounded">
              Template
            </h3>
            <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-white/60 font-sans">
              Gunakan kerangka codebase untuk bikin aplikasi irit token, lebih aman, siap untuk production
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
