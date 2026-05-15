import { create } from 'zustand';
import { OdooSession } from '../types/odoo.types';
import { storageService } from '../services/storage.service';
import { odooService } from '../services/odoo.service';

interface AuthState {
  session: OdooSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (serverUrl: string, db: string, login: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setError: (error) => set({ error }),

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const session = await storageService.getSession();
      if (session) {
        odooService.setServerUrl(session.server_url);
        odooService.setSessionId(session.session_id);
        set({ session, isAuthenticated: true });
      }
    } catch (e) {
      console.error('Session restore failed', e);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (serverUrl, db, login, pass) => {
    set({ isLoading: true, error: null });
    try {
      odooService.setServerUrl(serverUrl);
      const session = await odooService.authenticate(db, login, pass);
      await storageService.saveSession(session);
      set({ session, isAuthenticated: true });
    } catch (e: any) {
      set({ error: e.message || 'Login failed' });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await odooService.destroySession();
      await storageService.clearSession();
      set({ session: null, isAuthenticated: false });
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      set({ isLoading: false });
    }
  }
}));
