import { useQuery } from '@tanstack/react-query';

import { reverseGeocode } from '../api/geocodingApi';

export function useReverseGeocode(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ['reverseGeocode', lat, lon],
    queryFn: () => reverseGeocode(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: Infinity,
  });
}
