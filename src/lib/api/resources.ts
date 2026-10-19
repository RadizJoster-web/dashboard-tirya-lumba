import { useEffect } from 'react';
import { apiGet, apiGetAbsensi, apiGetProfil, apiGetSiswa } from './client';
import { loadResource } from './cache';
import type { ServerArea, ServerInstructor, ServerLocation, ServerPackage, ServerPoolManager, ServerSession } from './types';
import { HARI } from '../format';

export const API_KEYS = {
  areas: '/areas',
  locations: '/locations',
  packages: '/packages',
  instructors: '/instructor/management?page=1&limit=100',
  managers: '/pool-managers',
  students: '/siswa',
  attendance: '/absensi',
  profile: '/auth/me',
} as const;

export const sessionsKey = (locationId: string): string => `sessions:${locationId}`;

export const fetchAreas = (): Promise<ServerArea[]> => apiGet<ServerArea[]>(API_KEYS.areas);

export const fetchLocations = (): Promise<ServerLocation[]> => apiGet<ServerLocation[]>(API_KEYS.locations);

export const fetchPackages = (): Promise<ServerPackage[]> => apiGet<ServerPackage[]>(API_KEYS.packages);

export const fetchInstructors = (): Promise<ServerInstructor[]> => apiGet<ServerInstructor[]>(API_KEYS.instructors);

export const fetchManagers = (): Promise<ServerPoolManager[]> => apiGet<ServerPoolManager[]>(API_KEYS.managers);

export const fetchStudents = () => apiGetSiswa();

// GET /sessions requires both locationId and dayOfWeek, so a location's weekly
// schedule is assembled from seven requests and cached under one key.
export async function fetchSessionsForLocation(locationId: string): Promise<ServerSession[]> {
  const days = await Promise.all(
    HARI.map((day) => apiGet<ServerSession[]>(`/sessions?locationId=${encodeURIComponent(locationId)}&dayOfWeek=${encodeURIComponent(day)}`)),
  );
  return days.flat();
}

export const fetchAttendance = () => apiGetAbsensi(API_KEYS.attendance);

export const fetchProfile = () => apiGetProfil();

function bootstrap(): Promise<unknown> {
  return Promise.allSettled([
    loadResource(API_KEYS.areas, fetchAreas),
    loadResource(API_KEYS.locations, fetchLocations),
    loadResource(API_KEYS.packages, fetchPackages),
    loadResource(API_KEYS.instructors, fetchInstructors),
    loadResource(API_KEYS.managers, fetchManagers),
  ]);
}

// Master data is fetched once per signed-in session, not per route change or tab focus.
export function useBootstrapData(): void {
  useEffect(() => {
    void bootstrap();
  }, []);
}
