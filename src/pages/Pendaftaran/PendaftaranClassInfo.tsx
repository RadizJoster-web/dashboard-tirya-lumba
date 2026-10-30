import React from 'react';
import type { ServerRegistrationDetail } from '../../lib/api/types';
import { PendaftaranScheduleTable } from './PendaftaranScheduleTable';

export const PendaftaranInstructorClassInfo: React.FC<{
  detail: ServerRegistrationDetail;
}> = ({ detail }) => {
  const user = detail.user;
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Lisensi &amp; Sertifikasi
          </span>
          <p className="mt-1 font-semibold text-[#1D3557]">
            {user?.instructorProfile?.license || 'Belum ada lisensi dicantumkan'}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Pengalaman Mengajar
          </span>
          <p className="mt-1 font-semibold text-[#1D3557]">
            {user?.instructorProfile?.experience || 'Belum ada keterangan pengalaman'}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Jadwal Ketersediaan Mengajar ({detail.schedules?.length ?? 0} Sesi)
        </span>
        <PendaftaranScheduleTable schedules={detail.schedules} />
      </div>

      {user?.instructorProfile?.shortBio && (
        <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Bio &amp; Ringkasan Diri
          </span>
          <p className="mt-1 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {user.instructorProfile.shortBio}
          </p>
        </div>
      )}
    </div>
  );
};

export const PendaftaranStudentClassInfo: React.FC<{
  detail: ServerRegistrationDetail;
}> = ({ detail }) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Lokasi Kolam Renang
          </span>
          <p className="mt-1 font-bold text-[#0077B6]">
            {detail.location?.name
              ? `Kolam Renang ${detail.location.name}`
              : detail.lokasi || '-'}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Paket Les &amp; Biaya
          </span>
          <p className="mt-1 font-bold text-[#1D3557]">
            {detail.package?.type || 'Paket Les'} —{' '}
            {detail.package?.price
              ? `Rp ${Number(detail.package.price).toLocaleString('id-ID')}`
              : '-'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Rencana Pertemuan Pertama
          </span>
          <p className="mt-1 font-semibold text-[#1D3557] text-xs">
            {detail.firstMeetDate
              ? new Date(detail.firstMeetDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '-'}{' '}
            • {detail.firstMeetSession || '-'}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Pelatih yang Dipilih
          </span>
          <p className="mt-1 font-semibold text-[#1D3557] text-xs">
            {detail.instructor?.fullName || 'Belum ditentukan'}
          </p>
        </div>
      </div>
    </div>
  );
};
