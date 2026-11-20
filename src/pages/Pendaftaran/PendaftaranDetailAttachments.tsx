import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import type { ServerRegistrationDetail } from '../../lib/api/types';

interface AttachmentsProps {
  detail: ServerRegistrationDetail;
  isInstructor: boolean;
  cvLink: string;
  paymentProofLink: string;
}

export const PendaftaranDetailAttachments: React.FC<AttachmentsProps> = ({
  detail,
  isInstructor,
  cvLink,
  paymentProofLink,
}) => {
  const user = detail.user;

  return (
    <>
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
                      <p className="text-sm font-bold text-[#1D3557]">Berkas CV Pelamar</p>
                      <p className="text-xs text-slate-400">Dokumen digital kurikulum vitae</p>
                    </div>
                  </div>
                  <a
                    href={cvLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0077B6] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#005f8f] transition-colors"
                  >
                    Buka &amp; Unduh CV
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
    </>
  );
};
