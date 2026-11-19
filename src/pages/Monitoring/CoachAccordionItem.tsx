import React, { useState } from 'react';
import { ChevronDown, Phone, User } from 'lucide-react';
import { assetUrl } from '../../lib/api/client';
import { StudentSubTable } from './StudentSubTable';
import type { CoachAllocation } from '../../lib/api/types';

interface CoachAccordionItemProps {
  coach: CoachAllocation;
  defaultExpanded?: boolean;
}

export const CoachAccordionItem: React.FC<CoachAccordionItemProps> = ({
  coach,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const photoUrl = coach.profilePictureUrl ? assetUrl(coach.profilePictureUrl) : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-2xs overflow-hidden transition-all duration-200">
      {/* Header Bar Accordion Pelatih */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/70 transition-colors select-none"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar Pelatih */}
          <div className="relative h-11 w-11 rounded-full overflow-hidden bg-gradient-to-br from-[#0077B6] to-[#023E8A] flex items-center justify-center text-white shrink-0 border border-gray-200 shadow-2xs">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={coach.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={18} />
            )}
          </div>

          <div className="min-w-0">
            <h4 className="font-display text-sm font-bold text-[#1D3557] truncate">
              {coach.fullName}
            </h4>
            {coach.phone ? (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <Phone size={10} className="text-slate-400" />
                {coach.phone}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Instruktur Resmi</span>
            )}
          </div>
        </div>

        {/* Counter Badge Murid & Expand Arrow */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
              coach.totalStudents > 0
                ? 'bg-blue-50 text-[#0077B6] border border-blue-200/60'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {coach.totalStudents} Murid
          </span>
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-slate-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180 bg-slate-100 text-[#1D3557]' : ''
            }`}
          >
            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      {/* Konten Terbuka (Daftar Murid yang Dibimbing) */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-slate-50/40 p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Daftar Murid Aktif ({coach.totalStudents})
            </span>
          </div>
          <StudentSubTable students={coach.students} coachName={coach.fullName} />
        </div>
      )}
    </div>
  );
};
