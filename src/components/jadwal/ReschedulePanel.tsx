import { Button } from '../ui';
import type { Resched } from '../../lib/local/reschedule-requests';

interface ReschedulePanelProps {
  requests: Resched[];
  onDecide: (id: number, approved: boolean) => void;
}

export default function ReschedulePanel({ requests, onDecide }: ReschedulePanelProps) {
  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="m-0 text-lg font-bold">Perubahan jadwal</h3>
      <p className="mt-1 mb-0 text-sm text-slate-500">Laporan guru yang menunggu keputusan.</p>
      {requests.length === 0 ? (
        <p className="mt-3 mb-0 rounded-lg bg-basedash p-3 text-sm text-slate-500">
          Belum ada laporan perubahan jadwal.
        </p>
      ) : (
        <ul className="m-0 mt-3 list-none divide-y divide-gray-200 p-0">
          {requests.map((request) => (
            <li key={request.id} className="py-3">
              <b className="block">{request.pelatih}</b>
              <span className="text-sm text-slate-500">{request.hari} · {request.jam}</span>
              <p className="my-1 text-sm">{request.alasan}</p>
              <div className="mt-2 flex gap-2">
                <Button className="px-2.5 py-1 text-[13px]" onClick={() => onDecide(request.id, true)}>
                  Setujui
                </Button>
                <Button variant="danger" className="px-2.5 py-1 text-[13px]" onClick={() => onDecide(request.id, false)}>
                  Tolak
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
