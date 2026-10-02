import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DitherWave } from '@/components/landing/DitherWave';

interface DitherBannerProps {
  title?: string;
  buttonText?: string;
  to?: string;
  className?: string;
}

export function DitherBanner({
  title = 'Buat proyek pertamamu',
  buttonText = 'Buat proyek pertama',
  to = '/new',
  className = '',
}: DitherBannerProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[26px] border border-purple-500/30 bg-[#0F081D] shadow-2xl ${className}`}
    >
      {/* Animated Dither Wave Canvas Background */}
      <div className="absolute inset-0 z-0">
        <DitherWave
          pixelSize={5}
          speed={0.7}
          primaryColor="#6D28D9"
          secondaryColor="#4C1D95"
          backgroundColor="#0F081D"
          waveBaseHeight={0.45}
          amplitude={45}
          ditherDepth={75}
        />
      </div>

      {/* Subtle Top & Center Vignette to guarantee sharp text readability */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#0F081D]/60 via-transparent to-transparent" />

      {/* Banner Content (1:1 with Image 1) */}
      <div className="relative z-20 flex flex-col items-center justify-center py-14 sm:py-20 px-6 text-center">
        <h2 className="text-2xl sm:text-4xl md:text-[2.6rem] font-bold tracking-tight text-white leading-tight drop-shadow-sm">
          {title}
        </h2>

        <div className="mt-6">
          <Link
            to={to}
            className="inline-flex items-center gap-2 rounded-full bg-[#6D28D9] hover:bg-[#7C3AED] px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_24px_rgba(109,40,217,0.5)] transition-all duration-200 hover:scale-[1.03] active:scale-95 border border-purple-400/30"
          >
            <span>{buttonText}</span>
            <ArrowRight size={15} strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </div>
  );
}
