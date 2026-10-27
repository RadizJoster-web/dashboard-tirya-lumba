import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { RouteLoading } from '../../components/loading';
import type { ServerRegistration } from '../../lib/api/types';
import PendaftaranFilter, { type TipeAntrean } from './PendaftaranFilter';
import PendaftaranTable from './PendaftaranTable';
import PendaftaranRejectModal from './PendaftaranRejectModal';
import { usePendaftaranData } from './usePendaftaranData';

export default function Pendaftaran() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const admin = user?.role === 'admin';

  const {
    registrations,
    isLoading,
    actionLoading,
    approveRegistration,
    rejectRegistration,
  } = usePendaftaranData();

  const [tipeAntrean, setTipeAntrean] = useState<TipeAntrean>('Semua');
  const [rejectTarget, setRejectTarget] = useState<ServerRegistration | null>(null);

  if (isLoading) {
    return <RouteLoading />;
  }

  const filteredRows = registrations.filter((r) => {
    if (!admin) {
      // Pengelola kolam hanya melihat pendaftaran murid di kolamnya
      return r.type === 'NEW_STUDENT';
    }
    if (tipeAntrean === 'Murid') return r.type === 'NEW_STUDENT';
    if (tipeAntrean === 'Pelatih') return r.type === 'NEW_INSTRUCTOR';
    return true;
  });

  return (
    <div className="space-y-5 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1D3557] tracking-tight">
            Antrean Pendaftaran
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 font-normal">
            {admin
              ? 'Tinjau berkas verifikasi dan setujui pendaftaran murid dan pelatih baru'
              : (user?.lokasi ? `Pendaftaran murid baru di ${user.lokasi}` : 'Pendaftaran murid di kolam Anda')}
          </p>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0FBFC] px-3 py-1 text-xs font-semibold text-[#0077B6] border border-[#00B4D8]/20 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
            {filteredRows.length} Menunggu Persetujuan
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      {admin ? (
        <PendaftaranFilter
          tipeAntrean={tipeAntrean}
          onChange={setTipeAntrean}
        />
      ) : null}

      {/* Main Queue Table */}
      <PendaftaranTable
        rows={filteredRows}
        actionLoading={actionLoading}
        onDetail={(id) => navigate(`/pendaftaran/${id}`)}
        onApprove={(id) => void approveRegistration(id)}
        onReject={(target) => setRejectTarget(target)}
      />

      {/* Modal Alasan Penolakan */}
      <PendaftaranRejectModal
        rejectTarget={rejectTarget}
        saving={actionLoading}
        onClose={() => setRejectTarget(null)}
        onConfirmReject={async (alasan) => {
          if (!rejectTarget) return;
          const ok = await rejectRegistration(rejectTarget.id, alasan);
          if (ok) {
            setRejectTarget(null);
          }
        }}
      />
    </div>
  );
}
