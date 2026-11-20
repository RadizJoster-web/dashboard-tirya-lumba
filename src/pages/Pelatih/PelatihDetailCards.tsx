import React from 'react';
import { RoleTag } from '../../components/ui';
import type { ServerInstructorDetail } from '../../lib/api/types';

interface CardsProps {
  detail: ServerInstructorDetail;
}

export const PelatihQualificationsCard: React.FC<CardsProps> = ({ detail }) => {
  const profile = detail.instructorProfile;
  const locations = profile?.locations ?? [];

  return (
    <div className="md:col-span-2 space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
        <h3 className="font-display text-base font-bold text-[#1D3557] border-b border-gray-100 pb-3">
          Kualifikasi &amp; Pengalaman Mengajar
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg bg-slate-50/80 p-4 border border-gray-100">
            <span className="text-slate-400 font-semibold uppercase block mb-1">
              Lisensi / Sertifikat
            </span>
            <p className="font-bold text-[#1D3557] text-sm">
              {profile?.license || 'Belum ada data lisensi'}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50/80 p-4 border border-gray-100">
            <span className="text-slate-400 font-semibold uppercase block mb-1">
              Pengalaman Mengajar
            </span>
            <p className="font-bold text-[#1D3557] text-sm">
              {profile?.experience || 'Belum ada data pengalaman'}
            </p>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase block mb-1.5">
            Profil Singkat (Bio)
          </span>
          <div className="rounded-lg bg-slate-50/80 p-4 border border-gray-100 text-xs text-slate-700 leading-relaxed italic">
            "{profile?.shortBio || 'Pelatih belum mengisi bio profil.'}"
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
        <h3 className="font-display text-base font-bold text-[#1D3557] border-b border-gray-100 pb-3">
          Lokasi Kolam yang Ditugaskan ({locations.length})
        </h3>

        {locations.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Belum ada lokasi kolam yang ditugaskan ke pelatih ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/50 shadow-2xs space-y-1"
              >
                <p className="font-bold text-xs text-[#0077B6]">{loc.name}</p>
                <p className="text-[11px] text-slate-500">
                  Wilayah: {loc.area?.name ?? 'Umum'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const PelatihAccountMetadataCard: React.FC<CardsProps> = ({ detail }) => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
        <h3 className="font-display text-base font-bold text-[#1D3557] border-b border-gray-100 pb-3">
          Informasi Akun
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">User ID</span>
            <span className="font-mono text-slate-700 text-[11px] break-all">
              {detail.id}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Peran Pengguna</span>
            <div className="mt-1">
              <RoleTag role="instructor">INSTRUCTOR (Pelatih)</RoleTag>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Status Akun</span>
            <span className="font-bold text-[#1D3557]">
              {detail.isActive ? 'Aktif Mengajar' : 'Non-Aktif'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Verifikasi Admin</span>
            <span className="font-bold text-[#1D3557]">
              {detail.isVerified ? 'Sudah Terverifikasi' : 'Pending / Belum'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
