import { Injectable, Logger } from '@nestjs/common';
import {
  ActivityType,
  ActivityScore,
  RankedActivities,
} from '../common/dto/activity.dto';
import { WeatherData } from '../common/dto/weather.dto';

@Injectable()
export class ActivityRankingService {
  private readonly logger = new Logger(ActivityRankingService.name);
  rankActivities(weather: WeatherData): RankedActivities {
    const scores = this.calculateActivityScores(weather);
    console.log(
      '🚀 ~ ActivityRankingService ~ rankActivities ~ scores:',
      scores,
    );
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    console.log(
      '🚀 ~ ActivityRankingService ~ rankActivities ~ sortedScores:',
      sortedScores,
    );
    const bestActivity = sortedScores[0].activity;
    return {
      activities: sortedScores,
      bestActivity,
    };
  }

  private calculateActivityScores(weather: WeatherData): ActivityScore[] {
    return [
      this.scoreSkiing(weather),
      this.scoreSurfing(weather),
      this.scoreIndoorSightseeing(weather),
      this.scoreOutdoorSightseeing(weather),
    ];
  }

  private scoreSkiing(weather: WeatherData): ActivityScore {
    let score = 0;
    const reasons: string[] = [];
    if (weather.temperature < 0) {
      score += 30;
      reasons.push('Temperature is ideal for skiing');
    } else if (weather.temperature < 5) {
      score += 15;
      reasons.push('Temperature is cool, suitable for skiing');
    }
    const snowCodes = [71, 73, 75, 77, 85, 86];
    if (snowCodes.includes(weather.weatherCode)) {
      score += 40;
      reasons.push('Snow conditions detected');
    } else if (weather.weatherCode <= 3 || weather.weatherCode === 45) {
      score += 10;
      reasons.push('Clear or overcast conditions');
    }
    // Wind considerations
    if (weather.windSpeed < 20) {
      score += 15;
      reasons.push('Wind conditions are favorable');
    } else {
      score -= 10;
      reasons.push('High wind speeds may affect conditions');
    }
    return {
      activity: ActivityType.SKIING,
      score: Math.max(0, score),
      reason: reasons.join('; ') || 'Mixed conditions for skiing',
    };
  }

  private scoreSurfing(weather: WeatherData): ActivityScore {
    let score = 0;
    const reasons: string[] = [];
    if (weather.windSpeed > 15 && weather.windSpeed < 40) {
      score += 35;
      reasons.push('Wind speed is ideal for surfing');
    } else if (weather.windSpeed >= 40) {
      score += 20;
      reasons.push('High wind speeds create waves');
    }
    if (weather.temperature >= 15 && weather.temperature <= 25) {
      score += 20;
      reasons.push('Temperature is comfortable for water activities');
    }
    const roughSeaCodes = [61, 63, 65, 80, 81, 82, 95, 96, 99];
    if (roughSeaCodes.includes(weather.weatherCode)) {
      score += 30;
      reasons.push('Rough sea conditions detected');
    } else if (weather.weatherCode <= 3) {
      score += 10;
      reasons.push('Clear conditions are good for visibility');
    }
    return {
      activity: ActivityType.SURFING,
      score: Math.max(0, score),
      reason: reasons.join('; ') || 'Mixed conditions for surfing',
    };
  }

  private scoreIndoorSightseeing(weather: WeatherData): ActivityScore {
    let score = 30;
    const reasons: string[] = ['Always suitable indoors'];
    const poorWeatherCodes = [
      45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 85, 86, 95, 96,
      99,
    ];
    if (poorWeatherCodes.includes(weather.weatherCode)) {
      score += 50;
      reasons.push('Poor weather makes indoor activities ideal');
    } else if (!weather.isDay) {
      score += 15;
      reasons.push('Night time is great for indoor attractions');
    }
    return {
      activity: ActivityType.INDOOR_SIGHTSEEING,
      score,
      reason: reasons.join('; '),
    };
  }

  private scoreOutdoorSightseeing(weather: WeatherData): ActivityScore {
    let score = 0;
    const reasons: string[] = [];
    if (weather.weatherCode === 0 || weather.weatherCode === 1) {
      score += 40;
      reasons.push('Clear skies are perfect for outdoor sightseeing');
    } else if (weather.weatherCode <= 3) {
      score += 20;
      reasons.push('Mostly clear weather');
    }
    if (weather.isDay) {
      score += 25;
      reasons.push('Daylight is ideal for outdoor activities');
    }
    if (weather.temperature >= 10 && weather.temperature <= 30) {
      score += 20;
      reasons.push('Temperature is comfortable');
    }
    if (weather.windSpeed < 15) {
      score += 15;
      reasons.push('Wind conditions are favorable');
    }
    return {
      activity: ActivityType.OUTDOOR_SIGHTSEEING,
      score: Math.max(0, score),
      reason: reasons.join('; ') || 'Mixed conditions for outdoor sightseeing',
    };
  }
}
