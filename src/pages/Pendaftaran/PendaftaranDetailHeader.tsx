import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RoleTag, StatusBadge } from '../../components/ui';
import type { ServerRegistrationDetail } from '../../lib/api/types';

interface HeaderProps {
  detail: ServerRegistrationDetail;
  isInstructor: boolean;
}

export const PendaftaranDetailHeader: React.FC<HeaderProps> = ({
  detail,
  isInstructor,
}) => {
  const name = detail.name || detail.user?.fullName || 'Pendaftar';

  return (
    <div className="anim-enter flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 bg-white p-4 sm:p-5 rounded-xl shadow-2xs">
      <div className="flex items-center gap-3">
        <Link
          to="/pendaftaran"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#0077B6]"
          title="Kembali ke Antrean"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pendaftaran #{detail.id.slice(0, 8)}
            </span>
            <RoleTag role={isInstructor ? 'instructor' : 'student'}>
              {isInstructor ? 'Pelatih Baru' : 'Murid Baru'}
            </RoleTag>
          </div>
          <h1 className="font-display text-lg sm:text-2xl font-bold text-[#1D3557] truncate mt-0.5">
            {name}
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <StatusBadge status={detail.status} />
      </div>
    </div>
  );
};
