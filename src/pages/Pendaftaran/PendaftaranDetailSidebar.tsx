import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../../components/ui';
import type { ServerRegistrationDetail } from '../../lib/api/types';

interface SidebarProps {
  detail: ServerRegistrationDetail;
  isInstructor: boolean;
  actionLoading: boolean;
  onApprove: () => void;
  onOpenReject: () => void;
}

export const PendaftaranDetailSidebar: React.FC<SidebarProps> = ({
  detail,
  isInstructor,
  actionLoading,
  onApprove,
  onOpenReject,
}) => {
  const isPending = detail.status === 'PENDING';
  const isApproved = detail.status === 'APPROVED';
  const isRejected = detail.status === 'REJECTED';

  return (
    <div className="space-y-6">
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
              onClick={onApprove}
            >
              <Check size={16} className="mr-1.5" />
              Setujui Pendaftaran
            </Button>

            <Button
              variant="danger"
              className="w-full justify-center"
              disabled={actionLoading}
              onClick={onOpenReject}
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
          <span className="font-bold text-[#1D3557]">{detail.type}</span>
        </div>

        <div>
          <span className="text-slate-400 block font-medium">Status</span>
          <span className="font-bold text-[#1D3557]">{detail.status}</span>
        </div>
      </div>
    </div>
  );
};
