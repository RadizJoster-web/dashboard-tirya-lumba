import { useMemo } from 'react';
import { toast } from 'sonner';
import { apiGet, apiSend } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type {
  AbsenPayload,
  AbsenResult,
  ServerAbsen,
  ServerLocation,
} from '../../lib/api/types';
import { useAuth } from '../../lib/auth-context';

export interface AbsensiTodayItem {
  peran: 'Murid' | 'Pelatih';
  nama: string;
  lokasi: string;
  sesi: string;
  status: 'Hadir' | 'Tidak Hadir';
}

interface TodayApiResponse {
  success: boolean;
  today: string;
  date: string;
  totalItems: number;
  data: AbsensiTodayItem[];
}

const fetchAttendance = (): Promise<ServerAbsen[]> =>
  apiGet<ServerAbsen[]>('/absensi');

const fetchTodayPeople = (): Promise<TodayApiResponse> =>
  apiGet<TodayApiResponse>('/absensi/today');

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
    reload: reloadHistory,
  } = useResource('/absensi', fetchAttendance);

  const {
    data: todayResponse,
    loading: todayLoading,
    reload: reloadToday,
  } = useResource('/absensi/today', fetchTodayPeople);

  const { data: locationData } = useResource('/locations', fetchLocations);

  const absen = useMemo(() => history ?? [], [history]);
  const locations = useMemo(
    () => (locationData ?? []).map((l) => l.name),
    [locationData],
  );

  const rawPeople = useMemo(
    () => todayResponse?.data ?? [],
    [todayResponse],
  );

  const people = useMemo(() => {
    if (admin) return rawPeople;
    return rawPeople.filter((p) => !lokasi || p.lokasi === lokasi);
  }, [rawPeople, admin, lokasi]);

  const loading = historyLoading || todayLoading;

  async function submitAttendance(
    draft: Record<string, 'Hadir' | 'Tidak Hadir'>,
  ): Promise<boolean> {
    const rows: AbsenPayload[] = people.map((p) => ({
      tgl: todayIso(),
      nama: p.nama,
      peran: p.peran,
      lokasi: p.lokasi || lokasi,
      st: draft[`${p.peran}|${p.nama}`] ?? p.status ?? 'Tidak Hadir',
    }));

    try {
      await apiSend<AbsenResult>('/absensi', 'POST', rows);
      await Promise.all([reloadHistory(), reloadToday()]);
      toast.success('Absensi hari ini berhasil tersimpan.');
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
