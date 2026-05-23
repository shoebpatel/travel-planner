import { Resolver, Query, Args } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import {
  City,
  CitySuggestionInput,
  CityWeather,
  RankedActivities,
} from './schemas';
import { GeolocationService } from '../services/geolocation.service';
import { WeatherService } from '../services/weather.service';
import { ActivityRankingService } from '../services/activity-ranking.service';

@Resolver()
export class TravelResolver {
  private readonly logger = new Logger(TravelResolver.name);

  constructor(
    private geolocationService: GeolocationService,
    private weatherService: WeatherService,
    private activityRankingService: ActivityRankingService,
  ) {}

  @Query(() => [City])
  async suggestCities(
    @Args('input') input: CitySuggestionInput,
  ): Promise<City[]> {
    try {
      return await this.geolocationService.suggestCities(input);
    } catch (error) {
      this.logger.error(`Error suggesting cities: ${error.message}`);
      throw error;
    }
  }

  @Query(() => CityWeather)
  async getCityWeather(
    @Args('cityName') cityName: string,
    @Args('latitude', { type: () => Number }) latitude: number,
    @Args('longitude', { type: () => Number }) longitude: number,
  ): Promise<CityWeather> {
    try {
      return await this.weatherService.getWeather(
        latitude,
        longitude,
        cityName,
      );
    } catch (error) {
      this.logger.error(`Error fetching weather: ${error.message}`);
      throw error;
    }
  }

  @Query(() => RankedActivities)
  async rankActivitiesByWeather(
    @Args('cityName') cityName: string,
    @Args('latitude', { type: () => Number }) latitude: number,
    @Args('longitude', { type: () => Number }) longitude: number,
  ): Promise<RankedActivities> {
    try {
      const cityWeather = await this.weatherService.getWeather(
        latitude,
        longitude,
        cityName,
      );
      return this.activityRankingService.rankActivities(cityWeather.weather);
    } catch (error) {
      this.logger.error(`Error ranking activities: ${error.message}`);
      throw error;
    }
  }
}
