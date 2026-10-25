import type { RefObject } from 'react';
import { Bell } from 'lucide-react';

export interface NotificationItem {
  key: string;
  label: string;
  count: number;
  path: string;
}

interface NotificationMenuProps {
  bellRef: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  total: number;
  items: NotificationItem[];
  onToggle: () => void;
  onClose: () => void;
  onSelect: (path: string) => void;
}

export default function NotificationMenu({
  bellRef,
  isOpen,
  total,
  items,
  onToggle,
  onClose,
  onSelect,
}: NotificationMenuProps) {
  return (
    <div className="relative">
      <button
        ref={bellRef}
        type="button"
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={total > 0 ? `${total} notifikasi baru` : 'Notifikasi'}
        title="Notifikasi"
        className="relative grid min-h-[44px] min-w-[44px] place-items-center rounded-xl text-slate-500 transition-colors hover:bg-azure hover:text-primary"
      >
        <Bell size={20} aria-hidden="true" />
        {total > 0 ? (
          <span className="absolute top-1 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#B3341F] px-1 text-[11px] font-bold text-white">
            {total}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 z-10 cursor-default bg-transparent"
          />
          <div className="absolute right-0 z-20 mt-2 w-[300px] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
            {items.length === 0 ? (
              <p className="px-3 py-5 text-center text-sm text-slate-500">Tidak ada notifikasi baru.</p>
            ) : (
              items.map((it) => (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => onSelect(it.path)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-azure"
                >
                  <span className="flex-1">{it.label}</span>
                  <span className="rounded-full bg-[#B3341F] px-2 py-0.5 text-[11px] font-bold text-white">{it.count}</span>
                </button>
              ))
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
