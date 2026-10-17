import { create } from 'zustand';
import type { RefStore } from './api-types';

/** Master data mentah dari server (disisi api-sync) untuk mengisi <select> form pendaftaran. */
export const useRefData = create<RefStore>(() => ({
  locations: [],
  packages: [],
  instructors: [],
}));

export function setRefLocations(rows: RefStore['locations']): void {
  useRefData.setState({ locations: rows });
}

export function setRefPackages(rows: RefStore['packages']): void {
  useRefData.setState({ packages: rows });
}

export function setRefInstructors(rows: RefStore['instructors']): void {
  useRefData.setState({ instructors: rows });
}
