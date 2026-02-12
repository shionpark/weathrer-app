import { useSearchParams } from 'react-router-dom';

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

  const {
    data: current,
    isLoading: weatherLoading,
    error: weatherError,
  } = useCurrentWeather(lat, lon);
  const { data: forecast, isLoading: forecastLoading } = useForecast(lat, lon);

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
      <WeatherDetail
        current={current}
        daily={forecast.daily}
        hourly={forecast.hourly}
        locationName={name}
      />
    </div>
  );
}
