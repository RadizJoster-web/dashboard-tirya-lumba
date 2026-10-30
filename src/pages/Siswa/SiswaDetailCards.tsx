import React from 'react';
import { RoleTag } from '../../components/ui';
import type {
  RegistrationRecord,
  ServerSiswaDetail,
  StudentProfileData,
} from './siswaDetailTypes';

export const SiswaPersonalInfoCard: React.FC<{
  profile: StudentProfileData | null;
  detail: ServerSiswaDetail;
}> = ({ profile, detail }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs">
      <h3 className="font-display text-base font-bold text-[#1D3557] mb-4 pb-2.5 border-b border-gray-100">
        Informasi Pribadi Murid
      </h3>
      <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-3 text-xs">
        <dt className="text-slate-400 font-semibold uppercase">Nama Lengkap</dt>
        <dd className="text-[#1D3557] font-semibold">{profile?.fullName || detail.fullName}</dd>

        <dt className="text-slate-400 font-semibold uppercase">Usia</dt>
        <dd className="text-[#1D3557]">{detail.usia} tahun</dd>

        <dt className="text-slate-400 font-semibold uppercase">Tempat Lahir</dt>
        <dd className="text-[#1D3557]">{profile?.birthPlace || '-'}</dd>

        <dt className="text-slate-400 font-semibold uppercase">Tanggal Lahir</dt>
        <dd className="text-[#1D3557]">
          {profile?.birthDate
            ? new Date(profile.birthDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '-'}
        </dd>

        <dt className="text-slate-400 font-semibold uppercase">Jenis Kelamin</dt>
        <dd className="text-[#1D3557]">
          {profile?.gender === 'MALE' || profile?.gender === 'L'
            ? 'Laki-laki'
            : profile?.gender === 'FEMALE' || profile?.gender === 'P'
            ? 'Perempuan'
            : profile?.gender || '-'}
        </dd>

        <dt className="text-slate-400 font-semibold uppercase">Alamat Tinggal</dt>
        <dd className="text-[#1D3557] leading-relaxed">{profile?.address || '-'}</dd>

        <dt className="text-slate-400 font-semibold uppercase">Sekolah / Instansi</dt>
        <dd className="text-[#1D3557]">{profile?.schoolOrOffice || '-'}</dd>

        <dt className="text-slate-400 font-semibold uppercase">Ukuran Kaos</dt>
        <dd className="text-[#0077B6] font-bold">{profile?.tshirtSize || '-'}</dd>
      </dl>
    </div>
  );
};

export const SiswaSessionAndRegistrationsCard: React.FC<{
  profile: StudentProfileData | null;
  detail: ServerSiswaDetail;
  registrations: RegistrationRecord[];
}> = ({ profile, detail, registrations }) => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs">
        <h3 className="font-display text-base font-bold text-[#1D3557] mb-4 pb-2.5 border-b border-gray-100">
          Status Keanggotaan &amp; Kuota Sesi
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#E0FBFC]/50 border border-[#00B4D8]/20 p-4">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
              Sisa Sesi Aktif
            </span>
            <span className="font-display text-3xl font-extrabold text-[#0077B6] mt-1 block tabular-nums">
              {profile?.activeSessions ?? 0}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">Pertemuan tersisa</span>
          </div>
          <div className="rounded-xl bg-slate-50 border border-gray-100 p-4">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
              Masa Berlaku
            </span>
            <span className="text-base font-bold text-[#1D3557] mt-2 block tabular-nums">
              {detail.berlakuSd}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">Berdasarkan paket aktif</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span>Cabang Latihan:</span>
            <span className="font-semibold text-[#1D3557]">{detail.lokasi}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Status Akun:</span>
            <span className="font-semibold">{detail.isActive ? 'Aktif' : 'Non-Aktif'}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs">
        <h3 className="font-display text-base font-bold text-[#1D3557] mb-4 pb-2.5 border-b border-gray-100">
          Riwayat Pendaftaran
        </h3>
        {registrations.length === 0 ? (
          <p className="text-xs text-slate-400">Tidak ada riwayat pendaftaran.</p>
        ) : (
          <div className="space-y-2.5">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-gray-100 text-xs"
              >
                <div>
                  <span className="font-semibold text-[#1D3557] block">{reg.packageName}</span>
                  <span className="text-slate-400">
                    {reg.locationName} • {new Date(reg.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <RoleTag role={reg.status}>{reg.status}</RoleTag>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
