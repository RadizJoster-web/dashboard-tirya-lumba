import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { apiGet, apiSend } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { ServerLocation, ServerSession } from '../../lib/api/types';
import { HARI } from '../../lib/format';
import { slotKey } from '../../components/jadwal/session-templates';

const fetchLocations = (): Promise<ServerLocation[]> =>
  apiGet<ServerLocation[]>('/locations');

export const sessionsKey = (locationId: string): string =>
  `sessions:${locationId}`;

export async function fetchSessionsForLocation(
  locationId: string,
): Promise<ServerSession[]> {
  const days = await Promise.all(
    HARI.map((day) =>
      apiGet<ServerSession[]>(
        `/sessions?locationId=${encodeURIComponent(locationId)}&dayOfWeek=${encodeURIComponent(day)}`,
      ),
    ),
  );
  return days.flat();
}

export interface NewSessionPayload {
  sessionName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  locationId: string;
}

export function useJadwalData() {
  const [locationId, setLocationId] = useState('');

  const { data: locationData, loading: locationsLoading } = useResource(
    '/locations',
    fetchLocations,
  );
  const locations = useMemo(() => locationData ?? [], [locationData]);
  const activeLocationId = locationId || locations[0]?.id || '';

  const sessionsFetcher = useCallback(
    () =>
      activeLocationId
        ? fetchSessionsForLocation(activeLocationId)
        : Promise.resolve([]),
    [activeLocationId],
  );

  const {
    data: sessionData,
    error: sessionsError,
    reload: reloadSessions,
  } = useResource(sessionsKey(activeLocationId), sessionsFetcher);

  const sessions = useMemo(() => sessionData ?? [], [sessionData]);
  const existing = useMemo(
    () =>
      new Set(sessions.map((s) => slotKey(s.sessionName, s.dayOfWeek))),
    [sessions],
  );
  const locationName =
    locations.find((l) => l.id === activeLocationId)?.name ?? '';

  async function submitSchedule(
    additions: NewSessionPayload[],
  ): Promise<boolean> {
    const results = await Promise.allSettled(
      additions.map((payload) =>
        apiSend<ServerSession>('/sessions', 'POST', payload),
      ),
    );
    await reloadSessions();

    const failed = results.filter((r) => r.status === 'rejected').length;
    if (failed === 0) {
      toast.success(`${additions.length} jadwal dikirim ke server.`);
      return true;
    }
    toast.error(
      `${additions.length - failed} jadwal tersimpan, ${failed} gagal.`,
      { style: { color: '#B3341F' } },
    );
    return false;
  }

  return {
    locations,
    locationsLoading,
    activeLocationId,
    locationName,
    changeLocation: setLocationId,
    sessions,
    sessionData,
    sessionsError,
    existing,
    reloadSessions,
    submitSchedule,
  };
}
