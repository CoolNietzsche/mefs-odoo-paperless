import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  AUTH_SESSION: 'auth_session',
  SERVER_PROFILES: 'server_profiles',
  BIOMETRICS_ENABLED: 'biometrics_enabled',
};

class StorageService {
  async saveSession(session: any) {
    try {
      await SecureStore.setItemAsync(KEYS.AUTH_SESSION, JSON.stringify(session));
    } catch (e) {
      console.error('SecureStore Save Error:', e);
      // Fallback for devices without SecureStore (rare but possible in some Android configs)
      if (Platform.OS === 'web') {
        localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify(session));
      }
    }
  }

  async getSession() {
    try {
      const session = await SecureStore.getItemAsync(KEYS.AUTH_SESSION);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      if (Platform.OS === 'web') {
        const session = localStorage.getItem(KEYS.AUTH_SESSION);
        return session ? JSON.parse(session) : null;
      }
      return null;
    }
  }

  async clearSession() {
    try {
      await SecureStore.deleteItemAsync(KEYS.AUTH_SESSION);
    } catch (e) {
      if (Platform.OS === 'web') {
        localStorage.removeItem(KEYS.AUTH_SESSION);
      }
    }
  }

  async setBiometricsEnabled(enabled: boolean) {
    try {
      await SecureStore.setItemAsync(KEYS.BIOMETRICS_ENABLED, enabled ? 'true' : 'false');
    } catch (e) {}
  }

  async isBiometricsEnabled() {
    try {
      const val = await SecureStore.getItemAsync(KEYS.BIOMETRICS_ENABLED);
      return val === 'true';
    } catch (e) {
      return false;
    }
  }
}

export const storageService = new StorageService();
