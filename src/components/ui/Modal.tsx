import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export default function Modal({ title, onClose, children, footer, wide = false }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="anim-overlay fixed inset-0 z-10 grid place-items-center bg-[#0b1a2c88] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label={title} className={`anim-modal max-h-[90vh] w-full overflow-auto rounded-lg bg-white p-[22px] shadow-xl ${wide ? 'max-w-[720px]' : 'max-w-[440px]'}`}>
        <h3 className="mb-3.5 text-lg">{title}</h3>
        {children}
        {footer ? <div className="mt-1.5 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}
