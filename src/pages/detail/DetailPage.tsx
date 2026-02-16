import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  const favoriteButtonClass = isFavoriteLocation
    ? 'inline-flex items-center gap-2 rounded-full border border-red-500 bg-red-50 px-3 py-2 text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-1'
    : 'inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1 shadow-sm';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1 focus-visible:outline-none"
              >
                ←
              </button>
              <div>
                <p className="text-xs tracking-wide text-gray-400 uppercase">
                  상세 날씨
                </p>
                <h1 className="text-xl font-semibold text-gray-900">{name}</h1>
              </div>
            </div>
            <button
              onClick={handleToggleFavorite}
              className={`${favoriteButtonClass} w-full justify-center md:w-auto`}
              aria-label={
                isFavoriteLocation ? '즐겨찾기 해제' : '즐겨찾기 추가'
              }
            >
              {isFavoriteLocation ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M11.645 20.91 6.6 23.686a1 1 0 0 1-1.451-1.054l.957-5.585-4.05-3.947a1 1 0 0 1 .554-1.706l5.6-.813 2.504-5.07a1 1 0 0 1 1.794 0l2.504 5.07 5.6.813a1 1 0 0 1 .554 1.706l-4.05 3.947.957 5.585a1 1 0 0 1-1.451 1.054l-5.045-2.776Z" />
                  </svg>
                  <span className="text-sm font-medium">해제</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.75.75 0 0 1 1.04.302l2.597 4.95 5.474.797a.75.75 0 0 1 .415 1.281l-3.96 3.86.935 5.454a.75.75 0 0 1-1.088.791L12 18.901l-4.893 2.574a.75.75 0 0 1-1.088-.79l.935-5.455-3.96-3.86a.75.75 0 0 1 .415-1.28l5.474-.798 2.598-4.95Z"
                    />
                  </svg>
                  <span className="text-sm font-medium">추가</span>
                </>
              )}
            </button>
          </div>

          <WeatherDetail
            current={current}
            daily={forecast.daily}
            hourly={forecast.hourly}
            locationName={name}
          />
        </div>
      </div>
    </div>
  );
}
