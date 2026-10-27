import { useState } from 'react';
import { OverviewLoading } from '../../components/loading';
import { apiGet } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { DashboardSummaryData } from '../../lib/api/types';
import { useAuth } from '../../lib/auth-context';
import OverviewStats from './OverviewStats';
import OverviewChart from './OverviewChart';

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const AVAILABLE_YEARS = [2024, 2025, 2026, 2027];

const fetchSummary = (year: number, month: string) => () =>
  apiGet<DashboardSummaryData>(
    `/dashboard/summary?year=${year}&month=${encodeURIComponent(month)}`,
  );

export default function Overview() {
  const { user } = useAuth();
  const scoped = user!.role === 'pengelola';
  const lokasi = user!.lokasi ?? '';

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  const { data: summary, loading } = useResource(
    `/dashboard/summary:${selectedYear}:${selectedMonth}`,
    fetchSummary(selectedYear, selectedMonth),
  );

  const totalSiswa = summary?.totalSiswa ?? 0;
  const totalGuru = summary?.totalGuru ?? 0;
  const chartData = summary?.chartData ?? {
    data: [],
    labels: [],
    total: 0,
    title: `Tren Pendaftaran Tahun ${selectedYear}`,
    subtitle: `Data pendaftaran per bulan untuk tahun ${selectedYear}`,
    statLabel: `Total pendaftar (${selectedYear})`,
  };

  if (loading) {
    return <OverviewLoading />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER SECTION DENGAN FILTER TAHUN & BULAN SEPERTI STYLE DASHBOARD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1D3557] tracking-tight">
            Ringkasan Operasional
          </h2>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            {scoped
              ? `Statistik khusus cabang kolam: ${lokasi || 'Cabang Terdaftar'}`
              : 'Statistik terpusat seluruh cabang dan kolam PT Tirya Lumba'}
          </p>
        </div>

        {/* KONTROL FILTER BULAN & TAHUN (Sleek Segmented Controls) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Year Switcher */}
          <div className="flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-2xs">
            {AVAILABLE_YEARS.map((yr) => {
              const isSelected = selectedYear === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1D3557] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-[#1D3557]'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>

          {/* Month Selector Pill */}
          <div className="relative">
            <select
              id="filter-bulan"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none rounded-full border border-gray-200 bg-white py-1.5 pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs hover:border-gray-300 focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 cursor-pointer transition-all"
            >
              <option value="ALL">Semua Bulan (Jan - Des)</option>
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx} value={String(idx)}>
                  {name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Bento Metric Cards */}
      <OverviewStats
        totalSiswa={totalSiswa}
        totalGuru={totalGuru}
        totalPendaftar={chartData.total}
        pendaftarLabel={chartData.statLabel}
      />

      {/* Rounded Bar Chart Card */}
      <OverviewChart
        data={chartData.data}
        labels={chartData.labels}
        total={chartData.total}
        title={chartData.title}
        subtitle={chartData.subtitle}
      />
    </div>
  );
}
