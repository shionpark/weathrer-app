import { useEffect, useRef, useState } from 'react';

import { searchDistricts } from '@/entities/location/lib/searchDistricts';
import type { LocationInfo } from '@/entities/location/model/types';

/**
 * 행정구역 검색어를 디바운스(300ms)해서 결과를 반환하는 훅
 * 입력이 비어 있으면 즉시 빈 배열을 돌려줌
 */
export function useLocationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationInfo[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(
      () => {
        setResults(query.trim() ? searchDistricts(query) : []);
      },
      query.trim() ? 300 : 0,
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  return { query, setQuery, results };
}
