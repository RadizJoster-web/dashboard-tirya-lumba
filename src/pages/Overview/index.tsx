import { useMemo } from 'react';
import { OverviewLoading } from '../../components/loading';
import { MONTHS_SHORT } from '../../lib/format';
import { apiGet } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { ServerInstructor, ServerSiswa } from '../../lib/api/types';
import { useAuth } from '../../lib/auth-context';
import OverviewStats from './OverviewStats';
import OverviewChart from './OverviewChart';

const fetchStudents = (): Promise<ServerSiswa[]> =>
  apiGet<ServerSiswa[]>('/siswa');

const fetchInstructors = (): Promise<ServerInstructor[]> =>
  apiGet<ServerInstructor[]>('/instructor/management?page=1&limit=100');

function seedFromData(
  siswa: ServerSiswa[],
  year: number,
  scoped: boolean,
  lokasi?: string,
): number[] {
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

  const { data: siswa, loading: siswaLoading } = useResource(
    '/siswa',
    fetchStudents,
  );
  const { data: pelatih, loading: pelatihLoading } = useResource(
    '/instructor/management?page=1&limit=100',
    fetchInstructors,
  );

  const loading = siswaLoading || pelatihLoading;
  const siswaRows = siswa ?? [];
  const pelatihRows = pelatih ?? [];

  const totalSiswa = scoped
    ? siswaRows.filter((s) => s.lokasi === lokasi).length
    : siswaRows.length;
  const totalGuru = pelatihRows.length;

  const data = useMemo(
    () => seedFromData(siswa ?? [], 2026, scoped, lokasi),
    [siswa, scoped, lokasi],
  );
  const total = data.reduce((a, b) => a + b, 0);

  if (loading) {
    return <OverviewLoading />;
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Overview</h2>
        <p className="text-slate-500">
          {user!.role === 'admin'
            ? 'Statistik seluruh cabang'
            : `Statistik ${user!.lokasi ?? ''}`}
        </p>
      </div>

      <OverviewStats
        totalSiswa={totalSiswa}
        totalGuru={totalGuru}
        totalPendaftar={total}
      />
      <OverviewChart data={data} labels={MONTHS_SHORT} total={total} />
    </div>
  );
}
