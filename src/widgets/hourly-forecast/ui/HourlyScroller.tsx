import type { HourlyWeather } from '@/entities/weather/model/types';
import { formatTemp } from '@/shared/lib/formatters';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface HourlyScrollerProps {
  title?: string;
  hourly: HourlyWeather[];
  isLoading?: boolean;
}

export function HourlyScroller({
  title = '시간대별 예보',
  hourly,
  isLoading = false,
}: HourlyScrollerProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500">24h</span>
      </div>

      {isLoading && (
        <div className="flex h-32 items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && hourly.length === 0 && (
        <div className="text-center text-gray-500">예보 데이터가 없습니다.</div>
      )}

      {!isLoading && hourly.length > 0 && (
        <div className="scroll-hide flex gap-4 overflow-x-auto pb-2 min-w-0">
          {hourly.map((item) => (
            <div
              key={item.time}
              className="min-w-[88px] rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center shadow-sm"
            >
              <p className="text-xs font-medium text-gray-500">{item.time}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                alt=""
                className="mx-auto h-10 w-10"
              />
              <p className="text-sm font-semibold text-gray-900">
                {formatTemp(item.temp)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
