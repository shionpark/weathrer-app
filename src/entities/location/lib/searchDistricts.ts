import districts from '@/data/korea_districts.json';

import type { LocationInfo } from '../model/types';

const MAX_RESULTS = 20;

/**
 * 행정구역 전체 목록에서 사용자가 입력한 검색어가 포함된 항목을 찾는 함수 (최대 20건)
 */
export function searchDistricts(query: string): LocationInfo[] {
  if (!query.trim()) return [];

  return districts
    .filter((item: string) => item.includes(query))
    .slice(0, MAX_RESULTS)
    .map(parseDistrict);
}

function parseDistrict(fullAddress: string): LocationInfo {
  const parts = fullAddress.split('-');
  return {
    fullAddress,
    sido: parts[0],
    sigungu: parts[1],
    dong: parts[2],
  };
}
