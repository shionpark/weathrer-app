import { useQuery } from '@tanstack/react-query';

import { fetchWeatherApi } from '@/shared/api/apiClient';

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
