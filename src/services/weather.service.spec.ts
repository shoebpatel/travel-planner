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
      const result = await service.getWeather(51.5074, -0.1278, 'London');
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
      await expect(service.getWeather(91, -0.1278, 'Invalid')).rejects.toThrow(
        ValidationException,
      );
    });

    it('should throw ValidationException for invalid latitude < -90', async () => {
      await expect(service.getWeather(-91, -0.1278, 'Invalid')).rejects.toThrow(
        ValidationException,
      );
    });

    it('should throw ValidationException for invalid longitude > 180', async () => {
      await expect(service.getWeather(51.5074, 181, 'Invalid')).rejects.toThrow(
        ValidationException,
      );
    });

    it('should throw ValidationException for invalid longitude < -180', async () => {
      await expect(
        service.getWeather(51.5074, -181, 'Invalid'),
      ).rejects.toThrow(ValidationException);
    });

    it('should accept valid edge case coordinates', async () => {
      const result = await service.getWeather(90, 180, 'Pole');
      expect(result).toBeDefined();
      expect(result.weather).toBeDefined();
    });
  });
});
