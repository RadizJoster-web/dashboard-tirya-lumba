import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { apiGet, apiSend, assetUrl } from '../../lib/api/client';
import { Button } from '../../components/ui';
import { RouteLoading } from '../../components/loading';
import PendaftaranRejectModal from './PendaftaranRejectModal';
import type { ServerRegistrationDetail, ServerRegistration } from '../../lib/api/types';

export default function PendaftaranDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<ServerRegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    let active = true;
    if (!id) return;

    setLoading(true);
    apiGet<ServerRegistrationDetail>(`/register/${id}`)
      .then((data) => {
        if (active) setDetail(data);
      })
      .catch((err) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : 'Gagal memuat detail pendaftaran.',
            { style: { color: '#B3341F' } },
          );
          navigate('/pendaftaran');
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

  const isInstructor = detail.type === 'NEW_INSTRUCTOR';
  const user = detail.user;
  const photo = assetUrl(user?.profilePictureUrl ?? detail.profilePictureUrl ?? undefined);
  const cvLink = assetUrl(detail.cvUrl ?? undefined);
  const paymentProofLink = assetUrl(detail.paymentProofUrl ?? undefined);

  const isPending = detail.status === 'PENDING';
  const isApproved = detail.status === 'APPROVED';
  const isRejected = detail.status === 'REJECTED';

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await apiSend(`/register/${detail.id}/approve`, 'POST');
      toast.success(
        `Pendaftaran ${isInstructor ? 'pelatih' : 'murid'} berhasil disetujui.`,
      );
      setDetail((prev) => (prev ? { ...prev, status: 'APPROVED' } : null));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menyetujui pendaftaran.',
        { style: { color: '#B3341F' } },
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    setActionLoading(true);
    try {
      await apiSend(`/register/${detail.id}/reject`, 'POST', {
        rejectionReason: reason,
      });
      toast.error('Pendaftaran telah ditolak.', {
        style: { color: '#B3341F' },
      });
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              status: 'REJECTED',
              rejectionReason: reason,
            }
          : null,
      );
      setShowRejectModal(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menolak pendaftaran.',
        { style: { color: '#B3341F' } },
      );
    } finally {
      setActionLoading(false);
    }
  };

  const dummyTargetForModal: ServerRegistration = {
    id: detail.id,
    type: detail.type,
    status: detail.status,
    name: detail.name || user?.fullName || 'Pendaftar',
    email: detail.email || user?.email || null,
    phone: detail.phone || user?.phone || null,
    lokasi: detail.lokasi,
    birthDate: detail.birthDate,
    profilePictureUrl: detail.profilePictureUrl,
    cvUrl: detail.cvUrl,
    paymentProofUrl: detail.paymentProofUrl,
    rejectionReason: detail.rejectionReason,
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Bar Navigasi & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/pendaftaran"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-ink"
            title="Kembali ke Antrean Pendaftaran"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pendaftaran #{detail.id.slice(0, 8)}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  isInstructor
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {isInstructor ? 'Pelatih Baru' : 'Murid Baru'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">
              Detail Pendaftaran {isInstructor ? 'Pelatih' : 'Murid'}
            </h1>
          </div>
        </div>

        {/* Status Badge & Aksi Cepat Header */}
        <div className="flex items-center gap-2.5">
          {isPending && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Menunggu Persetujuan
            </span>
          )}
          {isApproved && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Telah Disetujui
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-bold text-red-800">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Ditolak
            </span>
          )}

          {isPending && (
            <div className="flex items-center gap-2 pl-2">
              <Button
                variant="danger"
                className="px-3 py-1.5 text-xs min-h-0"
                disabled={actionLoading}
                onClick={() => setShowRejectModal(true)}
              >
                ✕ Tolak
              </Button>
              <Button
                variant="primary"
                className="px-4 py-1.5 text-xs min-h-0 bg-emerald-600 hover:bg-emerald-700"
                disabled={actionLoading}
                onClick={handleApprove}
              >
                ✓ Setujui (ACC)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Grid Tata Letak Utama (Hierarki Penting -> Samping) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ============================================================== */}
        {/* KOLOM UTAMA (KIRI - 2/3 LAYAR)                                  */}
        {/* ============================================================== */}
        <div className="space-y-6 lg:col-span-2">
          {/* TINGKAT 1: IDENTITAS UTAMA PENDAFTAR (PALING PENTING) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {photo ? (
                <img
                  src={photo}
                  alt={detail.name}
                  className="h-20 w-20 rounded-2xl object-cover border-2 border-azure shadow-sm shrink-0"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-azure text-2xl font-extrabold text-primary shrink-0 border-2 border-azure">
                  {(detail.name || user?.fullName || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-ink truncate">
                    {detail.name || user?.fullName || 'Pendaftar'}
                  </h2>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    ID Akun: {user?.id?.slice(0, 8) || '-'}
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="text-slate-400">✉️</span>
                    <a
                      href={`mailto:${detail.email || user?.email}`}
                      className="hover:text-primary truncate"
                    >
                      {detail.email || user?.email || '-'}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="text-slate-400">📞</span>
                    <a
                      href={`tel:${detail.phone || user?.phone}`}
                      className="hover:text-primary font-medium"
                    >
                      {detail.phone || user?.phone || '-'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TINGKAT 2: RINCIAN KELAS & OPERASIONAL */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <h3 className="text-base font-bold text-ink border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>{isInstructor ? '🏊‍♂️' : '🎯'}</span>
              <span>
                {isInstructor
                  ? 'Data Kualifikasi & Lokasi Pelatih'
                  : 'Pilihan Kelas & Jadwal Pertemuan Murid'}
              </span>
            </h3>

            {isInstructor ? (
              // Konten Operasional Pelatih
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Lisensi & Sertifikasi
                    </span>
                    <p className="mt-1 font-semibold text-slate-800">
                      {user?.instructorProfile?.license || 'Belum ada lisensi dicantumkan'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Pengalaman Mengajar
                    </span>
                    <p className="mt-1 font-semibold text-slate-800">
                      {user?.instructorProfile?.experience || 'Belum ada keterangan pengalaman'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Jadwal Ketersediaan Mengajar Terdaftar ({detail.schedules?.length ?? 0} Sesi)
                  </span>
                  {detail.schedules && detail.schedules.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {detail.schedules.map((s, idx) => (
                        <div
                          key={s.id || idx}
                          className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-slate-200 text-xs"
                        >
                          <span className="font-bold text-slate-800">
                            {s.dayOfWeek} • {s.sessionName}
                          </span>
                          <span className="text-slate-500 font-medium">
                            {s.location?.name ? `Kolam ${s.location.name}` : 'Kolam'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Tidak ada data jadwal spesifik terlampir.
                    </p>
                  )}
                </div>

                {user?.instructorProfile?.shortBio && (
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Bio & Ringkasan Diri
                    </span>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {user.instructorProfile.shortBio}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Konten Operasional Murid
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Lokasi Kolam Renang
                    </span>
                    <p className="mt-1 font-bold text-primary">
                      {detail.location?.name
                        ? `Kolam Renang ${detail.location.name}`
                        : detail.lokasi || '-'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Paket Les & Biaya
                    </span>
                    <p className="mt-1 font-bold text-slate-800">
                      {detail.package?.type || 'Paket Les'} —{' '}
                      {detail.package?.price
                        ? `Rp ${Number(detail.package.price).toLocaleString('id-ID')}`
                        : '-'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Rencana Pertemuan Pertama
                    </span>
                    <p className="mt-1 font-semibold text-slate-800">
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
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Pelatih yang Dipilih
                    </span>
                    <p className="mt-1 font-semibold text-slate-800">
                      {detail.instructor?.fullName || 'Belum ditentukan'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TINGKAT 3: VERIFIKASI BERKAS & PEMBAYARAN */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
            <h3 className="text-base font-bold text-ink border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>{isInstructor ? '📄' : '💳'}</span>
              <span>
                {isInstructor
                  ? 'Berkas CV / Portofolio Pelatih'
                  : 'Verifikasi Pembayaran Murid'}
              </span>
            </h3>

            <div className="mt-4">
              {isInstructor ? (
                // Berkas CV Pelatih
                <div>
                  {cvLink ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-red-100 text-lg text-red-600">
                          PDF
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Berkas CV Pelatih
                          </p>
                          <p className="text-xs text-slate-500">
                            Format PDF dokumen pelamar
                          </p>
                        </div>
                      </div>
                      <a
                        href={cvLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover"
                      >
                        Buka & Unduh CV →
                      </a>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                      Pelatih tidak melampirkan berkas CV digital.
                    </div>
                  )}
                </div>
              ) : (
                // Bukti Pembayaran Murid
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-500">Metode Pembayaran: </span>
                      <span className="font-bold text-slate-800">
                        {detail.paymentMethod === 'BANK_TRANSFER'
                          ? 'Transfer Bank'
                          : detail.paymentMethod || '-'}
                      </span>
                    </div>
                    {paymentProofLink && (
                      <a
                        href={paymentProofLink}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        Buka Gambar Ukuran Penuh ↗
                      </a>
                    )}
                  </div>

                  {paymentProofLink ? (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 max-w-md">
                      <img
                        src={paymentProofLink}
                        alt="Bukti Transfer Pembayaran"
                        className="max-h-72 w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                      Tidak ada bukti transfer yang diunggah.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* TINGKAT 4: BIODATA PENDUKUNG & DATA TAMBAHAN */}
          {!isInstructor && user?.studentProfile && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
              <h3 className="text-base font-bold text-ink border-b border-slate-100 pb-3 flex items-center gap-2">
                <span>📋</span>
                <span>Biodata Lengkap Siswa</span>
              </h3>

              <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 text-xs">
                <div>
                  <dt className="font-semibold text-slate-400">Nama Lengkap Murid</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {user.studentProfile.fullName || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Tempat, Tanggal Lahir</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {user.studentProfile.birthPlace || '-'}{' '}
                    {user.studentProfile.birthDate
                      ? `, ${new Date(user.studentProfile.birthDate).toLocaleDateString('id-ID')}`
                      : ''}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Jenis Kelamin</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {user.studentProfile.gender || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Ukuran T-Shirt</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {user.studentProfile.tshirtSize || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Sekolah / Tempat Kerja</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {user.studentProfile.schoolOrOffice || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Alamat Domisili</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">
                    {user.studentProfile.address || '-'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* KOLOM SAMPING (KANAN - 1/3 LAYAR)                               */}
        {/* ============================================================== */}
        <div className="space-y-6">
          {/* PANEL KEPUTUSAN VERIFIKASI */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="font-bold text-ink text-sm border-b border-slate-100 pb-2.5">
              Tindakan Verifikasi
            </h3>

            {isPending ? (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Periksa kelengkapan kualifikasi dan validitas berkas di samping sebelum menyetujui pendaftaran ini.
                </p>

                <Button
                  variant="primary"
                  className="w-full justify-center bg-emerald-600 hover:bg-emerald-700"
                  disabled={actionLoading}
                  onClick={handleApprove}
                >
                  ✓ Setujui Pendaftaran (ACC)
                </Button>

                <Button
                  variant="danger"
                  className="w-full justify-center"
                  disabled={actionLoading}
                  onClick={() => setShowRejectModal(true)}
                >
                  ✕ Tolak Pendaftaran
                </Button>
              </div>
            ) : isApproved ? (
              <div className="mt-4 rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
                <p className="font-bold">✓ Pendaftaran Telah Disetujui</p>
                <p className="mt-1">
                  Akun pengguna telah diaktifkan dengan role {isInstructor ? 'Pelatih' : 'Murid'}.
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-200 text-xs text-red-800 leading-relaxed">
                <p className="font-bold">✕ Pendaftaran Ditolak</p>
                <p className="mt-1 font-semibold">Alasan:</p>
                <p className="mt-0.5 italic">{detail.rejectionReason || 'Tidak ada alasan khusus.'}</p>
              </div>
            )}
          </div>

          {/* PANEL INFORMASI SISTEM */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-3">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Metadata Sistem
            </h4>

            <div>
              <span className="text-slate-400 block font-medium">ID Pendaftaran</span>
              <span className="font-mono text-slate-700 text-[11px] break-all">
                {detail.id}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Tipe Pendaftaran</span>
              <span className="font-bold text-slate-800">
                {detail.type}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Status Database</span>
              <span className="font-bold text-slate-800">
                {detail.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Alasan Penolakan */}
      {showRejectModal && (
        <PendaftaranRejectModal
          rejectTarget={dummyTargetForModal}
          saving={actionLoading}
          onClose={() => setShowRejectModal(false)}
          onConfirmReject={handleRejectSubmit}
        />
      )}
    </div>
  );
}
