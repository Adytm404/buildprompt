import { useEffect, useState } from 'react';
import { featureOptions } from '@/data/mockQuestions';
import { Chip } from '@/components/ui/Chip';
import { Drawer } from '@/components/ui/Drawer';
import { Segmented } from '@/components/ui/Segmented';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';
import type { Answers, Project } from '@/types';

interface RequirementDrawerProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  onSave: (answers: Answers) => void;
}

const platformOptions = [
  { value: 'website', label: 'Website' },
  { value: 'mobile', label: 'Aplikasi Seluler' },
  { value: 'desktop', label: 'Aplikasi Desktop' },
  { value: 'unsure', label: 'Belum tahu' },
];

const userOptions = [
  { id: 'self', label: 'Saya sendiri' },
  { id: 'owner', label: 'Pemilik usaha' },
  { id: 'staff', label: 'Karyawan' },
  { id: 'customer', label: 'Pelanggan' },
  { id: 'admin', label: 'Admin' },
  { id: 'public', label: 'Publik' },
];

const yesNoOptions = [
  { value: 'yes', label: 'Ya' },
  { value: 'no', label: 'Tidak' },
  { value: 'unsure', label: 'Belum tahu' },
];

const deviceOptions = [
  { value: 'mobile', label: 'HP' },
  { value: 'desktop', label: 'Laptop' },
  { value: 'both', label: 'Keduanya' },
  { value: 'unsure', label: 'Belum tahu' },
];

const deploymentOptions = [
  { value: 'unsure', label: 'Belum tahu' },
  { value: 'shared', label: 'cPanel' },
  { value: 'vps', label: 'VPS' },
  { value: 'vercel', label: 'Vercel' },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5 border-b border-white/10 pb-5 last:border-0 last:pb-0 text-white">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{label}</p>
        {hint ? <p className="mt-0.5 text-[11px] text-white/40">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function RequirementDrawer({ open, onClose, project, onSave }: RequirementDrawerProps) {
  const [answers, setAnswers] = useState<Answers>(project.answers);
  const { toast } = useToast();

  useEffect(() => {
    if (open) setAnswers(project.answers);
  }, [open, project.answers]);

  const usersValue = Array.isArray(answers.user_type) ? (answers.user_type as string[]) : [];
  const featuresValue = Array.isArray(answers.features) ? (answers.features as string[]) : [];
  const allFeatures = featureOptions(project.idea);

  const toggleArray = (key: 'user_type' | 'features', id: string) => {
    const current = Array.isArray(answers[key]) ? (answers[key] as string[]) : [];
    setAnswers({
      ...answers,
      [key]: current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    });
  };

  const setValue = (key: string, value: string) => setAnswers({ ...answers, [key]: value });

  const handleSave = () => {
    onSave(answers);
    toast({ title: 'Kebutuhan diperbarui', description: 'Cetak biru telah disesuaikan.', variant: 'success' });
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Ubah Kebutuhan"
      description="Sesuaikan kebutuhan aplikasi Anda dengan bahasa sederhana."
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white/60 hover:text-white hover:bg-white/10">
            Batal
          </Button>
          <Button variant="secondary" size="sm" onClick={handleSave} className="bg-white text-black hover:bg-white/90 rounded-full font-semibold">
            Simpan perubahan
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Field label="Aplikasi ini digunakan di mana?">
          <Segmented
            ariaLabel="platform"
            options={platformOptions}
            value={(answers.platform as string) || 'website'}
            onChange={(value) => setValue('platform', value)}
          />
        </Field>

        <Field label="Siapa saja penggunanya?" hint="Boleh pilih lebih dari satu.">
          <div className="flex flex-wrap gap-2">
            {userOptions.map((option) => (
              <Chip
                key={option.id}
                selected={usersValue.includes(option.id)}
                onClick={() => toggleArray('user_type', option.id)}
                className={
                  usersValue.includes(option.id)
                    ? 'border-pink-500/50 bg-pink-500/20 text-pink-300'
                    : 'border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10 hover:text-white'
                }
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Apakah pengguna perlu masuk akun?">
          <Segmented
            ariaLabel="login"
            options={yesNoOptions}
            value={(answers.login as string) || 'yes'}
            onChange={(value) => setValue('login', value)}
          />
        </Field>

        <Field label="Apakah aplikasi menyimpan data?">
          <Segmented
            ariaLabel="data"
            options={yesNoOptions}
            value={(answers.data as string) || 'yes'}
            onChange={(value) => setValue('data', value)}
          />
        </Field>

        <Field label="Paling sering dibuka dari mana?">
          <Segmented
            ariaLabel="device"
            options={deviceOptions}
            value={(answers.device_priority as string) || 'both'}
            onChange={(value) => setValue('device_priority', value)}
          />
        </Field>

        <Field label="Rencana pemasangan aplikasi" hint="Belum tahu? Biarkan kami memilih yang termudah.">
          <Segmented
            ariaLabel="deployment"
            options={deploymentOptions}
            value={(answers.deployment as string) || 'unsure'}
            onChange={(value) => setValue('deployment', value)}
          />
        </Field>

        <Field label="Fitur utama" hint="Pilih fitur yang paling penting bagi Anda.">
          <div className="flex flex-wrap gap-2">
            {allFeatures.map((option) => (
              <Chip
                key={option.id}
                selected={featuresValue.includes(option.id)}
                onClick={() => toggleArray('features', option.id)}
                className={
                  featuresValue.includes(option.id)
                    ? 'border-pink-500/50 bg-pink-500/20 text-pink-300'
                    : 'border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10 hover:text-white'
                }
              >
                {option.title}
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </Drawer>
  );
}
