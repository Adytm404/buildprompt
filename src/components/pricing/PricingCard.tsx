import { Check, Sparkles, User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SubscriptionPlan } from '@/context/AuthContext';

export interface PricingTier {
  id: SubscriptionPlan;
  name: string;
  tagline: string;
  price: string;
  period: string;
  priceNote?: string;
  quotaLabel: string;
  badge?: string;
  isPopular?: boolean;
  userBenefit: string;
  speedBenefit: string;
  features: string[];
  ctaText: string;
}

interface PricingCardProps {
  tier: PricingTier;
  currentPlan?: SubscriptionPlan;
  onSelect: (tier: PricingTier) => void;
}

export function PricingCard({ tier, currentPlan, onSelect }: PricingCardProps) {
  const isCurrent = currentPlan === tier.id;

  return (
    <div
      className={cn(
        'relative flex flex-col justify-between rounded-[28px] border p-6 sm:p-7 text-white transition-all duration-300',
        tier.isPopular
          ? 'border-purple-500/60 bg-[#120F24]/95 shadow-[0_0_40px_rgba(109,40,217,0.25)] ring-1 ring-purple-500/40'
          : 'border-white/10 bg-[#12131C]/90 hover:border-white/20 hover:bg-[#161724] shadow-2xl backdrop-blur-xl',
      )}
    >
      {/* Top Floating Badge */}
      {tier.badge ? (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-3.5 py-1 text-[10px] font-bold font-compact tracking-wider uppercase text-white shadow-lg border border-purple-400/40">
            <Sparkles size={11} />
            <span>{tier.badge}</span>
          </span>
        </div>
      ) : null}

      <div>
        {/* Tier Header */}
        <div className="border-b border-white/10 pb-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-rounded tracking-tight text-white">{tier.name}</h3>
            {isCurrent && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                Aktif
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-white/50 leading-relaxed min-h-[32px]">{tier.tagline}</p>

          {/* Price display */}
          <div className="mt-5 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight">
              {tier.price}
            </span>
            <span className="text-xs text-white/40 font-sans">{tier.period}</span>
          </div>

          {tier.priceNote ? (
            <p className="mt-1 text-[11px] font-medium text-purple-300/80">{tier.priceNote}</p>
          ) : (
            <p className="mt-1 text-[11px] text-white/30">&nbsp;</p>
          )}

          {/* Action Button */}
          <div className="mt-5">
            <button
              type="button"
              disabled={isCurrent}
              onClick={() => onSelect(tier)}
              className={cn(
                'w-full rounded-full py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all duration-150 active:scale-95 shadow-md flex items-center justify-center gap-2',
                isCurrent
                  ? 'border border-white/15 bg-white/[0.06] text-white/40 cursor-not-allowed'
                  : tier.isPopular
                    ? 'bg-gradient-to-r from-purple-600 to-[#7C3AED] hover:from-purple-500 hover:to-[#8B5CF6] text-white shadow-[0_4px_24px_rgba(109,40,217,0.5)] border border-purple-400/40'
                    : 'bg-white text-black hover:bg-white/90',
              )}
            >
              <span>{isCurrent ? 'Paket Saat Ini' : tier.ctaText}</span>
            </button>
          </div>
        </div>

        {/* Benefits Indicators Row */}
        <div className="py-4 border-b border-white/10 space-y-2 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <User size={14} className="text-white/40 shrink-0" />
            <span>{tier.userBenefit}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-purple-400 shrink-0" />
            <span>{tier.speedBenefit}</span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="pt-5 space-y-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-3">
            Fitur Termasuk:
          </p>
          <ul className="space-y-2.5">
            {tier.features.map((feature, idx) => {
              const hasColon = feature.includes(':');
              if (hasColon) {
                const [label, ...valParts] = feature.split(':');
                const val = valParts.join(':').trim();
                return (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-white/75 leading-relaxed">
                    <Check size={14} className="text-purple-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>
                      <span className="font-semibold text-white/90">{label}:</span>{' '}
                      <span className="text-white/70">{val}</span>
                    </span>
                  </li>
                );
              }
              return (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-white/75 leading-relaxed">
                  <Check size={14} className="text-purple-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>{feature}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
