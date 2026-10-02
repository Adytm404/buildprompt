import { useNavigate } from 'react-router-dom';

interface ProjectNotFoundProps {
  title?: string;
  description?: string;
}

export function ProjectNotFound({
  title = 'Proyek tidak ditemukan',
  description = 'Proyek ini mungkin sudah dihapus atau tautannya tidak valid.',
}: ProjectNotFoundProps) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#0A0B0F] px-6 text-center text-white">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mt-2 max-w-sm text-sm text-white/50">{description}</p>
      </div>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          Ke beranda
        </button>
        <button
          type="button"
          onClick={() => navigate('/projects/all')}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
        >
          Lihat Proyek
        </button>
      </div>
    </div>
  );
}
