import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  description?: ReactNode;
}

export default function Modal({
  title,
  onClose,
  children,
  footer,
  wide = false,
  size,
  description,
}: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Determine max width
  let maxWidth = wide ? 'max-w-2xl' : 'max-w-md';
  if (size === 'sm') maxWidth = 'max-w-sm';
  if (size === 'md') maxWidth = 'max-w-lg';
  if (size === 'lg') maxWidth = 'max-w-2xl';
  if (size === 'xl') maxWidth = 'max-w-3xl';

  return (
    <div
      role="presentation"
      className="anim-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`anim-modal relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl ${maxWidth}`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-4 sm:px-6 py-3.5 sm:py-4.5 bg-white">
          <div className="pr-4">
            <h3 className="font-display text-base sm:text-lg font-bold text-[#1D3557]">
              {title}
            </h3>
            {description && (
              <p className="mt-0.5 text-xs text-slate-500 font-normal">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="border-t border-gray-100 bg-slate-50/70 px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
