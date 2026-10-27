import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { apiGet, assetUrl } from '../../lib/api/client';
import { RouteLoading } from '../../components/loading';
import StatusBadge from '../../components/ui/StatusBadge';
import { RoleTag } from '../../components/ui';
import { initials } from '../../lib/format';

interface AttendanceRecord {
  id: string;
  role: string;
  name: string;
  locationName: string;
  date: string;
  status: string;
}

interface RegistrationRecord {
  id: string;
  type: string;
  status: string;
  firstMeetDate?: string;
  firstMeetSession?: string;
  locationName: string;
  packageName: string;
  createdAt: string;
}

interface StudentProfileData {
  id: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  schoolOrOffice: string;
  tshirtSize: string;
  activeSessions: number;
  attendances?: AttendanceRecord[];
}

interface ServerSiswaDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  isVerified: boolean;
  profilePictureUrl?: string;
  fotoUrl?: string;
  createdAt?: string;
  usia: number;
  lokasi: string;
  paket: string;
  berlakuSd: string;
  studentProfile: StudentProfileData | null;
  registrations: RegistrationRecord[];
}

export default function SiswaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<ServerSiswaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!id) return;

    setLoading(true);
    apiGet<ServerSiswaDetail>(`/siswa/${id}`)
      .then((data) => {
        if (active) setDetail(data);
      })
      .catch((err) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : 'Gagal memuat detail siswa.',
          );
          navigate('/siswa');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, navigate]);

  if (loading || !detail) {
    return <RouteLoading />;
  }

  const profile = detail.studentProfile;
  const photo = assetUrl(detail.profilePictureUrl ?? detail.fotoUrl);
  const attendances = profile?.attendances ?? [];
  const registrations = detail.registrations ?? [];

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Tombol Navigasi Kembali */}
      <div>
        <Link
          to="/siswa"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#0077B6] transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Daftar Siswa
        </Link>
      </div>

      {/* HEADER IDENTITAS UTAMA */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {photo ? (
            <img
              src={photo}
              alt={`Foto ${detail.fullName}`}
              className="h-20 w-20 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-2xl font-bold text-white shrink-0 shadow-2xs">
              {initials(detail.fullName)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-2xl font-bold text-[#1D3557] truncate">
                {detail.fullName}
              </h2>
              <StatusBadge active={detail.isActive} />
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  detail.isVerified
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {detail.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                {detail.email || '-'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" />
                {detail.phone || '-'}
              </span>
              {detail.phone && (
                <a
                  href={`https://wa.me/${detail.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                >
                  WhatsApp
                </a>
              )}
              <span>•</span>
              <span className="font-semibold text-[#0077B6]">{detail.lokasi}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-right max-md:text-left bg-slate-50/80 border border-gray-200 rounded-xl px-4 py-2.5">
            <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">
              Paket Belajar
            </span>
            <span className="text-sm font-bold text-[#0077B6]">{detail.paket}</span>
            <span className="text-xs text-slate-400 block mt-0.5 tabular-nums">
              s/d {detail.berlakuSd}
            </span>
          </div>
        </div>
      </div>

      {/* GRID DATA DETAIL PERSONAL & SESI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KARTU PROFIL MURID */}
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
            <dd className="text-[#0077B6] font-bold">
              {profile?.tshirtSize || '-'}
            </dd>
          </dl>
        </div>

        {/* KARTU SESI & STATUS AKUN */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs">
            <h3 className="font-display text-base font-bold text-[#1D3557] mb-4 pb-2.5 border-b border-gray-100">
              Status Keanggotaan & Kuota Sesi
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#E0FBFC]/50 border border-[#00B4D8]/20 p-4">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Sisa Sesi Aktif
                </span>
                <span className="font-display text-3xl font-extrabold text-[#0077B6] mt-1 block tabular-nums">
                  {profile?.activeSessions ?? 0}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Pertemuan tersisa
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 border border-gray-100 p-4">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Masa Berlaku
                </span>
                <span className="text-base font-bold text-[#1D3557] mt-2 block tabular-nums">
                  {detail.berlakuSd}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Berdasarkan paket aktif
                </span>
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

          {/* RIWAYAT PENDAFTARAN */}
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
                      <span className="font-semibold text-[#1D3557] block">
                        {reg.packageName}
                      </span>
                      <span className="text-slate-400">
                        {reg.locationName} • {new Date(reg.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <RoleTag role={reg.status}>
                      {reg.status}
                    </RoleTag>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIWAYAT KEHADIRAN / ABSENSI */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs">
        <h3 className="font-display text-base font-bold text-[#1D3557] mb-4 pb-2.5 border-b border-gray-100">
          Riwayat Kehadiran Sesi Latihan
        </h3>
        {attendances.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">Belum ada catatan absensi untuk siswa ini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 uppercase text-slate-400 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-[#1D3557] tabular-nums">
                      {new Date(att.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{att.locationName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={att.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
