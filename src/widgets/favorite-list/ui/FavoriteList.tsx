import { useFavorites } from '@/entities/favorite/model/useFavorites';

import { FavoriteCard } from './FavoriteCard';

export function FavoriteList() {
  const { favorites, removeFavorite, updateAlias } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        즐겨찾기한 장소가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {favorites.map((fav) => (
        <FavoriteCard
          key={fav.id}
          favorite={fav}
          onRemove={removeFavorite}
          onEditAlias={updateAlias}
        />
      ))}
    </div>
  );
}
