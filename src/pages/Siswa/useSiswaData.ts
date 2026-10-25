import { useMemo } from 'react';
import { apiGet } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { ServerLocation, ServerSiswa } from '../../lib/api/types';

const fetchStudents = (): Promise<ServerSiswa[]> =>
  apiGet<ServerSiswa[]>('/siswa');

const fetchLocations = (): Promise<ServerLocation[]> =>
  apiGet<ServerLocation[]>('/locations');

export function useSiswaData() {
  const { data, loading: studentsLoading } = useResource(
    '/siswa',
    fetchStudents,
  );
  const { data: locationData, loading: locationsLoading } = useResource(
    '/locations',
    fetchLocations,
  );

  const siswa = useMemo(() => data ?? [], [data]);
  const locations = useMemo(() => locationData ?? [], [locationData]);
  const isLoading = studentsLoading || locationsLoading;

  const locationOptions = useMemo(
    () =>
      [
        ...new Set([
          ...locations.map((l) => l.name),
          ...siswa.map((r) => r.lokasi),
        ]),
      ]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'id')),
    [locations, siswa],
  );

  return {
    siswa,
    locations,
    isLoading,
    locationOptions,
  };
}
