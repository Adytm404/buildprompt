import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AppLogo } from '@/components/layout/AppLogo';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <AppLogo />
      <div>
        <p className="font-mono text-sm font-medium text-accent">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-muted">
          Halaman yang kamu tuju tidak tersedia. Mari kembali dan lanjutkan merancang aplikasimu.
        </p>
      </div>
      <div className="flex gap-2.5">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Kembali
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Ke beranda
        </Button>
      </div>
    </div>
  );
}
