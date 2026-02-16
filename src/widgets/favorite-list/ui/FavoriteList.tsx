import type { Favorite } from '@/entities/favorite/model/types';

import { FavoriteCard } from './FavoriteCard';

interface FavoriteListProps {
  favorites: Favorite[];
  onRemove: (id: string) => void;
  onEditAlias: (id: string, alias: string) => void;
  onSelect?: (id: string, name: string, lat: number, lon: number) => void;
}

export function FavoriteList({
  favorites,
  onRemove,
  onEditAlias,
  onSelect,
}: FavoriteListProps) {
  if (favorites.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        즐겨찾기한 장소가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 min-w-0">
      {favorites.map((fav) => (
        <FavoriteCard
          key={fav.id}
          favorite={fav}
          onRemove={onRemove}
          onEditAlias={onEditAlias}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
