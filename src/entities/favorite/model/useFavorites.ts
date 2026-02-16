import { useState } from 'react';

import {
  addFavorite as addFav,
  getFavorites,
  isFavorite as checkFavorite,
  removeFavorite as removeFav,
  updateAlias as updateFavAlias,
} from '../lib/favoriteStorage';
import type { Favorite } from './types';

/**
 * 즐겨찾기(LocalStorage) 목록을 관리하는 훅
 * - 추가/삭제/별칭 수정 시 스토리지 반영 후 상태를 새로고침
 * - 위도·경도로 즐겨찾기 여부를 확인하는 헬퍼 제공
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(() => getFavorites());

  const addFavorite = (favorite: Omit<Favorite, 'id'>) => {
    const success = addFav(favorite);
    if (success) setFavorites(getFavorites());
    return success;
  };

  const removeFavorite = (id: string) => {
    removeFav(id);
    setFavorites(getFavorites());
  };

  const updateAlias = (id: string, newAlias: string) => {
    updateFavAlias(id, newAlias);
    setFavorites(getFavorites());
  };

  const isFavorite = (lat: number, lon: number) => {
    return checkFavorite(lat, lon);
  };

  return { favorites, addFavorite, removeFavorite, updateAlias, isFavorite };
}
