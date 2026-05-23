import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CityDto, CitySuggestionInput } from '../common/dto/city.dto';
import {
  GeolocationException,
  ValidationException,
} from '../common/exceptions';

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);
  private readonly API_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
  async suggestCities(input: CitySuggestionInput): Promise<CityDto[]> {
    if (!input.query || input.query.trim().length === 0) {
      throw new ValidationException('Query cannot be empty');
    }
    if (input.query.trim().length < 2) {
      throw new ValidationException('Query must be at least 2 characters long');
    }
    const limit = input.limit ?? 10;
    if (limit < 1 || limit > 100) {
      throw new ValidationException('Limit must be between 1 and 100');
    }
    try {
      const response = await axios.get(`${this.API_BASE_URL}/search`, {
        params: {
          name: input.query,
          count: limit,
          language: 'en',
          format: 'json',
        },
        timeout: 10000,
      });
      const results = (response.data as { results: CityDto[] }).results;
      if (!results || results.length === 0) {
        this.logger.debug(`No cities found for query: ${input.query}`);
        return [];
      }
      return results.map((result: CityDto) => ({
        id: `${result.id}`,
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country,
        admin1: result.admin1,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to fetch city suggestions: ${(error as Error).message}`,
      );
      throw new GeolocationException(
        'Failed to fetch city suggestions. Please try again.',
      );
    }
  }
}
