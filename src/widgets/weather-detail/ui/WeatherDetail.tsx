import type {
  CurrentWeather,
  DailyWeather,
  HourlyWeather,
} from '@/entities/weather/model/types';
import { formatTemp } from '@/shared/lib/formatters';

interface WeatherDetailProps {
  current: CurrentWeather;
  daily: DailyWeather;
  hourly: HourlyWeather[];
  locationName: string;
}

export function WeatherDetail({
  current,
  daily,
  hourly,
  locationName,
}: WeatherDetailProps) {
  return (
    <div className="space-y-6">
      {/* 현재 날씨 */}
      <div className="text-center">
        <h2 className="text-lg text-gray-500">{locationName}</h2>
        <img
          src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
          alt={current.description}
          className="mx-auto h-20 w-20"
        />
        <p className="text-5xl font-bold">{formatTemp(current.temp)}</p>
        <p className="text-gray-500">{current.description}</p>
        <p className="text-sm text-gray-400">
          최고 {formatTemp(daily.tempMax)} / 최저 {formatTemp(daily.tempMin)}
        </p>
      </div>

      {/* 시간대별 기온 */}
      {hourly.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            시간대별 날씨
          </h3>
          <div className="flex gap-4 overflow-x-auto py-2">
            {hourly.map((item) => (
              <div key={item.time} className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{item.time}</span>
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                  alt=""
                  className="h-8 w-8"
                />
                <span className="text-sm font-medium">
                  {formatTemp(item.temp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
