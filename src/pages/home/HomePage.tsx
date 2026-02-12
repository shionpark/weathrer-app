import { searchDistricts } from '@/entities/location/lib/searchDistricts';
import {
  useCurrentWeather,
  useForecast,
} from '@/entities/weather/model/useWeather';
import { ErrorMessage } from '@/shared/ui/ErrorMessage';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

export function HomePage() {
  const { data, isLoading, error } = useCurrentWeather(37.5665, 126.978);
  const { data: forecastData } = useForecast(37.5665, 126.978);

  console.log(data);
  console.log('forecastData: ', forecastData);

  const results = searchDistricts('종로');
  console.log('Districts: ', results);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="p-4 text-2xl font-bold">날씨 앱</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(forecastData, null, 2)}</pre>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
