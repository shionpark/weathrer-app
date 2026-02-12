import { fetchWeatherApi } from '@/shared/api/apiClient';
import { formatTime } from '@/shared/lib/formatters';

import type {
  CurrentWeather,
  DailyWeather,
  HourlyWeather,
} from '../model/types';

interface CurrentWeatherResponse {
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface ForecastResponse {
  list: {
    dt_txt: string;
    main: { temp: number; temp_min: number; temp_max: number };
    weather: { icon: string }[];
  }[];
}

/**
 * 현재 위치(위도/경도) 기준의 실시간 날씨 정보를 조회하는 훅
 * OpenWeather `weather` 엔드포인트를 호출해 필요한 필드만 매핑함
 */
export async function fetchCurrentWeather(
  lat: number,
  lon: number,
): Promise<CurrentWeather> {
  const data = await fetchWeatherApi<CurrentWeatherResponse>(
    '/data/2.5/weather',
    { lat, lon },
  );

  return {
    temp: data.main.temp,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
}

/**
 * 오늘 하루의 최저/최고 기온과 시간대별 예보를 반환하는 훅
 * OpenWeather 3시간 간격 예보(`forecast`)에서 오늘 날짜만 필터링해
 * - daily: 오늘의 최저·최고 기온
 * - hourly: 오늘 시간대별 기온/아이콘 리스트
 * 로 가공함
 */
export async function fetchForecast(
  lat: number,
  lon: number,
): Promise<{ daily: DailyWeather; hourly: HourlyWeather[] }> {
  const data = await fetchWeatherApi<ForecastResponse>('/data/2.5/forecast', {
    lat,
    lon,
  });

  const today = new Date().toISOString().split('T')[0];
  const todayItems = data.list.filter((item) => item.dt_txt.startsWith(today));

  const allTemps = todayItems.map((item) => item.main.temp);
  const daily: DailyWeather = {
    tempMin: Math.min(...allTemps),
    tempMax: Math.max(...allTemps),
  };

  const hourly: HourlyWeather[] = todayItems.map((item) => ({
    time: formatTime(item.dt_txt),
    temp: item.main.temp,
    icon: item.weather[0].icon,
  }));

  return { daily, hourly };
}
