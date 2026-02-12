import {
  OPENWEATHER_API_KEY,
  OPENWEATHER_BASE_URL,
} from '@/shared/config/constants';

export async function fetchWeatherApi(lat: number, lon: number) {
  const url = `${OPENWEATHER_BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status}`);
  }
  return res.json();
}
