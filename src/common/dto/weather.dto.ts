export class WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  precipitation: number;
  isDay: boolean;
  description: string;
}

export class CityWeatherResponse {
  city: string;
  latitude: number;
  longitude: number;
  weather: WeatherData;
}
