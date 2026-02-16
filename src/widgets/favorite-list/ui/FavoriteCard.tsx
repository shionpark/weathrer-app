import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { Favorite } from '@/entities/favorite/model/types';
import {
  useCurrentWeather,
  useForecast,
} from '@/entities/weather/model/useWeather';
import { formatTemp } from '@/shared/lib/formatters';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: string) => void;
  onEditAlias: (id: string, alias: string) => void;
}

export function FavoriteCard({
  favorite,
  onRemove,
  onEditAlias,
}: FavoriteCardProps) {
  const navigate = useNavigate();
  const { data: current, isLoading } = useCurrentWeather(
    favorite.lat,
    favorite.lon,
  );
  const { data: forecast } = useForecast(favorite.lat, favorite.lon);

  const handleClick = () => {
    navigate(
      `/detail?lat=${favorite.lat}&lon=${favorite.lon}&name=${encodeURIComponent(favorite.name)}`,
    );
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newAlias = prompt('별칭 수정', favorite.alias);
    if (newAlias && newAlias.trim()) {
      onEditAlias(favorite.id, newAlias.trim());
      toast.success('별칭이 수정되었습니다');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(favorite.id);
    toast.success('즐겨찾기에서 삭제되었습니다');
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-white p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (!current || !forecast) return null;

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-lg"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-medium">{favorite.alias}</h3>
        <div className="flex gap-1">
          <button
            onClick={handleEdit}
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            수정
          </button>
          <button
            onClick={handleRemove}
            className="text-sm text-gray-500 hover:text-red-600"
          >
            삭제
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <img
          src={`https://openweathermap.org/img/wn/${current.icon}.png`}
          alt={current.description}
          className="h-12 w-12"
        />
        <div>
          <p className="text-2xl font-bold">{formatTemp(current.temp)}</p>
          <p className="text-xs text-gray-500">
            {formatTemp(forecast.daily.tempMax)} /{' '}
            {formatTemp(forecast.daily.tempMin)}
          </p>
        </div>
      </div>
    </div>
  );
}
