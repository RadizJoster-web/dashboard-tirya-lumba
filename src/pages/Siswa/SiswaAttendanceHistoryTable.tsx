import React from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import type { AttendanceRecord } from './siswaDetailTypes';

export const SiswaAttendanceHistoryTable: React.FC<{
  attendances: AttendanceRecord[];
}> = ({ attendances }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs">
      <h3 className="font-display text-base font-bold text-[#1D3557] mb-4 pb-2.5 border-b border-gray-100">
        Riwayat Kehadiran Sesi Latihan
      </h3>
      {attendances.length === 0 ? (
        <p className="text-xs text-slate-400 py-3">Belum ada catatan absensi untuk siswa ini.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 uppercase text-slate-400 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendances.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-[#1D3557] tabular-nums">
                    {new Date(att.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{att.locationName}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={att.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
