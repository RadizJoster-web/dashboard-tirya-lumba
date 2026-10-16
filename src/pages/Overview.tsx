import { useEffect, useMemo, useState } from 'react';
import Stat from '../components/Stat';
import ChartBar from '../components/ChartBar';
import { Button } from '../components/ui';
import {
  MONTHS_FULL,
  MONTHS_SHORT,
  REG_PRICE,
  YEARS,
  formatRp,
  registrationsForYear,
  weeklySplit,
} from '../lib/demo';
import { usePelatih, useSiswa } from '../lib/store';
import type { SessionUser } from '../lib/auth';

export default function Overview({ user }: { user: SessionUser }) {
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(2026);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const scoped = user.role === 'pengelola';

  const data = useMemo(() => {
    if (month === 0) return registrationsForYear(year, scoped);
    return weeklySplit(year, month, scoped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year, user.lokasi, user.role]);

  const labels = month === 0 ? MONTHS_SHORT : ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4'];
  const total = data.reduce((a, b) => a + b, 0);
  const siswa = useSiswa();
  const pelatih = usePelatih();
  const totalSiswa = scoped ? siswa.filter((s) => s.lokasi === user.lokasi).length : siswa.length;
  const totalGuru = scoped ? pelatih.filter((p) => p.lokasi === user.lokasi).length : pelatih.length;

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <h2 className="text-2xl leading-8 font-bold">Overview</h2>
          <p className="text-slate-500">{user.role === 'admin' ? 'Statistik seluruh cabang' : `Statistik ${user.lokasi ?? ''}`}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat statistik…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div>
        <div className="mb-5">
          <h2 className="text-2xl leading-8 font-bold">Overview</h2>
          <p className="text-slate-500">Statistik gagal dimuat.</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-7 text-center">
          <p className="mb-3 text-slate-500">{loadError}</p>
          <Button
            variant="outline"
            onClick={() => {
              setLoadError('');
              setLoading(true);
              window.setTimeout(() => setLoading(false), 250);
            }}
          >
            Coba lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Overview</h2>
        <p className="text-slate-500">{user.role === 'admin' ? 'Statistik seluruh cabang' : `Statistik ${user.lokasi ?? ''}`}</p>
      </div>

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <label className="font-semibold">
          <span className="sr-only">Bulan</span>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2"
          >
            <option value={0}>Semua bulan</option>
            {MONTHS_FULL.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="font-semibold">
          <span className="sr-only">Tahun</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        <Stat label="Total siswa" value={String(totalSiswa)} />
        <Stat label="Total guru" value={String(totalGuru)} />
        <Stat label="Total pemasukan (periode)" value={formatRp(total * REG_PRICE)} />
      </div>

      <div className="mt-3.5 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-base">Tren pendaftaran {month ? `${MONTHS_FULL[month - 1]} ` : ''}{year}</h3>
        <p className="text-slate-500">{total} pendaftar baru</p>
        <ChartBar data={data} labels={labels} caption={`Pendaftaran ${month ? MONTHS_FULL[month - 1] : 'per bulan'} tahun ${year}, total ${total}`} />
        <p className="mt-2 text-xs text-slate-500">Data demo dari prototipe, nominal memakai tarif Reguler sebagai acuan.</p>
      </div>
    </div>
  );
}
