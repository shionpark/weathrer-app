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
