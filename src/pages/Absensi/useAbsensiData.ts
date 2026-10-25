import { useMemo } from 'react';
import { toast } from 'sonner';
import { apiGet, apiSend } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type {
  AbsenPayload,
  AbsenResult,
  ServerAbsen,
  ServerInstructor,
  ServerLocation,
  ServerSiswa,
} from '../../lib/api/types';
import { useAuth } from '../../lib/auth-context';

const fetchAttendance = (): Promise<ServerAbsen[]> =>
  apiGet<ServerAbsen[]>('/absensi');

const fetchStudents = (): Promise<ServerSiswa[]> =>
  apiGet<ServerSiswa[]>('/siswa');

const fetchInstructors = (): Promise<ServerInstructor[]> =>
  apiGet<ServerInstructor[]>('/instructor/management?page=1&limit=100');

const fetchLocations = (): Promise<ServerLocation[]> =>
  apiGet<ServerLocation[]>('/locations');

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useAbsensiData() {
  const { user } = useAuth();
  const admin = user!.role === 'admin';
  const lokasi = user!.lokasi ?? '';

  const {
    data: history,
    loading: historyLoading,
    reload,
  } = useResource('/absensi', fetchAttendance);

  const { data: studentData, loading: studentsLoading } = useResource(
    '/siswa',
    fetchStudents,
  );

  const { data: instructorData, loading: instructorsLoading } = useResource(
    '/instructor/management?page=1&limit=100',
    fetchInstructors,
  );

  const { data: locationData } = useResource('/locations', fetchLocations);

  const absen = useMemo(() => history ?? [], [history]);
  const siswa = useMemo(() => studentData ?? [], [studentData]);
  const pelatih = useMemo(() => instructorData ?? [], [instructorData]);
  const locations = useMemo(
    () => (locationData ?? []).map((l) => l.name),
    [locationData],
  );

  const people = useMemo(() => {
    return [
      ...pelatih
        .filter((p) => p.isActive)
        .map((p) => ({ peran: 'Pelatih' as const, nama: p.fullName })),
      ...siswa
        .filter((s) => s.lokasi === lokasi && s.aktif)
        .slice(0, 6)
        .map((s) => ({ peran: 'Murid' as const, nama: s.nama })),
    ];
  }, [pelatih, siswa, lokasi]);

  const loading = historyLoading || studentsLoading || instructorsLoading;

  async function submitAttendance(
    draft: Record<string, 'Hadir' | 'Tidak Hadir'>,
  ): Promise<boolean> {
    const rows: AbsenPayload[] = people.map((p) => ({
      tgl: todayIso(),
      nama: p.nama,
      peran: p.peran,
      lokasi,
      st: draft[`${p.peran}|${p.nama}`] ?? 'Tidak Hadir',
    }));

    try {
      await apiSend<AbsenResult>('/absensi', 'POST', rows);
      await reload();
      toast.success('Absensi hari ini tersimpan.');
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menyimpan absensi.',
      );
      return false;
    }
  }

  return {
    admin,
    lokasi,
    absen,
    locations,
    people,
    loading,
    submitAttendance,
  };
}
