import { Resolver, Query, Args } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import {
  City,
  CitySuggestionInput,
  CityWeather,
  CityWeatherInput,
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
    @Args('input') inputs: CitySuggestionInput,
  ): Promise<City[]> {
    try {
      return await this.geolocationService.suggestCities(inputs);
    } catch (error) {
      this.logger.error(`Error suggesting cities: ${(error as Error).message}`);
      throw error;
    }
  }

  @Query(() => CityWeather)
  async getCityWeather(
    @Args('input') inputs: CityWeatherInput,
  ): Promise<CityWeather> {
    try {
      return await this.weatherService.getWeather(inputs);
    } catch (error) {
      this.logger.error(`Error fetching weather: ${(error as Error).message}`);
      throw error;
    }
  }

  @Query(() => RankedActivities)
  async rankActivitiesByWeather(
    @Args('input') inputs: CityWeatherInput,
  ): Promise<RankedActivities> {
    try {
      const cityWeather = await this.weatherService.getWeather(inputs);
      console.log(
        '🚀 ~ TravelResolver ~ rankActivitiesByWeather ~ cityWeather:',
        cityWeather,
      );
      return this.activityRankingService.rankActivities(cityWeather.weather);
    } catch (error) {
      this.logger.error(
        `Error ranking activities: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
