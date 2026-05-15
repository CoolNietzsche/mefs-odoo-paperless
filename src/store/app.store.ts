import { create } from 'zustand';

interface AppState {
  isOffline: boolean;
  isLocked: boolean;
  darkMode: 'light' | 'dark' | 'system';
  apiLatency: number;
  
  setOffline: (offline: boolean) => void;
  setLocked: (locked: boolean) => void;
  setDarkMode: (mode: 'light' | 'dark' | 'system') => void;
  setApiLatency: (ms: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOffline: false,
  isLocked: false,
  darkMode: 'system',
  apiLatency: 0,

  setOffline: (offline) => set({ isOffline: offline }),
  setLocked: (locked) => set({ isLocked: locked }),
  setDarkMode: (mode) => set({ darkMode: mode }),
  setApiLatency: (latency) => set({ apiLatency: latency }),
}));
