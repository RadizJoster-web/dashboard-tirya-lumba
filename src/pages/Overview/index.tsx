import { useMemo, useState } from 'react';
import { OverviewLoading } from '../../components/loading';
import { MONTHS_SHORT } from '../../lib/format';
import { apiGet } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type {
  ServerInstructor,
  ServerRegistration,
  ServerSiswa,
} from '../../lib/api/types';
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

const fetchStudents = (): Promise<ServerSiswa[]> =>
  apiGet<ServerSiswa[]>('/siswa');

const fetchInstructors = (): Promise<ServerInstructor[]> =>
  apiGet<ServerInstructor[]>('/instructor/management?page=1&limit=100');

const fetchRegistrations = (): Promise<
  (ServerRegistration & { createdAt?: string })[]
> => apiGet<(ServerRegistration & { createdAt?: string })[]>('/register?status=ALL');

export default function Overview() {
  const { user } = useAuth();
  const scoped = user!.role === 'pengelola';
  const lokasi = user!.lokasi ?? '';

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  const { data: siswa, loading: siswaLoading } = useResource(
    '/siswa',
    fetchStudents,
  );
  const { data: pelatih, loading: pelatihLoading } = useResource(
    '/instructor/management?page=1&limit=100',
    fetchInstructors,
  );
  const { data: pendaftaran, loading: pendaftaranLoading } = useResource(
    '/register?status=ALL',
    fetchRegistrations,
  );

  const loading = siswaLoading || pelatihLoading || pendaftaranLoading;
  const siswaRows = siswa ?? [];
  const pelatihRows = pelatih ?? [];
  const regRows = pendaftaran ?? [];

  // Untuk pengelola (Pool Manager), data dari endpoint backend SUDAH difilter untuk kolamnya
  const totalSiswa = siswaRows.length;
  const totalGuru = pelatihRows.length;

  // Filter pendaftaran berdasarkan tahun dan bulan terpilih
  const chartData = useMemo(() => {
    // Saring pendaftaran di tahun terpilih
    const yearFiltered = regRows.filter((r) => {
      if (!r.createdAt) return false;
      const d = new Date(r.createdAt);
      return d.getFullYear() === selectedYear;
    });

    if (selectedMonth === 'ALL') {
      // 12 Bulan (Jan - Des)
      const monthlyCounts = MONTHS_SHORT.map((_, monthIndex) => {
        return yearFiltered.filter((r) => {
          const d = new Date(r.createdAt!);
          return d.getMonth() === monthIndex;
        }).length;
      });

      return {
        data: monthlyCounts,
        labels: MONTHS_SHORT,
        total: monthlyCounts.reduce((a, b) => a + b, 0),
        title: `Tren Pendaftaran Tahun ${selectedYear}`,
        subtitle: `Data pendaftaran per bulan untuk tahun ${selectedYear}`,
        statLabel: `Total pendaftar (${selectedYear})`,
      };
    } else {
      // Spesifik Bulan Terpilih -> Pecah menjadi 5 kelompok minggu (1-7, 8-14, 15-21, 22-28, 29-31)
      const monthIdx = parseInt(selectedMonth, 10);
      const monthFiltered = yearFiltered.filter((r) => {
        const d = new Date(r.createdAt!);
        return d.getMonth() === monthIdx;
      });

      const weekLabels = [
        'Mgg 1 (1-7)',
        'Mgg 2 (8-14)',
        'Mgg 3 (15-21)',
        'Mgg 4 (22-28)',
        'Mgg 5 (29-31)',
      ];

      const weeklyCounts = [
        monthFiltered.filter((r) => {
          const date = new Date(r.createdAt!).getDate();
          return date >= 1 && date <= 7;
        }).length,
        monthFiltered.filter((r) => {
          const date = new Date(r.createdAt!).getDate();
          return date >= 8 && date <= 14;
        }).length,
        monthFiltered.filter((r) => {
          const date = new Date(r.createdAt!).getDate();
          return date >= 15 && date <= 21;
        }).length,
        monthFiltered.filter((r) => {
          const date = new Date(r.createdAt!).getDate();
          return date >= 22 && date <= 28;
        }).length,
        monthFiltered.filter((r) => {
          const date = new Date(r.createdAt!).getDate();
          return date >= 29;
        }).length,
      ];

      const monthName = MONTH_NAMES[monthIdx];

      return {
        data: weeklyCounts,
        labels: weekLabels,
        total: weeklyCounts.reduce((a, b) => a + b, 0),
        title: `Tren Pendaftaran ${monthName} ${selectedYear}`,
        subtitle: `Distribusi pendaftaran per minggu di bulan ${monthName} ${selectedYear}`,
        statLabel: `Total pendaftar (${monthName} ${selectedYear})`,
      };
    }
  }, [regRows, selectedYear, selectedMonth]);

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
