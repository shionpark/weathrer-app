import { useNavigate } from 'react-router-dom';

import { geocodeLocation } from '@/entities/location/api/geocodingApi';
import type { LocationInfo } from '@/entities/location/model/types';
import { useLocationSearch } from '@/features/search-location/model/useLocationSearch';
import { SearchInput } from '@/features/search-location/ui/SearchInput';
import { SearchResultList } from '@/features/search-location/ui/SearchResultList';

export function LocationSearchBar() {
  const { query, setQuery, results } = useLocationSearch();
  const navigate = useNavigate();

  const handleSelect = async (location: LocationInfo) => {
    const searchTerm = location.sigungu ?? location.sido;
    const geo = await geocodeLocation(searchTerm);

    if (!geo) {
      alert('해당 장소의 정보가 제공되지 않습니다.');
      return;
    }

    setQuery('');
    navigate(
      `/detail?lat=${geo.lat}&lon=${geo.lon}&name=${encodeURIComponent(location.fullAddress)}`,
    );
  };

  return (
    <div className="relative">
      <SearchInput value={query} onChange={setQuery} />
      <SearchResultList results={results} onSelect={handleSelect} />
    </div>
  );
}
