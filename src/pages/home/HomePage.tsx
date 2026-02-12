import {
  useCurrentWeather,
  useForecast,
} from '@/entities/weather/model/useWeather';
import { useGeolocation } from '@/features/detect-location/model/useGeolocation';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { WeatherDetail } from '@/widgets/weather-detail/ui/WeatherDetail';

export function HomePage() {
  const { lat, lon, loading: geoLoading, error: geoError } = useGeolocation();
  const {
    data: current,
    isLoading: weatherLoading,
    error: weatherError,
  } = useCurrentWeather(lat, lon);
  const { data: forecast, isLoading: forecastLoading } = useForecast(lat, lon);

  if (geoLoading || weatherLoading || forecastLoading) {
    return <LoadingSpinner />;
  }

  if (geoError) {
    return <ErrorMessage message="위치 정보를 가져올 수 없습니다." />;
  }

  if (weatherError || !current || !forecast) {
    return <ErrorMessage message="날씨 정보를 불러올 수 없습니다." />;
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <WeatherDetail
        current={current}
        daily={forecast.daily}
        hourly={forecast.hourly}
        locationName="현재 위치"
      />
    </div>
  );
}
