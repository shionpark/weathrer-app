import type { LocationInfo } from '@/entities/location/model/types';

interface SearchResultListProps {
  results: LocationInfo[];
  onSelect: (location: LocationInfo) => void;
  query: string;
}

export function SearchResultList({
  results,
  onSelect,
  query,
}: SearchResultListProps) {
  if (!query.trim()) return null;

  if (results.length === 0) {
    return (
      <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 text-center text-gray-500 shadow-lg">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
      {results.map((item) => (
        <li key={item.fullAddress}>
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="w-full px-4 py-2 text-left hover:bg-blue-50"
          >
            <span className="font-medium">{item.sigungu ?? item.sido}</span>
            {item.dong && <span className="text-gray-500"> {item.dong}</span>}
            <span className="block text-xs text-gray-400">{item.sido}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
