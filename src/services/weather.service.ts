import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  WeatherData,
  CityWeatherResponse,
  OpenMeteoWeatherResponse,
} from '../common/dto/weather.dto';
import { getWeatherDescription } from '../common/constants/weather-codes';
import { WeatherException, ValidationException } from '../common/exceptions';
import { CityWeatherInput } from 'src/graphql/schemas';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly API_BASE_URL = 'https://api.open-meteo.com/v1';

  async getWeather(inputs: CityWeatherInput): Promise<CityWeatherResponse> {
    const { cityName, latitude, longitude } = inputs;
    if (!cityName || cityName.trim().length === 0) {
      throw new ValidationException('City name cannot be empty');
    }
    this.validateCoordinates(latitude, longitude);
    try {
      const response = await axios.get(`${this.API_BASE_URL}/forecast`, {
        params: {
          latitude,
          longitude,
          current:
            'temperature_2m,weather_code,wind_speed_10m,precipitation,is_day',
          temperature_unit: 'celsius',
          wind_speed_unit: 'kmh',
          precipitation_unit: 'mm',
          timezone: 'auto',
        },
        timeout: 10000,
      });
      const current = (response.data as OpenMeteoWeatherResponse).current;
      const weatherData: WeatherData = {
        temperature: current.temperature_2m,
        weatherCode: current.weather_code,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation,
        isDay: current.is_day === 1,
        description: getWeatherDescription(current.weather_code),
      };
      return {
        city: cityName,
        latitude,
        longitude,
        weather: weatherData,
      };
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch weather data: ${(error as Error).message}`,
      );
      throw new WeatherException(
        'Failed to fetch weather data. Please try again.',
      );
    }
  }

  private validateCoordinates(latitude: number, longitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new ValidationException('Latitude must be between -90 and 90');
    }
    if (longitude < -180 || longitude > 180) {
      throw new ValidationException('Longitude must be between -180 and 180');
    }
  }
}
