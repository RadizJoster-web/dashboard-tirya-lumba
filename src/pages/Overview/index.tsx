import { useMemo } from 'react';
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

const fetchStudents = (): Promise<ServerSiswa[]> =>
  apiGet<ServerSiswa[]>('/siswa');

const fetchInstructors = (): Promise<ServerInstructor[]> =>
  apiGet<ServerInstructor[]>('/instructor/management?page=1&limit=100');

const fetchRegistrations = (): Promise<
  (ServerRegistration & { createdAt?: string })[]
> => apiGet<(ServerRegistration & { createdAt?: string })[]>('/register?status=ALL');

function countRegistrationsPerMonth(
  registrations: (ServerRegistration & { createdAt?: string })[],
  year: number,
  scoped: boolean,
  lokasi?: string,
): number[] {
  return MONTHS_SHORT.map((_, monthIndex) => {
    return registrations.filter((r) => {
      const locMatch = scoped ? r.lokasi === lokasi : true;
      if (!locMatch) return false;

      const dateStr = r.createdAt;
      if (!dateStr) return false;

      const d = new Date(dateStr);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    }).length;
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
  const { data: pendaftaran, loading: pendaftaranLoading } = useResource(
    '/register?status=ALL',
    fetchRegistrations,
  );

  const loading = siswaLoading || pelatihLoading || pendaftaranLoading;
  const siswaRows = siswa ?? [];
  const pelatihRows = pelatih ?? [];
  const regRows = pendaftaran ?? [];

  const totalSiswa = scoped
    ? siswaRows.filter((s) => s.lokasi === lokasi).length
    : siswaRows.length;
  const totalGuru = pelatihRows.length;

  const data = useMemo(
    () => countRegistrationsPerMonth(regRows, 2026, scoped, lokasi),
    [regRows, scoped, lokasi],
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
