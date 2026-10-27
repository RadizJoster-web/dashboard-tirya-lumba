import { Button } from '../ui';
import type { Resched } from '../../lib/local/reschedule-requests';

interface ReschedulePanelProps {
  requests: Resched[];
  onDecide: (id: number, approved: boolean) => void;
}

export default function ReschedulePanel({ requests, onDecide }: ReschedulePanelProps) {
  return (
    <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
      <h3 className="font-display m-0 text-base font-bold text-[#1D3557]">
        Pengajuan Perubahan Jadwal
      </h3>
      <p className="mt-0.5 mb-0 text-xs text-slate-500 font-normal">
        Laporan guru/pelatih yang menunggu verifikasi admin.
      </p>
      {requests.length === 0 ? (
        <p className="mt-3 mb-0 rounded-xl bg-slate-50 border border-gray-100 p-4 text-xs text-slate-400 text-center">
          Belum ada laporan perubahan jadwal yang diajukan.
        </p>
      ) : (
        <ul className="m-0 mt-3 list-none divide-y divide-gray-100 p-0">
          {requests.map((request) => (
            <li key={request.id} className="py-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <b className="font-display text-sm font-bold text-[#1D3557]">{request.pelatih}</b>
                <span className="rounded-full bg-[#E0FBFC] px-2 py-0.5 text-[10px] font-bold text-[#0077B6]">
                  {request.hari}
                </span>
              </div>
              <span className="text-xs text-slate-400 block tabular-nums">
                Waktu: {request.jam}
              </span>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-gray-100 leading-relaxed italic">
                "{request.alasan}"
              </p>
              <div className="mt-2.5 flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDecide(request.id, false)}
                >
                  Tolak
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onDecide(request.id, true)}
                >
                  Setujui
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
