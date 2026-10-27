import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Check, FileText, Mail, Phone, X, ExternalLink } from 'lucide-react';
import { apiGet, apiSend, assetUrl } from '../../lib/api/client';
import { Button, RoleTag, StatusBadge } from '../../components/ui';
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
      toast.error('Pendaftaran telah ditolak.');
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
    <div className="space-y-6 pb-12">
      {/* 1. Bar Navigasi & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 bg-white p-4 sm:p-5 rounded-xl shadow-2xs">
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
              {detail.name || user?.fullName || 'Pendaftar'}
            </h1>
          </div>
        </div>

        {/* Status Badge & Aksi Cepat Header */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <StatusBadge status={detail.status} />

          {isPending && (
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                disabled={actionLoading}
                onClick={() => setShowRejectModal(true)}
              >
                <X size={14} className="mr-1" />
                Tolak
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={actionLoading}
                onClick={handleApprove}
              >
                <Check size={14} className="mr-1" />
                Setujui
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Grid Tata Letak Utama */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kolom Kiri (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Identitas Pendaftar */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {photo ? (
                <img
                  src={photo}
                  alt={detail.name}
                  className="h-20 w-20 rounded-xl object-cover border border-gray-200 shadow-2xs shrink-0"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-2xl font-bold text-white shrink-0 shadow-2xs">
                  {(detail.name || user?.fullName || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-[#1D3557] truncate">
                    {detail.name || user?.fullName || 'Pendaftar'}
                  </h2>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    ID: {user?.id?.slice(0, 8) || '-'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${detail.email || user?.email}`}
                      className="hover:text-[#0077B6] truncate"
                    >
                      {detail.email || user?.email || '-'}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <a
                      href={`tel:${detail.phone || user?.phone}`}
                      className="hover:text-[#0077B6] font-medium"
                    >
                      {detail.phone || user?.phone || '-'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Operasional & Kelas */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
            <h3 className="font-display text-base font-bold text-[#1D3557] border-b border-gray-100 pb-3">
              {isInstructor ? 'Data Kualifikasi & Lokasi Mengajar' : 'Pilihan Kelas & Jadwal Murid'}
            </h3>

            {isInstructor ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Lisensi & Sertifikasi
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
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Jadwal Ketersediaan Mengajar ({detail.schedules?.length ?? 0} Sesi)
                  </span>
                  {detail.schedules && detail.schedules.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {detail.schedules.map((s, idx) => (
                        <div
                          key={s.id || idx}
                          className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-gray-200 text-xs"
                        >
                          <span className="font-semibold text-[#1D3557]">
                            {s.dayOfWeek} • {s.sessionName}
                          </span>
                          <span className="text-slate-500">
                            {s.location?.name ? `Kolam ${s.location.name}` : 'Kolam'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Tidak ada jadwal spesifik terlampir.
                    </p>
                  )}
                </div>

                {user?.instructorProfile?.shortBio && (
                  <div className="rounded-lg bg-slate-50/80 p-3.5 border border-gray-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Bio & Ringkasan Diri
                    </span>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {user.instructorProfile.shortBio}
                    </p>
                  </div>
                )}
              </div>
            ) : (
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
                      Paket Les & Biaya
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
            )}
          </div>

          {/* Lampiran Dokumen (CV atau Bukti Pembayaran) */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
            <h3 className="font-display text-base font-bold text-[#1D3557] border-b border-gray-100 pb-3">
              {isInstructor ? 'Berkas CV Pelatih' : 'Verifikasi Pembayaran Kursus'}
            </h3>

            <div className="mt-4">
              {isInstructor ? (
                <div>
                  {cvLink ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-slate-50/70 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1D3557]">
                            Berkas CV Pelamar
                          </p>
                          <p className="text-xs text-slate-400">
                            Dokumen digital kurikulum vitae
                          </p>
                        </div>
                      </div>
                      <a
                        href={cvLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0077B6] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#005f8f] transition-colors"
                      >
                        Buka & Unduh CV
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-slate-400">
                      Pelatih tidak melampirkan berkas CV digital.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-500">Metode: </span>
                      <span className="font-bold text-[#1D3557]">
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
                        className="inline-flex items-center gap-1 font-semibold text-[#0077B6] hover:underline"
                      >
                        Buka Gambar Penuh <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {paymentProofLink ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-slate-50 max-w-md">
                      <img
                        src={paymentProofLink}
                        alt="Bukti Transfer Pembayaran"
                        className="max-h-72 w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-slate-400">
                      Tidak ada bukti transfer yang diunggah.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Biodata Lengkap Tambahan Siswa */}
          {!isInstructor && user?.studentProfile && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xs">
              <h3 className="font-display text-base font-bold text-[#1D3557] border-b border-gray-100 pb-3">
                Biodata Lengkap Siswa
              </h3>

              <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 text-xs">
                <div>
                  <dt className="font-semibold text-slate-400">Nama Lengkap Murid</dt>
                  <dd className="font-medium text-[#1D3557] mt-0.5">
                    {user.studentProfile.fullName || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Tempat, Tanggal Lahir</dt>
                  <dd className="font-medium text-[#1D3557] mt-0.5">
                    {user.studentProfile.birthPlace || '-'}{' '}
                    {user.studentProfile.birthDate
                      ? `, ${new Date(user.studentProfile.birthDate).toLocaleDateString('id-ID')}`
                      : ''}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Jenis Kelamin</dt>
                  <dd className="font-medium text-[#1D3557] mt-0.5">
                    {user.studentProfile.gender || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Ukuran T-Shirt</dt>
                  <dd className="font-medium text-[#1D3557] mt-0.5">
                    {user.studentProfile.tshirtSize || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Sekolah / Instansi</dt>
                  <dd className="font-medium text-[#1D3557] mt-0.5">
                    {user.studentProfile.schoolOrOffice || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-400">Alamat Domisili</dt>
                  <dd className="font-medium text-[#1D3557] mt-0.5">
                    {user.studentProfile.address || '-'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {/* Kolom Kanan (1/3) */}
        <div className="space-y-6">
          {/* Panel Keputusan Verifikasi */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
            <h3 className="font-display font-bold text-[#1D3557] text-sm border-b border-gray-100 pb-2.5">
              Tindakan Verifikasi
            </h3>

            {isPending ? (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Periksa kelengkapan kualifikasi dan berkas di samping sebelum memberikan keputusan verifikasi.
                </p>

                <Button
                  variant="primary"
                  className="w-full justify-center"
                  disabled={actionLoading}
                  onClick={handleApprove}
                >
                  <Check size={16} className="mr-1.5" />
                  Setujui Pendaftaran
                </Button>

                <Button
                  variant="danger"
                  className="w-full justify-center"
                  disabled={actionLoading}
                  onClick={() => setShowRejectModal(true)}
                >
                  <X size={16} className="mr-1.5" />
                  Tolak Pendaftaran
                </Button>
              </div>
            ) : isApproved ? (
              <div className="mt-4 rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-xs text-emerald-800 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5">
                  <Check size={16} /> Pendaftaran Telah Disetujui
                </p>
                <p className="mt-1">
                  Akun pengguna telah aktif dengan peran {isInstructor ? 'Pelatih' : 'Murid'}.
                </p>
              </div>
            ) : isRejected ? (
              <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-200 text-xs text-red-800 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5">
                  <X size={16} /> Pendaftaran Ditolak
                </p>
                <p className="mt-1 font-semibold">Alasan:</p>
                <p className="mt-0.5 italic">{detail.rejectionReason || 'Tidak ada alasan khusus.'}</p>
              </div>
            ) : null}
          </div>

          {/* Panel Metadata Sistem */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs text-xs space-y-3">
            <h4 className="font-semibold text-slate-400 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
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
              <span className="font-bold text-[#1D3557]">
                {detail.type}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Status</span>
              <span className="font-bold text-[#1D3557]">
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
