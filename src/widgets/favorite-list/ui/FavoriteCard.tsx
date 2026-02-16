import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { Favorite } from '@/entities/favorite/model/types';
import {
  useCurrentWeather,
  useForecast,
} from '@/entities/weather/model/useWeather';
import { formatTemp } from '@/shared/lib/formatters';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Modal } from '@/shared/ui/Modal';

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (id: string) => void;
  onEditAlias: (id: string, alias: string) => void;
  onSelect?: (id: string, name: string, lat: number, lon: number) => void;
}

export function FavoriteCard({
  favorite,
  onRemove,
  onEditAlias,
  onSelect,
}: FavoriteCardProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [aliasInput, setAliasInput] = useState(favorite.alias);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const { data: current, isLoading } = useCurrentWeather(
    favorite.lat,
    favorite.lon,
  );
  const { data: forecast } = useForecast(favorite.lat, favorite.lon);

  const handleClick = () => {
    if (onSelect) {
      onSelect(favorite.id, favorite.name, favorite.lat, favorite.lon);
    } else {
      navigate(
        `/detail?lat=${favorite.lat}&lon=${favorite.lon}&name=${encodeURIComponent(favorite.name)}`,
      );
    }
  };

  const handleEditOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAliasInput(favorite.alias);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    const trimmed = aliasInput.trim();
    if (!trimmed) {
      toast.error('별칭을 입력해 주세요.');
      return;
    }
    onEditAlias(favorite.id, trimmed);
    toast.success('별칭이 수정되었습니다');
    setIsEditing(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmDelete(true);
  };

  const displayAlias = favorite.alias.replace(/-/g, ' ');
  const displayName = favorite.name.replace(/-/g, ' ');

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-white p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (!current || !forecast) return null;

  return (
    <>
      <div
        onClick={handleClick}
        className="min-w-[160px] cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-lg"
      >
        <div className="mb-3 flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold">{displayAlias}</h3>
            <p className="truncate text-xs text-gray-500">{displayName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={`https://openweathermap.org/img/wn/${current.icon}.png`}
            alt={current.description}
            className="h-12 w-12"
          />
          <div>
            <p className="text-2xl font-bold">{formatTemp(current.temp)}</p>
            <p className="text-xs text-gray-500">
              {formatTemp(forecast.daily.tempMax)} /{' '}
              {formatTemp(forecast.daily.tempMin)}
            </p>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-end gap-2 text-sm text-gray-500">
          <button
            onClick={handleEditOpen}
            aria-label="별칭 수정"
            className="flex items-center gap-1 rounded-md px-2 py-1 transition hover:bg-gray-100 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-.793.793-2.828-2.828.793-.793Z" />
              <path d="M11.793 5.379 4.5 12.672V15.5h2.828l7.293-7.293-2.828-2.828Z" />
            </svg>
          </button>
          <button
            onClick={handleRemove}
            aria-label="즐겨찾기 삭제"
            className="flex items-center gap-1 rounded-md px-2 py-1 transition hover:bg-gray-100 hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M8.5 3a1.5 1.5 0 0 0-1.415 1H5a.75.75 0 0 0 0 1.5h10a.75.75 0 0 0 0-1.5h-2.085A1.5 1.5 0 0 0 10.5 3h-2Zm-2 4.75a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75ZM10 7.75a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6A.75.75 0 0 1 10 7.75Zm3.25 0a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <Modal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        title="별칭 수정"
        description="즐겨찾기 카드에 표시할 이름을 입력하세요."
      >
        <input
          value={aliasInput}
          onChange={(e) => setAliasInput(e.target.value)}
          className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleEditSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1 focus-visible:outline-none"
          >
            저장
          </button>
        </div>
      </Modal>

      <Modal
        open={isConfirmDelete}
        onClose={() => setIsConfirmDelete(false)}
        title="삭제하시겠습니까?"
        description="이 즐겨찾기를 삭제해도 날씨 데이터에는 영향을 주지 않습니다."
      >
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setIsConfirmDelete(false)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={() => {
              onRemove(favorite.id);
              toast.success('즐겨찾기에서 삭제되었습니다');
              setIsConfirmDelete(false);
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-1 focus-visible:outline-none"
          >
            삭제
          </button>
        </div>
      </Modal>
    </>
  );
}
