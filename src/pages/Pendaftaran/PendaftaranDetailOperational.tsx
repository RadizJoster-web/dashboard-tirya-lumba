import React from 'react';
import { Mail, Phone } from 'lucide-react';
import type { ServerRegistrationDetail } from '../../lib/api/types';
import {
  PendaftaranInstructorClassInfo,
  PendaftaranStudentClassInfo,
} from './PendaftaranClassInfo';

interface OperationalProps {
  detail: ServerRegistrationDetail;
  isInstructor: boolean;
  photo: string;
}

export const PendaftaranDetailOperational: React.FC<OperationalProps> = ({
  detail,
  isInstructor,
  photo,
}) => {
  const user = detail.user;
  const name = detail.name || user?.fullName || 'Pendaftar';

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="h-20 w-20 rounded-xl object-cover border border-gray-200 shadow-2xs shrink-0"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-2xl font-bold text-white shrink-0 shadow-2xs">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-bold text-[#1D3557] truncate">
                {name}
              </h2>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                ID: {user?.id?.slice(0, 8) || '-'}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <a href={`mailto:${detail.email || user?.email}`} className="hover:text-[#0077B6] truncate">
                  {detail.email || user?.email || '-'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <a href={`tel:${detail.phone || user?.phone}`} className="hover:text-[#0077B6] font-medium">
                  {detail.phone || user?.phone || '-'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
        <h3 className="font-display text-base font-bold text-[#1D3557] border-b border-gray-100 pb-3">
          {isInstructor ? 'Data Kualifikasi & Lokasi Mengajar' : 'Pilihan Kelas & Jadwal Murid'}
        </h3>

        {isInstructor ? (
          <PendaftaranInstructorClassInfo detail={detail} />
        ) : (
          <PendaftaranStudentClassInfo detail={detail} />
        )}
      </div>
    </>
  );
};
