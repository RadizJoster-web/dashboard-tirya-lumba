import { useMemo } from 'react';
import Stat from '../components/Stat';
import ChartBar from '../components/ChartBar';
import { SkeletonChart, SkeletonHeader, SkeletonPage, SkeletonStats } from '../components/ui/Skeleton';
import { MONTHS_SHORT } from '../lib/format';
import { useResource } from '../lib/api/cache';
import { API_KEYS, fetchInstructors, fetchStudents } from '../lib/api/resources';
import type { ServerSiswa } from '../lib/api/types';
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

  const { data: siswa, loading: siswaLoading } = useResource(API_KEYS.students, fetchStudents);
  const { data: pelatih, loading: pelatihLoading } = useResource(API_KEYS.instructors, fetchInstructors);

  const loading = siswaLoading || pelatihLoading;
  const siswaRows = siswa ?? [];
  const pelatihRows = pelatih ?? [];

  const totalSiswa = scoped ? siswaRows.filter((s) => s.lokasi === lokasi).length : siswaRows.length;
  const totalGuru = pelatihRows.length;

  const data = useMemo(() => seedFromData(siswa ?? [], 2026, scoped, lokasi), [siswa, scoped, lokasi]);
  const total = data.reduce((a, b) => a + b, 0);
  const labels = MONTHS_SHORT;

  if (loading) {
    return (
      <SkeletonPage label="Memuat statistik overview">
        <SkeletonHeader />
        <SkeletonStats />
        <SkeletonChart />
      </SkeletonPage>
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
      </div>
    </div>
  );
}
