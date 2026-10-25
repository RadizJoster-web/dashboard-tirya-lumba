import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { apiGet, assetUrl } from '../../lib/api/client';
import { RouteLoading } from '../../components/loading';
import StatusBadge from '../../components/ui/StatusBadge';
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
            { style: { color: '#B3341F' } },
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
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl">
      {/* Tombol Navigasi Kembali */}
      <div>
        <Link
          to="/siswa"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          <span>←</span> Kembali ke Daftar Siswa
        </Link>
      </div>

      {/* HEADER IDENTITAS UTAMA */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {photo ? (
            <img
              src={photo}
              alt={`Foto ${detail.fullName}`}
              className="h-20 w-20 rounded-full object-cover border-2 border-slate-200 shrink-0 shadow-xs"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full bg-azure text-2xl font-bold text-primary shrink-0 shadow-xs">
              {initials(detail.fullName)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-extrabold text-ink truncate">
                {detail.fullName}
              </h2>
              <StatusBadge active={detail.isActive} />
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  detail.isVerified
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {detail.isVerified ? '✓ Terverifikasi' : '⏳ Belum Terverifikasi'}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500 flex flex-wrap items-center gap-3">
              <span>✉ {detail.email ?? '-'}</span>
              <span>•</span>
              <span>📞 {detail.phone ?? '-'}</span>
              <span>•</span>
              <span className="font-medium text-slate-700">🏊 {detail.lokasi}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-right max-md:text-left bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">
              Paket Belajar
            </span>
            <span className="text-sm font-bold text-primary">{detail.paket}</span>
            <span className="text-xs text-slate-500 block mt-0.5">
              s/d {detail.berlakuSd}
            </span>
          </div>
        </div>
      </div>

      {/* GRID DATA DETAIL PERSONAL & SESI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KARTU PROFIL MURID */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-ink mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span>👤</span> Informasi Pribadi Murid
          </h3>
          <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-3 text-sm">
            <dt className="text-slate-500 font-medium">Nama Lengkap</dt>
            <dd className="text-slate-900 font-semibold">{profile?.fullName || detail.fullName}</dd>

            <dt className="text-slate-500 font-medium">Usia</dt>
            <dd className="text-slate-900">{detail.usia} tahun</dd>

            <dt className="text-slate-500 font-medium">Tempat Lahir</dt>
            <dd className="text-slate-900">{profile?.birthPlace || '-'}</dd>

            <dt className="text-slate-500 font-medium">Tanggal Lahir</dt>
            <dd className="text-slate-900">
              {profile?.birthDate
                ? new Date(profile.birthDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </dd>

            <dt className="text-slate-500 font-medium">Jenis Kelamin</dt>
            <dd className="text-slate-900">
              {profile?.gender === 'MALE' || profile?.gender === 'L'
                ? 'Laki-laki'
                : profile?.gender === 'FEMALE' || profile?.gender === 'P'
                ? 'Perempuan'
                : profile?.gender || '-'}
            </dd>

            <dt className="text-slate-500 font-medium">Alamat Tinggal</dt>
            <dd className="text-slate-900 leading-relaxed">{profile?.address || '-'}</dd>

            <dt className="text-slate-500 font-medium">Sekolah / Kantor</dt>
            <dd className="text-slate-900">{profile?.schoolOrOffice || '-'}</dd>

            <dt className="text-slate-500 font-medium">Ukuran Baju/Kaos</dt>
            <dd className="text-slate-900 font-semibold text-primary">
              {profile?.tshirtSize || '-'}
            </dd>
          </dl>
        </div>

        {/* KARTU SESI & STATUS AKUN */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-ink mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span>🏊</span> Status Keanggotaan & Sesi
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-azure/50 border border-sky-100 p-4">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  Sisa Sesi Aktif
                </span>
                <span className="text-3xl font-extrabold text-primary mt-1 block">
                  {profile?.activeSessions ?? 0}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Sesi pertemuan tersisa
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  Masa Berlaku
                </span>
                <span className="text-lg font-bold text-slate-800 mt-2 block">
                  {detail.berlakuSd}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Berdasarkan paket aktif
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 text-sm space-y-2">
              <div className="flex justify-between items-center text-slate-600">
                <span>Cabang Latihan:</span>
                <span className="font-semibold text-slate-800">{detail.lokasi}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Status Akun:</span>
                <span className="font-semibold">{detail.isActive ? 'Aktif' : 'Non-Aktif'}</span>
              </div>
            </div>
          </div>

          {/* RIWAYAT PENDAFTARAN */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-ink mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span>📝</span> Riwayat Pendaftaran
            </h3>
            {registrations.length === 0 ? (
              <p className="text-sm text-slate-400">Tidak ada riwayat pendaftaran.</p>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block text-sm">
                        {reg.packageName}
                      </span>
                      <span className="text-slate-500">
                        {reg.locationName} • {new Date(reg.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full font-semibold ${
                        reg.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : reg.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIWAYAT KEHADIRAN / ABSENSI */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-base font-bold text-ink mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <span>📅</span> Riwayat Kehadiran Sesi Latihan
        </h3>
        {attendances.length === 0 ? (
          <p className="text-sm text-slate-400 py-3">Belum ada catatan absensi untuk siswa ini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {new Date(att.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">{att.locationName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          att.status === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {att.status}
                      </span>
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
