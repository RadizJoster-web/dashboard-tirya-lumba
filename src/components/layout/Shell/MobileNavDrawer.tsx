import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { X } from 'lucide-react';

export interface MoreItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  isAdmin: boolean;
  items: MoreItem[];
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  onClose,
  isAdmin,
  items,
}) => {
  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-xs min-[861px]:hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full rounded-t-2xl border-t border-gray-200 bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-[#1D3557]">
              Menu Selengkapnya
            </h3>
            <p className="text-xs text-slate-400">
              {isAdmin ? 'Akses master data dan konfigurasi' : 'Navigasi dan profil'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 py-4">
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-slate-50/70 p-3 text-xs font-semibold text-[#1D3557] hover:bg-[#E0FBFC] hover:text-[#0077B6] hover:border-[#00B4D8]/30 transition-all"
              >
                <ItemIcon size={18} className="text-[#0077B6] shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
