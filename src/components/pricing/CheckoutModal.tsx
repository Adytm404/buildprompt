import { AnimatePresence, motion } from 'framer-motion';
import { Check, ShieldCheck, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import type { PricingTier } from './PricingCard';

interface CheckoutModalProps {
  tier: PricingTier | null;
  onClose: () => void;
}

export function CheckoutModal({ tier, onClose }: CheckoutModalProps) {
  const { refresh } = useAuth();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const pollTimerRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollTimerRef.current !== null) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  if (!tier) return null;

  const startPolling = (orderId: string) => {
    stopPolling();
    pollTimerRef.current = window.setInterval(async () => {
      try {
        const check = await api.getPaymentStatus(orderId);
        if (check.status === 'success') {
          stopPolling();
          toast({
            title: 'Pembayaran Diterima!',
            description: `Selamat, akun Anda telah aktif pada paket ${tier.name}.`,
            variant: 'success',
          });
          await refresh();
          onClose();
        }
      } catch {
        // keep polling
      }
    }, 3500);
  };

  const handlePay = async () => {
    setProcessing(true);
    try {
      const invoice = await api.createPaymentInvoice(tier.id);
      startPolling(invoice.orderId);

      if (typeof window !== 'undefined' && window.checkout?.process) {
        window.checkout.process(invoice.reference, {
          defaultLanguage: 'id',
          successEvent: async () => {
            stopPolling();
            try {
              await api.getPaymentStatus(invoice.orderId);
            } catch {}
            toast({
              title: 'Pembayaran Diterima!',
              description: `Selamat, akun Anda telah aktif pada paket ${tier.name}.`,
              variant: 'success',
            });
            await refresh();
            onClose();
          },
          pendingEvent: () => {
            toast({
              title: 'Menunggu Pembayaran',
              description: 'Silakan selesaikan pembayaran sesuai instruksi pada layar pembayaran.',
              variant: 'default',
            });
          },
          errorEvent: () => {
            stopPolling();
            toast({
              title: 'Pembayaran Gagal',
              description: 'Transaksi tidak dapat diselesaikan atau dibatalkan.',
              variant: 'error',
            });
            setProcessing(false);
          },
          closeEvent: async () => {
            try {
              const check = await api.getPaymentStatus(invoice.orderId);
              if (check.status === 'success') {
                stopPolling();
                toast({
                  title: 'Pembayaran Sukses!',
                  description: `Akun Anda telah diaktifkan ke paket ${tier.name}.`,
                  variant: 'success',
                });
                await refresh();
                onClose();
                return;
              }
            } catch {
              // ignore check failure on close
            }
            setProcessing(false);
          },
        });
      } else if (invoice.paymentUrl) {
        window.open(invoice.paymentUrl, '_blank');
        toast({
          title: 'Membuka Halaman Pembayaran',
          description: 'Selesaikan pembayaran di tab baru yang telah dibuka.',
          variant: 'default',
        });
        setProcessing(false);
      } else {
        stopPolling();
        throw new Error('Referensi pembayaran tidak ditemukan.');
      }
    } catch (error) {
      stopPolling();
      toast({
        title: 'Gagal memproses pembayaran',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'error',
      });
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-purple-500/30 bg-[#0E0F18] p-6 sm:p-7 text-white shadow-2xl backdrop-blur-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
            aria-label="Tutup"
          >
            <X size={17} />
          </button>

          {/* Header */}
          <div className="border-b border-white/10 pb-4">
            <span className="text-[11px] font-compact font-bold uppercase tracking-wider text-purple-400">
              Konfirmasi Langganan
            </span>
            <h2 className="mt-1 text-2xl font-bold font-rounded text-white">
              Upgrade ke {tier.name}
            </h2>
            <p className="mt-1 text-xs text-white/50">{tier.tagline}</p>
          </div>

          {/* Order Summary Box */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Paket</span>
              <span className="font-semibold text-white">{tier.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Masa Berlaku</span>
              <span className="font-semibold text-white">{tier.period}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Kuota PRD</span>
              <span className="font-semibold text-emerald-400">{tier.quotaLabel}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">Total Tagihan</span>
              <span className="font-mono text-xl font-bold text-white">{tier.price}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-white/40">
              <ShieldCheck size={14} className="text-purple-400" />
              <span>Pembayaran Aman &amp; Otomatis</span>
            </div>

            <button
              type="button"
              disabled={processing}
              onClick={handlePay}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-[#7C3AED] hover:from-purple-500 hover:to-[#8B5CF6] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_24px_rgba(109,40,217,0.5)] transition active:scale-95 disabled:opacity-50"
            >
              {processing ? (
                <span>Menyiapkan Pembayaran...</span>
              ) : (
                <>
                  <Check size={14} strokeWidth={2.4} />
                  <span>Bayar Sekarang</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
