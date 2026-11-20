import React from 'react';
import { Calendar, Phone, CheckCircle2 } from 'lucide-react';
import type { StudentAllocation } from '../../lib/api/types';

interface StudentSubTableProps {
  students: StudentAllocation[];
  coachName: string;
}

export const StudentSubTable: React.FC<StudentSubTableProps> = ({
  students,
  coachName,
}) => {
  if (students.length === 0) {
    return (
      <div className="py-6 px-4 text-center bg-slate-50/60 rounded-xl border border-dashed border-gray-200">
        <p className="text-xs text-slate-400 italic">
          Belum ada murid aktif yang dibimbing oleh {coachName} di kolam ini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-gray-200">
          <tr>
            <th className="py-2.5 px-4">Nama Murid</th>
            <th className="py-2.5 px-4">Paket Kursus</th>
            <th className="py-2.5 px-4">Mulai / Sesi Pertama</th>
            <th className="py-2.5 px-4 text-center">Sisa Pertemuan</th>
            <th className="py-2.5 px-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-slate-700">
          {students.map((st) => (
            <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4">
                <span className="font-bold text-[#1D3557] block">{st.name}</span>
                {st.phone && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <Phone size={10} />
                    {st.phone}
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#0077B6] border border-blue-100">
                  {st.packageName}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-slate-400" />
                  <span>{st.firstMeetDate ?? '-'}</span>
                </div>
                {st.firstMeetSession && (
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {st.firstMeetSession}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-center font-bold text-[#1D3557]">
                {st.activeSessions} Sesi
              </td>
              <td className="py-3 px-4 text-right">
                {st.isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={10} />
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    Nonaktif
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
