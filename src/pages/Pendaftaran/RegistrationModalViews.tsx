import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import type { ServerRegistrationDetail } from '../../lib/api/types';

interface InstructorViewProps {
  detail: ServerRegistrationDetail;
  cvLink: string;
}

export const RegistrationModalInstructorView: React.FC<InstructorViewProps> = ({
  detail,
  cvLink,
}) => {
  const profile = detail.user?.instructorProfile;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-50 p-3 border border-gray-100 text-xs">
          <span className="text-slate-400 font-semibold block uppercase">Lisensi</span>
          <p className="mt-0.5 font-semibold text-[#1D3557]">{profile?.license || '-'}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 border border-gray-100 text-xs">
          <span className="text-slate-400 font-semibold block uppercase">Pengalaman</span>
          <p className="mt-0.5 font-semibold text-[#1D3557]">{profile?.experience || '-'}</p>
        </div>
      </div>

      {cvLink && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-xs">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-red-500" />
            <span className="font-semibold text-[#1D3557]">Dokumen CV</span>
          </div>
          <a
            href={cvLink}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#0077B6] hover:underline flex items-center gap-1"
          >
            Buka CV <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
};

interface StudentViewProps {
  detail: ServerRegistrationDetail;
  paymentProofLink: string;
}

export const RegistrationModalStudentView: React.FC<StudentViewProps> = ({
  detail,
  paymentProofLink,
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-50 p-3 border border-gray-100 text-xs">
          <span className="text-slate-400 font-semibold block uppercase">Lokasi Kolam</span>
          <p className="mt-0.5 font-bold text-[#0077B6]">
            {detail.location?.name ?? detail.lokasi ?? '-'}
          </p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 border border-gray-100 text-xs">
          <span className="text-slate-400 font-semibold block uppercase">Paket Kursus</span>
          <p className="mt-0.5 font-semibold text-[#1D3557]">
            {detail.package?.type ?? '-'}
          </p>
        </div>
      </div>

      {paymentProofLink && (
        <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-500">Bukti Pembayaran:</span>
            <a
              href={paymentProofLink}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#0077B6] hover:underline"
            >
              Buka Gambar Penuh
            </a>
          </div>
          <img
            src={paymentProofLink}
            alt="Bukti Transfer"
            className="max-h-52 w-full object-contain rounded border border-gray-100 bg-slate-50"
          />
        </div>
      )}
    </div>
  );
};
