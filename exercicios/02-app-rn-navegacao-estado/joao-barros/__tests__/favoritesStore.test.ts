// __tests__/favoritesStore.test.ts
//
// Testes do useFavoritesStore (Zustand + persist MMKV) — gerados com auxílio de IA e revisados.

import { STORAGE_KEY, useFavoritesStore } from '../src/store/favoritesStore';
import { mmkvStorage } from '../src/storage/mmkv';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([42]);
  });

  test('toggle remove id se existe', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle(42);
    toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após add e false após remove', () => {
    const { add, remove, isFavorite } = useFavoritesStore.getState();
    add(7);
    expect(isFavorite(7)).toBe(true);
    expect(isFavorite(8)).toBe(false);
    remove(7);
    expect(isFavorite(7)).toBe(false);
  });

  test('add não duplica ids', () => {
    const { add } = useFavoritesStore.getState();
    add(1);
    add(1);
    add(2);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2]);
  });

  test('remove de id inexistente não altera a lista', () => {
    const { add, remove } = useFavoritesStore.getState();
    add(1);
    remove(99);
    expect(useFavoritesStore.getState().ids).toEqual([1]);
  });

  test('clear esvazia ids', () => {
    const { add, clear } = useFavoritesStore.getState();
    add(1);
    add(2);
    clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('persiste ids no storage a cada mudança', () => {
    const { add, remove } = useFavoritesStore.getState();
    add(10);
    add(20);
    expect(JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([10, 20]);
    remove(10);
    expect(JSON.parse(mmkvStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([20]);
  });
});
