import { fetchWeatherApi } from '@/shared/api/apiClient';

import type { GeocodingResult } from '../model/types';

interface GeocodingResponse {
  lat: number;
  lon: number;
  local_names?: { ko?: string };
  name: string;
}

/**
 * 사용자가 입력한 검색어를 한국 행정구역으로 지오코딩 하는 훅
 * - OpenWeather `direct` 지오코딩을 호출해 한국(`,KR`)으로 제한함
 * - 첫 번째 결과만 사용하며, 없으면 `null`을 반환함
 */
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

/**
 * 좌표(위도/경도)를 한국어 지명으로 변환하는 함수 (Reverse Geocoding)
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string> {
  const results = await fetchWeatherApi<GeocodingResponse[]>(
    '/geo/1.0/reverse',
    { lat, lon, limit: 1 },
  );

  if (results.length === 0) return '알 수 없는 위치';

  return results[0].local_names?.ko ?? results[0].name;
}
