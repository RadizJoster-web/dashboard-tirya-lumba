import React, { useMemo } from 'react';
import type { ServerRegistrationDetail } from '../../lib/api/types';

const DAY_ORDER: Record<string, number> = {
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6,
  minggu: 7,
};

export const PendaftaranScheduleTable: React.FC<{
  schedules?: ServerRegistrationDetail['schedules'];
}> = ({ schedules }) => {
  const grouped = useMemo(() => {
    if (!schedules || schedules.length === 0) return [];

    const map = new Map<string, { dayOfWeek: string; locationName: string; sessions: Set<string> }>();

    for (const s of schedules) {
      const day = s.dayOfWeek || 'Lainnya';
      const loc = s.location?.name ? `Kolam ${s.location.name}` : 'Kolam';
      const key = `${day.toLowerCase()}_${loc}`;

      if (!map.has(key)) {
        map.set(key, { dayOfWeek: day, locationName: loc, sessions: new Set() });
      }
      if (s.sessionName) {
        map.get(key)!.sessions.add(s.sessionName);
      }
    }

    return Array.from(map.values())
      .map((g) => ({
        dayOfWeek: g.dayOfWeek,
        locationName: g.locationName,
        sessions: Array.from(g.sessions).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
      }))
      .sort((a, b) => {
        const orderA = DAY_ORDER[a.dayOfWeek.toLowerCase()] ?? 99;
        const orderB = DAY_ORDER[b.dayOfWeek.toLowerCase()] ?? 99;
        return orderA - orderB;
      });
  }, [schedules]);

  if (!schedules || schedules.length === 0 || grouped.length === 0) {
    return <p className="text-xs text-slate-400 italic">Tidak ada jadwal spesifik terlampir.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-gray-200">
          <tr>
            <th className="py-2.5 px-3 w-28">Hari</th>
            <th className="py-2.5 px-3">Sesi Mengajar Tersedia</th>
            <th className="py-2.5 px-3 text-right">Lokasi Kolam</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {grouped.map((row) => (
            <tr key={`${row.dayOfWeek}-${row.locationName}`} className="hover:bg-slate-50/50">
              <td className="py-2.5 px-3 font-bold text-[#1D3557]">
                {row.dayOfWeek}
              </td>
              <td className="py-2.5 px-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {row.sessions.map((sess) => (
                    <span
                      key={sess}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#E0FBFC] text-[#0077B6] border border-[#00B4D8]/30"
                    >
                      {sess}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-2.5 px-3 text-right text-slate-500 font-medium">
                {row.locationName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
