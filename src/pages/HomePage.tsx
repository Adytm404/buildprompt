import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIComposer } from '@/components/layout/AIComposer';
import { Navbar } from '@/components/layout/Navbar';
import { SuggestionChip } from '@/components/layout/SuggestionChip';
import { AIToolsMarquee } from '@/components/landing/AIToolsMarquee';
import { AnimatedFeatureBento } from '@/components/landing/AnimatedFeatureBento';
import { DitherBanner } from '@/components/landing/DitherBanner';
import { DitherWave } from '@/components/landing/DitherWave';
import { ProcessingScreen } from '@/components/feedback/ProcessingScreen';
import { IDEA_SUGGESTIONS } from '@/data/mockProject';
import { useProject } from '@/context/ProjectContext';

export function HomePage() {
  const navigate = useNavigate();
  const { createProject } = useProject();
  const [idea, setIdea] = useState('');
  const [details, setDetails] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pendingRef = useRef('');

  const submit = () => {
    const combined = [idea.trim(), details.trim()].filter(Boolean).join('\n\n');
    if (!combined) return;
    pendingRef.current = combined;
    setSubmitting(true);
  };

  const finish = () => {
    const project = createProject(pendingRef.current);
    navigate(`/dashboard/project/${project.id}/interview`, { replace: true });
  };

  if (submitting) {
    return (
      <ProcessingScreen steps={['Menganalisis idemu...']} onComplete={finish} />
    );
  }

  return (
    <div className="bg-[#08090C] text-white">
      {/* SECTION 1: HERO (100vh / Full Viewport dengan latar animasi gelombang dithering) */}
      <section className="relative min-h-screen flex flex-col justify-between bg-[#0A0512] overflow-hidden">
        {/* Animated Procedural Dither Wave Canvas Background (Bertindak sebagai pembatas langsung ke seksi berikutnya) */}
        <div className="absolute inset-0 z-0">
          <DitherWave
            pixelSize={5}
            speed={0.65}
            primaryColor="#6D28D9"
            secondaryColor="#3B0764"
            backgroundColor="#0A0512"
            waveBaseHeight={0.72}
            amplitude={55}
            ditherDepth={90}
            interactive={true}
          />
        </div>

        {/* Ambient Top Gradient untuk kenyamanan baca Navbar & Judul */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 z-0 bg-gradient-to-b from-[#0A0512] via-[#0A0512]/60 to-transparent" />

        <Navbar />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16 text-center">
          <div className="w-full max-w-[760px] mx-auto">
            {/* Top Banner Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 px-3.5 text-xs font-compact font-medium text-white/80 shadow-sm backdrop-blur-md">
                <span className="rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 px-2 py-0.5 text-[9px] font-bold text-white tracking-wide">
                  BARU
                </span>
                <span>Perancang Produk &amp; Generator Prompt AI</span>
                <ArrowRight size={13} className="text-white/40" />
              </div>
            </motion.div>

            {/* Simple, Punchy Hero Title & Subtitle with SF Pro Rounded */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-balance text-[2.5rem] font-rounded font-bold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-[3.75rem]">
                Rancang aplikasi dari satu ide
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-[15px] sm:text-[17px] font-sans leading-relaxed text-white/60">
                Ceritakan ide aplikasi Anda dengan bahasa sehari-hari. Kami bantu menyusun PRD teknis dan prompt coding siap pakai.
              </p>
            </motion.div>

            {/* Floating Capsule Composer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 text-left"
            >
              <AIComposer
                value={idea}
                onChange={setIdea}
                onSubmit={submit}
                detailsOpen={detailsOpen}
                onToggleDetails={() => setDetailsOpen((open) => !open)}
                details={details}
                onDetailsChange={setDetails}
                dark={true}
                placeholder="Contoh: Aplikasi kasir sederhana untuk warung kecil yang mencatat transaksi dan stok..."
              />
            </motion.div>

            {/* Clean Suggestion Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <p className="text-center text-[12px] font-medium text-white/40">
                Coba salah satu ide ini
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {IDEA_SUGGESTIONS.map((suggestion) => (
                  <SuggestionChip
                    key={suggestion.id}
                    label={suggestion.label}
                    onClick={() => setIdea(suggestion.idea)}
                    dark={true}
                  />
                ))}
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-1.5 text-center text-xs text-white/40"
            >
              <Sparkles size={13} className="text-pink-400" />
              Tanpa perlu memahami pemrograman, basis data, atau istilah teknis.
            </motion.p>
          </div>
        </div>
      </section>

      {/* SECTION 2: DEEP VIOLET OBSIDIAN (Harmonis dengan hero wave dan footer dither banner) */}
      <section className="relative z-20 bg-[#0B0616] py-16 sm:py-24 overflow-hidden text-white">
        {/* Subtle Atmospheric Violet Glow in Section 2 */}
        <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-[550px] w-[850px] rounded-full bg-purple-900/15 blur-[140px] z-0" />
        <div className="pointer-events-none absolute bottom-1/4 right-0 h-[400px] w-[500px] rounded-full bg-indigo-900/10 blur-[130px] z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
          {/* Infinite Moving Marquee from right to left */}
          <div className="w-full">
            <p className="text-center text-[11px] font-compact font-semibold uppercase tracking-widest text-purple-300/50 mb-6">
              Kompatibel dengan agen koding &amp; IDE AI pilihan Anda
            </p>

            <AIToolsMarquee />
          </div>

          {/* 4 Animated Bento Feature Cards (Persis Alur Nyata buildprompt) */}
          <div className="w-full">
            <AnimatedFeatureBento />
          </div>

          {/* 1:1 Animated Dither Wave Banner matching user's Image 1 */}
          <div className="w-full pb-8 sm:pb-12">
            <DitherBanner
              title="Buat proyek pertamamu"
              buttonText="Buat proyek pertama"
              to="/new"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
