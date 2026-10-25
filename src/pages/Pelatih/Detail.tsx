import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { apiGet, assetUrl } from '../../lib/api/client';
import { Button } from '../../components/ui';
import StatusBadge from '../../components/ui/StatusBadge';
import { RouteLoading } from '../../components/loading';
import { initials } from '../../lib/format';
import type { ServerInstructorDetail } from '../../lib/api/types';

export default function PelatihDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<ServerInstructorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!id) return;

    setLoading(true);
    apiGet<ServerInstructorDetail>(`/instructor/management/${id}`)
      .then((data) => {
        if (active) setDetail(data);
      })
      .catch((err) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : 'Gagal memuat detail pelatih.',
            { style: { color: '#B3341F' } },
          );
          navigate('/pelatih');
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

  const profile = detail.instructorProfile;
  const detailPhoto = assetUrl(detail.profilePictureUrl);
  const locations = profile?.locations ?? [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl">
      {/* Tombol Navigasi Kembali */}
      <div>
        <Link
          to="/pelatih"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          <span>←</span> Kembali ke Daftar Pelatih
        </Link>
      </div>

      {/* HEADER IDENTITAS UTAMA */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {detailPhoto ? (
            <img
              src={detailPhoto}
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
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => window.print()}
          >
            🖨 Cetak Profil
          </Button>
        </div>
      </div>

      {/* GRID INFORMASI DETAIL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KOLOM KIRI (2 Kolom): Kualifikasi, Pengalaman & Bio */}
        <div className="md:col-span-2 space-y-6">
          {/* Card Kualifikasi Profesional */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-ink border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>🏅</span> Kualifikasi & Pengalaman Mengajar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Lisensi / Sertifikat
                </span>
                <p className="font-semibold text-slate-800">
                  {profile?.license || 'Belum ada data lisensi'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Pengalaman Mengajar
                </span>
                <p className="font-semibold text-slate-800">
                  {profile?.experience || 'Belum ada data pengalaman'}
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1.5">
                Profil Singkat (Bio)
              </span>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                "{profile?.shortBio || 'Pelatih belum mengisi bio profil.'}"
              </div>
            </div>
          </div>

          {/* Card Lokasi Kolam Mengajar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-ink border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>🏊</span> Lokasi Kolam yang Ditugaskan ({locations.length})
            </h3>

            {locations.length === 0 ? (
              <p className="text-sm text-slate-400 italic">
                Belum ada lokasi kolam yang ditugaskan ke pelatih ini.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-2xs space-y-1"
                  >
                    <p className="font-bold text-sm text-primary">{loc.name}</p>
                    <p className="text-xs text-slate-500">
                      Wilayah: {loc.area?.name ?? 'Umum'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: Metadata & Ringkasan Sistem */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-ink border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>ℹ️</span> Informasi Akun
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
                <span className="font-bold text-slate-800">INSTRUCTOR (Pelatih)</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Status Akun</span>
                <span className="font-bold text-slate-800">
                  {detail.isActive ? 'Aktif Mengajar' : 'Nonaktif'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Verifikasi Admin</span>
                <span className="font-bold text-slate-800">
                  {detail.isVerified ? 'Sudah Terverifikasi' : 'Pending / Belum'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
