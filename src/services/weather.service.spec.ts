import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { ValidationException, WeatherException } from '../common/exceptions';

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data for valid coordinates', async () => {
      const result = await service.getWeather({
        latitude: 51.5074,
        longitude: -0.1278,
        cityName: 'London',
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('city', 'London');
      expect(result).toHaveProperty('latitude', 51.5074);
      expect(result).toHaveProperty('longitude', -0.1278);
      expect(result).toHaveProperty('weather');
      expect(result.weather).toHaveProperty('temperature');
      expect(result.weather).toHaveProperty('weatherCode');
      expect(result.weather).toHaveProperty('windSpeed');
      expect(result.weather).toHaveProperty('precipitation');
      expect(result.weather).toHaveProperty('isDay');
      expect(result.weather).toHaveProperty('description');
    });

    it('should throw ValidationException for invalid latitude > 90', async () => {
      await expect(
        service.getWeather({ latitude: 91, longitude: -0.1278, cityName: 'Invalid' }),
      ).rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid latitude < -90', async () => {
      await expect(
        service.getWeather({ latitude: -91, longitude: -0.1278, cityName: 'Invalid' }),
      ).rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid longitude > 180', async () => {
      await expect(
        service.getWeather({ latitude: 51.5074, longitude: 181, cityName: 'Invalid' }),
      ).rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid longitude < -180', async () => {
      await expect(
        service.getWeather({ latitude: 51.5074, longitude: -181, cityName: 'Invalid' }),
      ).rejects.toThrow(ValidationException);
    });

    it('should accept valid edge case coordinates', async () => {
      const result = await service.getWeather({
        latitude: 90,
        longitude: 180,
        cityName: 'Pole',
      });
      expect(result).toBeDefined();
      expect(result.weather).toBeDefined();
    });
  });
});
