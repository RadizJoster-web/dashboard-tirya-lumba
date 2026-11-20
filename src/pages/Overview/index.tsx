import { useState, useCallback } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
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

export default function Overview() {
  const { user } = useAuth();
  const scoped = user!.role === 'pengelola';
  const lokasi = user!.lokasi ?? '';

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  const summaryFetcher = useCallback(
    () =>
      apiGet<DashboardSummaryData>(
        `/dashboard/summary?year=${selectedYear}&month=${encodeURIComponent(selectedMonth)}`,
      ),
    [selectedYear, selectedMonth],
  );

  const { data: summary, loading } = useResource(
    `/dashboard/summary:${selectedYear}:${selectedMonth}`,
    summaryFetcher,
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
      {/* HEADER SECTION DENGAN FILTER TAHUN & BULAN CLEAN & MODERN */}
      <div className="anim-enter flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        {/* KONTROL FILTER BULAN & TAHUN (Clean Unified Controls) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Segmented Year Switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            {AVAILABLE_YEARS.map((yr) => {
              const isSelected = selectedYear === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`rounded-lg px-2.5 sm:px-3 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1D3557] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-[#1D3557] hover:bg-slate-50'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>

          {/* Month Selector Pill */}
          <div className="relative inline-flex items-center">
            <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <select
              id="filter-bulan"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-8 text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/20 cursor-pointer transition-all max-w-[160px] sm:max-w-none truncate"
            >
              <option value="ALL">Semua Bulan</option>
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx} value={String(idx)}>
                  {name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 flex items-center text-slate-400">
              <ChevronDown className="h-3.5 w-3.5" />
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
