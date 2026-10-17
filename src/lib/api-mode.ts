import { create } from 'zustand';

export type ApiMode = 'checking' | 'live' | 'demo';

interface ApiModeState {
  mode: ApiMode;
  setMode: (mode: ApiMode) => void;
}

export const useApiMode = create<ApiModeState>((set) => ({
  mode: 'checking',
  setMode: (mode) => set({ mode }),
}));
