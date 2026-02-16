import { useQuery } from '@tanstack/react-query';

import { fetchCurrentWeather, fetchForecast } from '../api/weatherApi';

export function useCurrentWeather(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['currentWeather', lat, lon],
    queryFn: () => fetchCurrentWeather(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 5,
  });
}

export function useForecast(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: () => fetchForecast(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 5,
  });
}
