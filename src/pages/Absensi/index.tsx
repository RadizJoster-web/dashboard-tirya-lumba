import { useState } from 'react';
import { AbsensiLoading } from '../../components/loading';
import AbsensiAdminView from './AbsensiAdminView';
import AbsensiManagerView from './AbsensiManagerView';
import { useAbsensiData } from './useAbsensiData';

export default function Absensi() {
  const {
    admin,
    lokasi,
    absen,
    locations,
    people,
    loading,
    submitAttendance,
  } = useAbsensiData();

  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');

  if (loading) {
    return <AbsensiLoading admin={admin} />;
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Header and View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1D3557] tracking-tight">
            Presensi Operasional Kolam
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 font-normal">
            {admin
              ? 'Input presensi harian seluruh cabang dan kelola riwayat kehadiran'
              : (lokasi ? `Input presensi harian di ${lokasi}` : 'Input presensi harian kolam Anda')}
          </p>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'today'
                ? 'bg-[#1D3557] text-white shadow-2xs'
                : 'text-slate-500 hover:text-[#1D3557]'
            }`}
          >
            Presensi Hari Ini
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#1D3557] text-white shadow-2xs'
                : 'text-slate-500 hover:text-[#1D3557]'
            }`}
          >
            Riwayat Presensi
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'today' ? (
        <AbsensiManagerView
          lokasi={lokasi}
          people={people}
          onSave={submitAttendance}
        />
      ) : (
        <AbsensiAdminView
          locations={locations}
          absen={admin ? absen : absen.filter((a) => !lokasi || a.lokasi === lokasi)}
        />
      )}
    </div>
  );
}
