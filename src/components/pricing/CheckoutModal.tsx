import { AnimatePresence, motion } from 'framer-motion';
import { Check, CreditCard, QrCode, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
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
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'card'>('qris');
  const [processing, setProcessing] = useState(false);

  if (!tier) return null;

  const handlePay = async () => {
    setProcessing(true);
    try {
      // Direct payment code mapping for Duitku POP
      const methodCode = paymentMethod === 'card' ? 'VC' : paymentMethod === 'qris' ? 'SP' : '';

      const invoice = await api.createPaymentInvoice(tier.id, methodCode);

      if (typeof window !== 'undefined' && window.checkout?.process) {
        window.checkout.process(invoice.reference, {
          defaultLanguage: 'id',
          successEvent: async () => {
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
              description: 'Silakan selesaikan pembayaran sesuai instruksi pada layar Duitku.',
              variant: 'default',
            });
          },
          errorEvent: () => {
            toast({
              title: 'Pembayaran Gagal',
              description: 'Transaksi tidak dapat diselesaikan atau dibatalkan.',
              variant: 'error',
            });
            setProcessing(false);
          },
          closeEvent: async () => {
            // Check status on popup close in case payment completed right before close
            try {
              const check = await api.getPaymentStatus(invoice.orderId);
              if (check.status === 'success') {
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
        // Fallback if Duitku JS is not loaded: open payment page in new window
        window.open(invoice.paymentUrl, '_blank');
        toast({
          title: 'Membuka Halaman Pembayaran',
          description: 'Selesaikan pembayaran di tab baru yang telah dibuka.',
          variant: 'default',
        });
        setProcessing(false);
      } else {
        throw new Error('Referensi pembayaran Duitku tidak ditemukan.');
      }
    } catch (error) {
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
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] border border-purple-500/30 bg-[#0E0F18] p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl"
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

          {/* Payment Method Selector */}
          <div className="mt-5 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-medium transition ${
                  paymentMethod === 'qris'
                    ? 'border-purple-500 bg-purple-500/20 text-white shadow-sm'
                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <QrCode size={18} className="mb-1 text-purple-300" />
                <span>QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('va')}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-medium transition ${
                  paymentMethod === 'va'
                    ? 'border-purple-500 bg-purple-500/20 text-white shadow-sm'
                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <CreditCard size={18} className="mb-1 text-purple-300" />
                <span>Virtual Account</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-medium transition ${
                  paymentMethod === 'card'
                    ? 'border-purple-500 bg-purple-500/20 text-white shadow-sm'
                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <CreditCard size={18} className="mb-1 text-purple-300" />
                <span>Kartu Kredit</span>
              </button>
            </div>
          </div>

          {/* Visual simulation content */}
          <div className="mt-4 rounded-xl border border-white/10 bg-[#090A0E] p-3 text-center text-xs text-white/60">
            {paymentMethod === 'qris' && (
              <div className="flex items-center justify-center gap-2 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>QRIS Instant Activation (Gopay, OVO, Dana, BCA, Mandiri)</span>
              </div>
            )}
            {paymentMethod === 'va' && (
              <div className="flex items-center justify-center gap-2 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>BCA, Mandiri, BNI, BRI Virtual Account otomatis terverifikasi</span>
              </div>
            )}
            {paymentMethod === 'card' && (
              <div className="flex items-center justify-center gap-2 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Visa, Mastercard &amp; JCB didukung dengan 3D Secure</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-white/40">
              <ShieldCheck size={14} className="text-purple-400" />
              <span>Duitku Payment • Sandbox</span>
            </div>

            <button
              type="button"
              disabled={processing}
              onClick={handlePay}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-[#7C3AED] hover:from-purple-500 hover:to-[#8B5CF6] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_24px_rgba(109,40,217,0.5)] transition active:scale-95 disabled:opacity-50"
            >
              {processing ? (
                <span>Menyiapkan Duitku...</span>
              ) : (
                <>
                  <Check size={14} strokeWidth={2.4} />
                  <span>Bayar via Duitku POP</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
