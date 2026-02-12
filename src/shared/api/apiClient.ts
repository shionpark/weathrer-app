import {
  OPENWEATHER_API_KEY,
  OPENWEATHER_BASE_URL,
} from '@/shared/config/constants';

export async function fetchWeatherApi<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(endpoint, OPENWEATHER_BASE_URL);
  url.searchParams.set('appid', OPENWEATHER_API_KEY);
  url.searchParams.set('units', 'metric');
  url.searchParams.set('lang', 'kr');

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  return response.json();
}
