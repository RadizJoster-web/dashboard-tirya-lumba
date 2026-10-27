import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Phone, Printer } from 'lucide-react';
import { apiGet, assetUrl } from '../../lib/api/client';
import { Button, RoleTag } from '../../components/ui';
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
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Tombol Navigasi Kembali */}
      <div>
        <Link
          to="/pelatih"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#0077B6] transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Daftar Pelatih
        </Link>
      </div>

      {/* HEADER IDENTITAS UTAMA */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {detailPhoto ? (
            <img
              src={detailPhoto}
              alt={`Foto ${detail.fullName}`}
              className="h-20 w-20 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-xl bg-gradient-to-br from-[#6B21A8] to-[#A855F7] text-2xl font-bold text-white shrink-0 shadow-2xs">
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
                {detail.email ?? '-'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" />
                {detail.phone ?? '-'}
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
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer size={14} className="mr-1.5" />
            Cetak Profil
          </Button>
        </div>
      </div>

      {/* GRID INFORMASI DETAIL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KOLOM KIRI (2 Kolom): Kualifikasi, Pengalaman & Bio */}
        <div className="md:col-span-2 space-y-6">
          {/* Card Kualifikasi Profesional */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-[#1D3557] border-b border-gray-100 pb-3">
              Kualifikasi & Pengalaman Mengajar
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

          {/* Card Lokasi Kolam Mengajar */}
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

        {/* KOLOM KANAN: Metadata Akun */}
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
      </div>
    </div>
  );
}
