import { useEffect } from 'react';
import { apiGet, apiGetAbsensi, apiGetProfil, apiGetSiswa } from './api';
import { loadResource } from './data-cache';
import type { ServerArea, ServerInstructor, ServerLocation, ServerPackage, ServerPoolManager, ServerSession } from './api-types';
import { setRefInstructors, setRefLocations, setRefPackages } from './ref-data';

export const API_KEYS = {
  areas: '/areas',
  locations: '/locations',
  packages: '/packages',
  instructors: '/instructor/management?page=1&limit=100',
  managers: '/pool-managers',
  students: '/siswa',
  sessions: '/sessions',
  attendance: '/absensi',
  profile: '/auth/me',
} as const;

export const fetchAreas = (): Promise<ServerArea[]> => apiGet<ServerArea[]>(API_KEYS.areas);

export const fetchLocations = async (): Promise<ServerLocation[]> => {
  const rows = await apiGet<ServerLocation[]>(API_KEYS.locations);
  setRefLocations(rows);
  return rows;
};

export const fetchPackages = async (): Promise<ServerPackage[]> => {
  const rows = await apiGet<ServerPackage[]>(API_KEYS.packages);
  setRefPackages(rows);
  return rows;
};

export const fetchInstructors = async (): Promise<ServerInstructor[]> => {
  const rows = await apiGet<ServerInstructor[]>(API_KEYS.instructors);
  setRefInstructors(rows);
  return rows;
};

export const fetchManagers = (): Promise<ServerPoolManager[]> => apiGet<ServerPoolManager[]>(API_KEYS.managers);

export const fetchStudents = () => apiGetSiswa();

export const fetchSessions = (): Promise<ServerSession[]> => apiGet<ServerSession[]>(API_KEYS.sessions);

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
