import React from 'react';
import { Button } from '../../components/ui';

interface AbsensiToolbarProps {
  lokasi: string;
  totalPeople: number;
  saving: boolean;
  onMarkAll: (status: 'Hadir' | 'Tidak Hadir') => void;
  onSave: () => void;
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const AbsensiToolbar: React.FC<AbsensiToolbarProps> = ({
  lokasi,
  totalPeople,
  saving,
  onMarkAll,
  onSave,
}) => {
  return (
    <div className="anim-enter flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4.5 rounded-xl border border-gray-200 shadow-2xs">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Jadwal Operasional Hari Ini
        </span>
        <h3 className="font-display text-base font-bold text-[#1D3557] mt-0.5">
          {todayFormatted()}
        </h3>
        <p className="text-xs text-slate-500">
          {lokasi ? `Cabang ${lokasi}` : 'Semua Kolam Cabang'} · {totalPeople} jadwal sesi terdaftar
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {totalPeople > 0 && (
          <div className="flex items-center gap-1.5 mr-auto sm:mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAll('Hadir')}
              className="text-xs px-2.5 py-1"
            >
              Semua Hadir
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAll('Tidak Hadir')}
              className="text-xs px-2.5 py-1"
            >
              Reset
            </Button>
          </div>
        )}

        <Button
          variant="primary"
          onClick={onSave}
          disabled={saving || totalPeople === 0}
        >
          {saving ? 'Menyimpan Presensi…' : 'Simpan Presensi Hari Ini'}
        </Button>
      </div>
    </div>
  );
};
