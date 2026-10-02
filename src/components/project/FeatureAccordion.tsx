import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Circle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ResultFeature } from '@/types';

interface FeatureAccordionProps {
  features: ResultFeature[];
  defaultOpenId?: string;
}

export function FeatureAccordion({ features, defaultOpenId }: FeatureAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? features[0]?.id ?? null);

  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-[#12131C]/90 text-white shadow-2xl backdrop-blur-xl">
      {features.map((feature) => {
        const open = openId === feature.id;
        return (
          <div key={feature.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : feature.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03] sm:px-6"
            >
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold tracking-tight text-white">{feature.title}</h3>
                <p className="mt-0.5 text-[13px] text-white/50">{feature.description}</p>
              </div>
              <ChevronDown
                size={18}
                className={cn('shrink-0 text-white/40 transition-transform duration-200', open && 'rotate-180')}
              />
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <ul className="grid gap-2 px-5 pb-5 sm:grid-cols-2 sm:px-6">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-[13.5px] text-white/70">
                        <Circle size={5} className="shrink-0 fill-pink-500 text-pink-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
