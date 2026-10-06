// src/storage/mmkv.ts
//
// ATIVIDADE 2 — TASK 7 (storage síncrono)
//
// MMKV (C++ via JSI) é ~30x mais rápido que AsyncStorage.
// Funciona em iOS/Android nativo. Em web (testes/dev), polyfill com localStorage.
// Se o módulo nativo não estiver disponível (Expo Go, Jest), cai pra memória.
//
// Doc: https://github.com/mrousavy/react-native-mmkv

import { Platform } from 'react-native';

type KV = {
  getString: (k: string) => string | undefined;
  set: (k: string, v: string) => void;
  delete: (k: string) => void;
};

const createMemoryStorage = (): KV => {
  const map = new Map<string, string>();
  return {
    getString: (k) => map.get(k),
    set: (k, v) => void map.set(k, v),
    delete: (k) => void map.delete(k),
  };
};

const createStorage = (): KV => {
  const isWeb =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined';

  if (isWeb) {
    return {
      getString: (k) => window.localStorage.getItem(k) ?? undefined,
      set: (k, v) => window.localStorage.setItem(k, v),
      delete: (k) => window.localStorage.removeItem(k),
    };
  }

  try {
    const { MMKV } = require('react-native-mmkv');
    return new MMKV({ id: 'favorites-store' });
  } catch {
    // Módulo nativo ausente (Expo Go / Jest) — sem persistência real.
    return createMemoryStorage();
  }
};

export const storage = createStorage();

// Adapter no formato StateStorage do Zustand (getItem/setItem/removeItem).
export const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
