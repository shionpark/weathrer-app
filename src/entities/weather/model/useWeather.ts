import { useQuery } from '@tanstack/react-query';

import { fetchForecastApi, fetchWeatherApi } from '@/shared/api/apiClient';

import type { CurrentWeather } from './types';

export function useCurrentWeather(lat: number | null, lon: number | null) {
  return useQuery<CurrentWeather>({
    queryKey: ['currentWeather', lat, lon],
    queryFn: async () => {
      const data = await fetchWeatherApi(lat!, lon!);
      return {
        temp: data.main.temp,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      };
    },
    enabled: lat !== null && lon !== null,
  });
}

export function useForecast(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: async () => {
      const data = await fetchForecastApi(lat!, lon!);

      const today = new Date().toISOString().split('T')[0];
      const todayItems = data.list.filter((item: { dt_txt: string }) =>
        item.dt_txt.startsWith(today),
      );

      const daily = {
        tempMin: Math.min(
          ...todayItems.map(
            (item: { main: { temp_min: number } }) => item.main.temp_min,
          ),
        ),
        tempMax: Math.max(
          ...todayItems.map(
            (item: { main: { temp_max: number } }) => item.main.temp_max,
          ),
        ),
      };

      const hourly = todayItems.map(
        (item: {
          dt_txt: string;
          main: { temp: number };
          weather: { icon: string }[];
        }) => ({
          time: item.dt_txt,
          temp: item.main.temp,
          icon: item.weather[0].icon,
        }),
      );

      return { daily, hourly };
    },
    enabled: lat !== null && lon !== null,
  });
}
