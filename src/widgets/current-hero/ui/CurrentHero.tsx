import type { CurrentWeather, DailyWeather } from '@/entities/weather/model/types';
import { formatTemp } from '@/shared/lib/formatters';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface CurrentHeroProps {
  current?: CurrentWeather;
  daily?: DailyWeather;
  locationName?: string;
  isLoading?: boolean;
}

export function CurrentHero({
  current,
  daily,
  locationName = '현재 위치',
  isLoading = false,
}: CurrentHeroProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && current && (
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {locationName}
              </h2>
              <p className="text-sm text-gray-500">{current.description}</p>
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
              alt={current.description}
              className="h-16 w-16"
            />
          </div>

          <div>
            <p className="text-6xl font-bold text-gray-900">
              {formatTemp(current.temp)}
              {daily && (
                <span className="ml-3 align-middle text-xl font-semibold text-gray-400">
                  ↓ {formatTemp(daily.tempMin)} / ↑ {formatTemp(daily.tempMax)}
                </span>
              )}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              습도 {current.humidity}% · 풍속 {current.windSpeed} m/s
            </p>
          </div>
        </div>
      )}

      {!isLoading && !current && (
        <div className="flex h-64 items-center justify-center text-gray-500">
          날씨 데이터를 불러오지 못했습니다.
        </div>
      )}
    </div>
  );
}
