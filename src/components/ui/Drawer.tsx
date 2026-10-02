import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ open, onClose, title, description, children, footer }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : 'Panel'}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0E0F16] text-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div className="min-w-0">
                {title ? <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2> : null}
                {description ? <p className="mt-1 text-xs text-white/50">{description}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Tutup panel"
              >
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer ? <div className="border-t border-white/10 px-6 py-4">{footer}</div> : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
