import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import { assetUrl } from '../../lib/api/client';
import type { ServerRegistrationDetail } from '../../lib/api/types';

interface PendaftaranDetailModalProps {
  detail: ServerRegistrationDetail | null;
  isLoading: boolean;
  actionLoading: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function PendaftaranDetailModal({
  detail,
  isLoading,
  actionLoading,
  onClose,
  onApprove,
  onReject,
}: PendaftaranDetailModalProps) {
  if (!detail && !isLoading) return null;

  if (isLoading || !detail) {
    return (
      <Modal title="Detail Pendaftaran" onClose={onClose}>
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      </Modal>
    );
  }

  const isInstructor = detail.type === 'NEW_INSTRUCTOR';
  const user = detail.user;
  const photo = assetUrl(user?.profilePictureUrl ?? detail.profilePictureUrl ?? undefined);
  const cvLink = assetUrl(detail.cvUrl ?? undefined);
  const paymentProofLink = assetUrl(detail.paymentProofUrl ?? undefined);

  return (
    <Modal
      title={isInstructor ? 'Detail Pendaftaran Pelatih' : 'Detail Pendaftaran Murid'}
      onClose={onClose}
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <Button variant="ghost" onClick={onClose} disabled={actionLoading}>
            Tutup
          </Button>
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={() => onReject(detail.id)}
              disabled={actionLoading}
            >
              Tolak
            </Button>
            <Button
              variant="primary"
              onClick={() => onApprove(detail.id)}
              disabled={actionLoading}
            >
              {actionLoading ? 'Memproses…' : 'Approve'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-sm">
        {/* Header Profil */}
        <div className="flex items-center gap-3.5 rounded-xl bg-slate-50 p-3.5 border border-gray-100">
          {photo ? (
            <img
              src={photo}
              alt={detail.name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-full bg-azure font-display text-lg font-bold text-primary">
              {detail.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-bold text-base text-ink truncate">{detail.name}</h4>
            <p className="text-xs text-slate-500 truncate">{detail.email ?? '-'}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                isInstructor ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {isInstructor ? 'Calon Pelatih' : 'Calon Murid'}
            </span>
          </div>
        </div>

        {/* Detail Konten Khusus Pelatih */}
        {isInstructor ? (
          <div className="space-y-3.5">
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                Profil & Kualifikasi
              </h5>
              <div className="grid grid-cols-2 gap-2.5 rounded-lg border border-gray-100 bg-white p-3">
                <div>
                  <span className="text-xs text-slate-500">No. Telepon / WA</span>
                  <p className="font-semibold text-ink">{detail.phone ?? user?.phone ?? '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Lisensi</span>
                  <p className="font-semibold text-ink">{user?.instructorProfile?.license ?? '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Pengalaman</span>
                  <p className="font-semibold text-ink">{user?.instructorProfile?.experience ?? '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Berkas CV</span>
                  <div>
                    {cvLink ? (
                      <a
                        href={cvLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary underline underline-offset-2"
                      >
                        Lihat CV (PDF) ↗
                      </a>
                    ) : (
                      <span className="text-slate-400">Tidak ada file</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-500">Bio Singkat</span>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-700">
                    {user?.instructorProfile?.shortBio ?? '-'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                Deklarasi Jadwal Mengajar ({detail.schedules?.length ?? 0})
              </h5>
              {detail.schedules && detail.schedules.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto rounded-lg border border-gray-100 p-2.5">
                  {detail.schedules.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-md bg-azure px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      🗓️ {s.location?.name ?? 'Kolam'} — {s.dayOfWeek}, {s.sessionName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Belum ada jadwal dideklarasikan.</p>
              )}
            </div>
          </div>
        ) : (
          /* Detail Konten Khusus Murid */
          <div className="space-y-3.5">
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                Data Murid
              </h5>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-100 bg-white p-3">
                <div>
                  <span className="text-xs text-slate-500">No. Telepon</span>
                  <p className="font-semibold text-ink">{detail.phone ?? user?.phone ?? '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Ukuran Baju</span>
                  <p className="font-semibold text-ink">{user?.studentProfile?.tshirtSize ?? '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Tempat, Tanggal Lahir</span>
                  <p className="font-semibold text-ink">
                    {user?.studentProfile?.birthPlace ?? '-'},{' '}
                    {user?.studentProfile?.birthDate
                      ? new Date(user.studentProfile.birthDate).toLocaleDateString('id-ID')
                      : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Sekolah / Kantor</span>
                  <p className="font-semibold text-ink">{user?.studentProfile?.schoolOrOffice ?? '-'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-500">Alamat Lengkap</span>
                  <p className="font-semibold text-ink">{user?.studentProfile?.address ?? '-'}</p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                Kelas & Pembayaran
              </h5>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-100 bg-white p-3">
                <div>
                  <span className="text-xs text-slate-500">Kolam Renang</span>
                  <p className="font-semibold text-ink">{detail.location?.name ?? detail.lokasi}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Paket Kelas</span>
                  <p className="font-semibold text-ink">
                    {detail.package?.type ?? '-'} (Rp{' '}
                    {(detail.package?.price ?? 0).toLocaleString('id-ID')})
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Guru Pilihan</span>
                  <p className="font-semibold text-ink">{detail.instructor?.fullName ?? '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Pertemuan Pertama</span>
                  <p className="font-semibold text-ink">
                    {detail.firstMeetDate
                      ? new Date(detail.firstMeetDate).toLocaleDateString('id-ID')
                      : '-'}{' '}
                    • {detail.firstMeetSession ?? '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Metode Pembayaran</span>
                  <p className="font-semibold text-ink">{detail.paymentMethod ?? '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Bukti Bayar</span>
                  <div>
                    {paymentProofLink ? (
                      <a
                        href={paymentProofLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary underline underline-offset-2"
                      >
                        Lihat Bukti Transfer ↗
                      </a>
                    ) : (
                      <span className="text-slate-400">Belum ada file</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
