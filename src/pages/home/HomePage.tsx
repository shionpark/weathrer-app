import { useNavigate } from 'react-router-dom';

import { useFavorites } from '@/entities/favorite/model/useFavorites';
import { useReverseGeocode } from '@/entities/location/model/useLocation';
import {
  useCurrentWeather,
  useForecast,
} from '@/entities/weather/model/useWeather';
import { useGeolocation } from '@/features/detect-location/model/useGeolocation';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { CurrentHero } from '@/widgets/current-hero/ui/CurrentHero';
import { FavoriteList } from '@/widgets/favorite-list/ui/FavoriteList';
import { HourlyScroller } from '@/widgets/hourly-forecast/ui/HourlyScroller';
import { LocationSearchBar } from '@/widgets/location-search/ui/LocationSearchBar';

export function HomePage() {
  const navigate = useNavigate();
  const { favorites, removeFavorite, updateAlias } = useFavorites();
  const { lat, lon, loading: geoLoading, error: geoError } = useGeolocation();
  const { data: locationKoName } = useReverseGeocode(lat, lon);
  const {
    data: current,
    isLoading: weatherLoading,
    error: weatherError,
  } = useCurrentWeather(lat, lon);
  const { data: forecast, isLoading: forecastLoading } = useForecast(lat, lon);

  const isLoading = geoLoading || weatherLoading || forecastLoading;
  const hasError = geoError || weatherError;

  const handleSelectFavorite = (
    _id: string,
    name: string,
    favLat: number,
    favLon: number,
  ) => {
    navigate(
      `/detail?lat=${favLat}&lon=${favLon}&name=${encodeURIComponent(name)}`,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl overflow-hidden px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left: current location hero */}
          <div className="min-w-[320px] space-y-6">
            <LocationSearchBar />
            {hasError && (
              <ErrorMessage message="위치 정보를 가져올 수 없습니다." />
            )}
            <CurrentHero
              isLoading={isLoading}
              current={current}
              daily={forecast?.daily}
              locationName={locationKoName ?? current?.name ?? '현재 위치'}
            />
          </div>

          {/* Right: hourly + favorites */}
          <div className="min-w-0 space-y-6">
            <HourlyScroller
              title="오늘 · 시간대별"
              hourly={forecast?.hourly ?? []}
              isLoading={isLoading}
            />

            <div className="min-w-0 rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  즐겨찾기
                </h2>
                <span className="text-sm text-gray-500">
                  {favorites.length}개
                </span>
              </div>
              <FavoriteList
                favorites={favorites}
                onRemove={removeFavorite}
                onEditAlias={updateAlias}
                onSelect={handleSelectFavorite}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
