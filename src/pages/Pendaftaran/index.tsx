import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { RouteLoading } from '../../components/loading';
import type { ServerRegistration } from '../../lib/api/types';
import PendaftaranFilter, { type TipeAntrean } from './PendaftaranFilter';
import PendaftaranTable from './PendaftaranTable';
import PendaftaranDetailModal from './PendaftaranDetailModal';
import PendaftaranRejectModal from './PendaftaranRejectModal';
import { usePendaftaranData } from './usePendaftaranData';

export default function Pendaftaran() {
  const { user } = useAuth();
  const admin = user?.role === 'admin';

  const {
    registrations,
    isLoading,
    detailData,
    detailLoading,
    actionLoading,
    openDetail,
    closeDetail,
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
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl leading-8 font-bold">Pendaftaran dan Antrean</h2>
          <p className="text-slate-500">
            {admin
              ? 'Tinjau dan verifikasi calon murid dan pelatih baru yang mendaftar'
              : (user?.lokasi ?? 'Pendaftaran murid di kolam Anda')}
          </p>
        </div>
        <div className="rounded-full bg-azure px-3 py-1 text-xs font-semibold text-primary">
          {filteredRows.length} Menunggu Persetujuan
        </div>
      </div>

      {admin ? (
        <PendaftaranFilter
          tipeAntrean={tipeAntrean}
          onChange={setTipeAntrean}
        />
      ) : null}

      <PendaftaranTable
        rows={filteredRows}
        actionLoading={actionLoading}
        onDetail={(id) => void openDetail(id)}
        onApprove={(id) => void approveRegistration(id)}
        onReject={(target) => setRejectTarget(target)}
      />

      {/* Modal Detail Pendaftaran */}
      <PendaftaranDetailModal
        detail={detailData}
        isLoading={detailLoading}
        actionLoading={actionLoading}
        onClose={closeDetail}
        onApprove={(id) => void approveRegistration(id)}
        onReject={() => {
          if (detailData) {
            setRejectTarget(detailData);
          }
        }}
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
