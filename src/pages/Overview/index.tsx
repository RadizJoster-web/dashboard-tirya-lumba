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
    <div className="pb-8">
      {/* HEADER SECTION DENGAN FILTER TAHUN & BULAN */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl leading-8 font-extrabold text-ink">Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {scoped
              ? `Statistik operasional kolam: ${lokasi || 'Cabang Anda'}`
              : 'Statistik operasional seluruh cabang Tirya Lumba'}
          </p>
        </div>

        {/* KONTROL FILTER BULAN & TAHUN */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-tahun"
              className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Tahun:
            </label>
            <select
              id="filter-tahun"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-primary focus:border-primary focus:outline-hidden"
            >
              {AVAILABLE_YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-bulan"
              className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Bulan:
            </label>
            <select
              id="filter-bulan"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-primary focus:border-primary focus:outline-hidden"
            >
              <option value="ALL">Semua Bulan (Jan - Des)</option>
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx} value={String(idx)}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <OverviewStats
        totalSiswa={totalSiswa}
        totalGuru={totalGuru}
        totalPendaftar={chartData.total}
        pendaftarLabel={chartData.statLabel}
      />

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
