import type { Favorite } from '../model/types';

const STORAGE_KEY = 'weather-app-favorites';
const MAX_FAVORITES = 6;

export function getFavorites(): Favorite[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveFavorites(favorites: Favorite[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function addFavorite(favorite: Omit<Favorite, 'id'>): boolean {
  const favorites = getFavorites();

  if (favorites.length >= MAX_FAVORITES) {
    return false;
  }

  const id = `${favorite.lat}_${favorite.lon}`;
  const exists = favorites.some((f) => f.id === id);

  if (exists) return false;

  saveFavorites([...favorites, { ...favorite, id }]);
  return true;
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  saveFavorites(favorites);
}

export function updateAlias(id: string, newAlias: string): void {
  const favorites = getFavorites().map((f) =>
    f.id === id ? { ...f, alias: newAlias } : f,
  );
  saveFavorites(favorites);
}

export function isFavorite(lat: number, lon: number): boolean {
  const id = `${lat}_${lon}`;
  return getFavorites().some((f) => f.id === id);
}
