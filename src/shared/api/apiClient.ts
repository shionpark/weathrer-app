import {
  OPENWEATHER_API_KEY,
  OPENWEATHER_BASE_URL,
} from '@/shared/config/constants';

/**
 * OpenWeather API 요청 공통 함수
 * - 기본으로 API 키, 섭씨 단위(`units=metric`), 한국어(`lang=kr`)를 쿼리에 붙임
 * - 추가 파라미터는 `params` 객체로 전달하며 문자열로 직렬화
 * - 응답이 2xx가 아니면 에러를 던지고, 성공 시 JSON을 제네릭 타입 `T`로 반환
 */
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
