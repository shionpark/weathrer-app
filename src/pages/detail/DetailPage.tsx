import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useFavorites } from '@/entities/favorite/model/useFavorites';
import {
  useCurrentWeather,
  useForecast,
} from '@/entities/weather/model/useWeather';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { WeatherDetail } from '@/widgets/weather-detail/ui/WeatherDetail';

export function DetailPage() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat') ? Number(searchParams.get('lat')) : null;
  const lon = searchParams.get('lon') ? Number(searchParams.get('lon')) : null;
  const name = searchParams.get('name') ?? '알 수 없는 장소';

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const {
    data: current,
    isLoading: weatherLoading,
    error: weatherError,
  } = useCurrentWeather(lat, lon);
  const { data: forecast, isLoading: forecastLoading } = useForecast(lat, lon);

  const isFavoriteLocation = lat && lon ? isFavorite(lat, lon) : false;
  const favoriteId = lat && lon ? `${lat}_${lon}` : null;

  const handleToggleFavorite = () => {
    if (!lat || !lon) return;

    if (isFavoriteLocation && favoriteId) {
      removeFavorite(favoriteId);
      toast.success('즐겨찾기에서 삭제되었습니다');
    } else {
      const success = addFavorite({ name, alias: name, lat, lon });
      if (success) {
        toast.success('즐겨찾기에 추가되었습니다');
      } else {
        toast.error('즐겨찾기는 최대 6개까지 추가할 수 있습니다');
      }
    }
  };

  if (!lat || !lon) {
    return <ErrorMessage message="잘못된 접근입니다." />;
  }

  if (weatherLoading || forecastLoading) {
    return <LoadingSpinner />;
  }

  if (weatherError || !current || !forecast) {
    return <ErrorMessage message="날씨 정보를 불러올 수 없습니다." />;
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <button
        onClick={handleToggleFavorite}
        className="mb-4 w-full rounded-lg border border-blue-500 bg-white px-4 py-2 text-blue-500 hover:bg-blue-50"
      >
        {isFavoriteLocation ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      </button>

      <WeatherDetail
        current={current}
        daily={forecast.daily}
        hourly={forecast.hourly}
        locationName={name}
      />
    </div>
  );
}
