import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Stat from '../components/Stat';
import ChartBar from '../components/ChartBar';
import { MONTHS_SHORT } from '../lib/format';
import { apiGetSiswa, apiGetPelatih } from '../lib/api';
import type { ServerSiswa } from '../lib/api-types';
import { useAuth } from '../lib/auth-context';

function seedFromData(siswa: ServerSiswa[], year: number, scoped: boolean, lokasi?: string): number[] {
  return MONTHS_SHORT.map(() => {
    const count = siswa.filter((s) => {
      const yearMatch = String(year) === String(s.berlakuSd ?? '').slice(0, 4);
      const locMatch = scoped ? s.lokasi === lokasi : true;
      return yearMatch && locMatch;
    }).length;
    return count;
  });
}

export default function Overview() {
  const { user } = useAuth();
  const scoped = user!.role === 'pengelola';
  const lokasi = user!.lokasi ?? '';

  const { data: siswa = [], isLoading: siswaLoading } = useQuery({
    queryKey: ['siswa'],
    queryFn: () => apiGetSiswa(),
  });

  const { data: pelatih = [], isLoading: pelatihLoading } = useQuery({
    queryKey: ['pelatih'],
    queryFn: () => apiGetPelatih(),
  });

  const loading = siswaLoading || pelatihLoading;

  const totalSiswa = scoped
    ? siswa.filter((s) => s.lokasi === lokasi).length
    : siswa.length;
  const totalGuru = scoped
    ? pelatih.filter((p) => p.lokasi === lokasi).length
    : pelatih.length;

  const data = useMemo(() => seedFromData(siswa, 2026, scoped, lokasi), [siswa, scoped, lokasi]);
  const total = data.reduce((a, b) => a + b, 0);
  const labels = MONTHS_SHORT;

  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <h2 className="text-2xl leading-8 font-bold">Overview</h2>
          <p className="text-slate-500">{user!.role === 'admin' ? 'Statistik seluruh cabang' : `Statistik ${user!.lokasi ?? ''}`}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat statistik…</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Overview</h2>
        <p className="text-slate-500">{user!.role === 'admin' ? 'Statistik seluruh cabang' : `Statistik ${user!.lokasi ?? ''}`}</p>
      </div>

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <Stat label="Total siswa" value={String(totalSiswa)} />
        <Stat label="Total guru" value={String(totalGuru)} />
        <Stat label="Total pendaftar (tahun ini)" value={String(total)} />
      </div>

      <div className="mt-3.5 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-base">Tren pendaftaran 2026</h3>
        <p className="text-slate-500">{total} pendaftar baru</p>
        <ChartBar data={data} labels={labels} caption={`Pendaftaran per bulan tahun 2026, total ${total}`} />
        <p className="mt-2 text-xs text-slate-500">Data dari server via API.</p>
      </div>
    </div>
  );
}
