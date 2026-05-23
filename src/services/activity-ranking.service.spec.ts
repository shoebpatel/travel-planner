import { Test, TestingModule } from '@nestjs/testing';
import { ActivityRankingService } from './activity-ranking.service';
import { WeatherData } from '../common/dto/weather.dto';
import { ActivityType } from '../common/dto/activity.dto';

describe('ActivityRankingService', () => {
  let service: ActivityRankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityRankingService],
    }).compile();

    service = module.get<ActivityRankingService>(ActivityRankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('rankActivities', () => {
    it('should rank skiing as best activity in snowy, cold conditions', () => {
      const weather: WeatherData = {
        temperature: -5,
        weatherCode: 71, // Snow
        windSpeed: 10,
        precipitation: 5,
        isDay: true,
        description: 'Light snow',
      };

      const result = service.rankActivities(weather);
      expect(result).toBeDefined();
      expect(result.bestActivity).toBe(ActivityType.SKIING);
      expect(result.activities.length).toBe(4);
    });

    it('should rank surfing as best activity in high wind, rough sea conditions', () => {
      const weather: WeatherData = {
        temperature: 18,
        weatherCode: 82, // Violent rain showers
        windSpeed: 30,
        precipitation: 20,
        isDay: true,
        description: 'Violent rain showers',
      };

      const result = service.rankActivities(weather);
      expect(result).toBeDefined();
      expect(result.bestActivity).toBe(ActivityType.SURFING);
    });

    it('should rank indoor sightseeing as best activity in poor weather', () => {
      const weather: WeatherData = {
        temperature: 5,
        weatherCode: 65, // Heavy rain
        windSpeed: 25,
        precipitation: 30,
        isDay: false,
        description: 'Heavy rain',
      };

      const result = service.rankActivities(weather);
      expect(result).toBeDefined();
      expect(result.bestActivity).toBe(ActivityType.INDOOR_SIGHTSEEING);
    });

    it('should rank outdoor sightseeing as best activity in clear day', () => {
      const weather: WeatherData = {
        temperature: 22,
        weatherCode: 0, // Clear sky
        windSpeed: 8,
        precipitation: 0,
        isDay: true,
        description: 'Clear sky',
      };

      const result = service.rankActivities(weather);
      expect(result).toBeDefined();
      expect(result.bestActivity).toBe(ActivityType.OUTDOOR_SIGHTSEEING);
    });

    it('should return all activities with scores and reasons', () => {
      const weather: WeatherData = {
        temperature: 15,
        weatherCode: 2, // Partly cloudy
        windSpeed: 12,
        precipitation: 0,
        isDay: true,
        description: 'Partly cloudy',
      };

      const result = service.rankActivities(weather);
      expect(result.activities.length).toBe(4);
      result.activities.forEach((activity) => {
        expect(activity).toHaveProperty('activity');
        expect(activity).toHaveProperty('score');
        expect(activity).toHaveProperty('reason');
        expect(activity.score).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
