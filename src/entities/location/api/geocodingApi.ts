import { fetchWeatherApi } from '@/shared/api/apiClient';

import type { GeocodingResult } from '../model/types';

interface GeocodingResponse {
  lat: number;
  lon: number;
  local_names?: { ko?: string };
  name: string;
}

export async function geocodeLocation(
  query: string,
): Promise<GeocodingResult | null> {
  const results = await fetchWeatherApi<GeocodingResponse[]>(
    '/geo/1.0/direct',
    { q: `${query},KR`, limit: 1 },
  );

  if (results.length === 0) return null;

  const { lat, lon, name } = results[0];
  return { lat, lon, name };
}
