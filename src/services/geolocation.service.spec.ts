import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationService } from './geolocation.service';
import {
  ValidationException,
  GeolocationException,
} from '../common/exceptions';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeolocationService],
    }).compile();

    service = module.get<GeolocationService>(GeolocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('suggestCities', () => {
    it('should return cities for valid query', async () => {
      const input = { query: 'London', limit: 5 };
      const result = await service.suggestCities(input);
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('name');
        expect(result[0]).toHaveProperty('latitude');
        expect(result[0]).toHaveProperty('longitude');
      }
    });

    it('should throw ValidationException for empty query', async () => {
      const input = { query: '', limit: 10 };
      await expect(service.suggestCities(input)).rejects.toThrow(
        ValidationException,
      );
    });

    it('should throw ValidationException for query with less than 2 characters', async () => {
      const input = { query: 'a', limit: 10 };
      await expect(service.suggestCities(input)).rejects.toThrow(
        ValidationException,
      );
    });

    it('should throw ValidationException for limit > 100', async () => {
      const input = { query: 'London', limit: 150 };
      await expect(service.suggestCities(input)).rejects.toThrow(
        ValidationException,
      );
    });

    it('should throw ValidationException for limit < 1', async () => {
      const input = { query: 'London', limit: 0 };
      await expect(service.suggestCities(input)).rejects.toThrow(
        ValidationException,
      );
    });

    it('should use default limit of 10', async () => {
      const input = { query: 'Paris' };
      const result = await service.suggestCities(input);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
