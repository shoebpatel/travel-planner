export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  precipitation: number;
  isDay: boolean;
  description: string;
}

export interface CityWeatherResponse {
  city: string;
  latitude: number;
  longitude: number;
  weather: WeatherData;
}
export interface OpenMeteoWeatherResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    precipitation: number;
    is_day: number;
  };
}
