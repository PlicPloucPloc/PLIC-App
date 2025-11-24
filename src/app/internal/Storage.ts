import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { FiltersState } from '@app/definitions';

export class StorageManager {
  // ---- KEYS ----
  static AppStorage = {
    filters: (userId: string) => `${userId}/apartmentFilters`,
  };

  static AppSecureStore = {
    token: 'token',
    refreshToken: 'refresh_token',
  };

  // ---- ASYNC STORAGE ----
  setFilters(userId: string, filters: FiltersState): Promise<void> {
    const key = StorageManager.AppStorage.filters(userId);
    return AsyncStorage.setItem(key, JSON.stringify(filters));
  }

  async getFilters(userId: string): Promise<FiltersState | null> {
    const key = StorageManager.AppStorage.filters(userId);
    const filters = await AsyncStorage.getItem(key);
    return filters ? (JSON.parse(filters) as FiltersState) : null;
  }

  clearAsyncStorage(): Promise<void> {
    return AsyncStorage.clear();
  }

  // ---- SECURE STORE ----
  setToken(token: string): Promise<void> {
    return SecureStore.setItemAsync(StorageManager.AppSecureStore.token, token);
  }

  getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(StorageManager.AppSecureStore.token);
  }

  deleteToken(): Promise<void> {
    return SecureStore.deleteItemAsync(StorageManager.AppSecureStore.token);
  }

  setRefreshToken(token: string): Promise<void> {
    return SecureStore.setItemAsync(StorageManager.AppSecureStore.refreshToken, token);
  }

  getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(StorageManager.AppSecureStore.refreshToken);
  }

  deleteRefreshToken(): Promise<void> {
    return SecureStore.deleteItemAsync(StorageManager.AppSecureStore.refreshToken);
  }

  async clearSecureStore(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(StorageManager.AppSecureStore.token),
      SecureStore.deleteItemAsync(StorageManager.AppSecureStore.refreshToken),
    ]);
  }

  // ---- COMBINED ----
  async clearStorage(): Promise<void> {
    await Promise.all([this.clearAsyncStorage(), this.clearSecureStore()]);
  }
}

// Export as singleton
export const storageManager = new StorageManager();
