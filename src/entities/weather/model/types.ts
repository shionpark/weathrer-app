export interface CurrentWeather {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  name: string;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  icon: string;
}

export interface DailyWeather {
  tempMin: number;
  tempMax: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyWeather;
  hourly: HourlyWeather[];
}
