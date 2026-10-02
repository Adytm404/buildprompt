import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LoadingSequenceProps {
  steps: string[];
  stepDuration?: number;
  onComplete?: () => void;
  className?: string;
}

export function LoadingSequence({ steps, stepDuration = 950, onComplete, className }: LoadingSequenceProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= steps.length) {
      const done = window.setTimeout(() => onComplete?.(), 300);
      return () => window.clearTimeout(done);
    }
    const timer = window.setTimeout(() => setIndex((value) => value + 1), stepDuration);
    return () => window.clearTimeout(timer);
  }, [index, steps.length, stepDuration, onComplete]);

  const current = steps[Math.min(index, steps.length - 1)];

  return (
    // Outer Container: 28px Radius with 32px padding (Outer R = Inner R + Padding)
    <div
      className={cn(
        'relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0E0F17]/95 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center text-white',
        className,
      )}
    >
      {/* Background Ambient Glow Spheres */}
      <div className="pointer-events-none absolute -top-1/4 -right-1/4 h-48 w-48 rounded-full bg-pink-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

      {/* Central Breathing Orb */}
      <div className="relative mx-auto mb-6 h-20 w-20 flex items-center justify-center">
        {/* Outer Rotating Dashed Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-pink-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
        </motion.div>

        {/* Breathing Halo Glow */}
        <motion.div
          className="absolute inset-1 rounded-full bg-pink-500/20 blur-xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Core Glowing Sphere */}
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4B72] via-[#EC4899] to-[#8B5CF6] shadow-[0_0_30px_rgba(236,72,153,0.35)]"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={22} className="text-white" strokeWidth={2.2} />
        </motion.div>
      </div>

      {/* Step Sequence Content with High Contrast & Balanced Line-height */}
      <div className="min-h-[4rem] flex flex-col justify-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
              {current}
            </h3>
            <p className="mt-1 text-xs text-white/50 leading-relaxed">
              AI sedang menyusun spesifikasi produk Anda...
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Step Indicator Dots */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {steps.map((step, stepIndex) => (
            <span
              key={step}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                stepIndex <= index
                  ? 'w-6 bg-gradient-to-r from-pink-500 to-indigo-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]'
                  : 'w-1.5 bg-white/20',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
