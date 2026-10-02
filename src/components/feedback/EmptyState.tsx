import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#12131C]/60 px-6 py-16 text-center text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative mb-6 h-20 w-28"
        aria-hidden
      >
        <span className="absolute left-1/2 top-1/2 h-16 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] rounded-2xl border border-white/10 bg-white/[0.02]" />
        <span className="absolute left-1/2 top-1/2 h-16 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[4deg] rounded-2xl border border-white/10 bg-[#161722] shadow-xl" />
        <span className="absolute left-1/2 top-1/2 flex h-16 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-pink-500/30 bg-pink-500/15">
          <Sparkles size={20} className="text-pink-400" />
        </span>
      </motion.div>
      <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-white/50">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
