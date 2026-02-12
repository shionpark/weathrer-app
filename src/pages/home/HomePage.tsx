import {
  useCurrentWeather,
  useForecast,
} from '@/entities/weather/model/useWeather';

export function HomePage() {
  const { data, isLoading, error } = useCurrentWeather(37.5665, 126.978);
  const { data: forecastData } = useForecast(37.5665, 126.978);

  console.log(data);
  console.log('forecastData: ', forecastData);

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="p-4 text-2xl font-bold">날씨 앱</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(forecastData, null, 2)}</pre>
    </div>
  );
}
