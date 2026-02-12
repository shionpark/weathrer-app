import { useEffect, useRef, useState } from 'react';

interface GeolocationState {
  lat: number | null;
  lon: number | null;
  error: string | null;
  loading: boolean;
}

/**
 * 브라우저의 Geolocation API로 현재 위도/경도를 가져오는 훅
 * - geolocation 미지원 브라우저는 초기 상태에서 에러 설정 및 로딩 종료
 * - StrictMode의 이중 호출을 피하기 위해 최초 1회만 getCurrentPosition 요청
 * - 성공 시 lat/lon 저장, 실패 시 에러 메시지 저장 후 로딩 종료
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>(() => {
    if (!navigator.geolocation) {
      return {
        lat: null,
        lon: null,
        error: '이 브라우저에서는 위치 서비스를 지원하지 않습니다.',
        loading: false,
      };
    }
    return { lat: null, lon: null, error: null, loading: true };
  });

  const called = useRef(false);

  useEffect(() => {
    if (called.current || !navigator.geolocation) return;
    called.current = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        setState({
          lat: null,
          lon: null,
          error: err.message,
          loading: false,
        });
      },
    );
  }, []);

  return state;
}
