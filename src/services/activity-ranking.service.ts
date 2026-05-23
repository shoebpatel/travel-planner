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
    if (
      weather.temperature > 10 ||
      [61, 63, 65, 80, 81, 82].includes(weather.weatherCode)
    ) {
      return {
        activity: ActivityType.SKIING,
        score: 0,
        reason: 'Temperature too high or rain is ruining the snow packing',
      };
    }
    let score = 0;
    const reasons: string[] = [];
    if (weather.temperature < 0) {
      score += 30;
      reasons.push('Temperature is ideal for keeping snow crisp');
    } else if (weather.temperature < 5) {
      score += 15;
      reasons.push('Temperature is cool, suitable for skiing');
    }
    const snowCodes = [71, 73, 75, 77, 85, 86];
    if (snowCodes.includes(weather.weatherCode)) {
      score += 40;
      reasons.push('Fresh snow conditions detected');
    } else if (weather.weatherCode <= 3) {
      score += 10;
      reasons.push(
        'Clear, partly cloudy, or overcast conditions provide workable visibility',
      );
    } else if ([45, 48].includes(weather.weatherCode)) {
      score -= 10;
      reasons.push('Heavy fog detected; visibility reduced on slopes');
    }
    // Wind considerations
    if (weather.windSpeed < 20) {
      score += 15;
      reasons.push('Wind conditions are favorable');
    } else {
      score -= 20;
      reasons.push('High wind speeds may affect lift operations and windchill');
    }
    return {
      activity: ActivityType.SKIING,
      score: Math.max(0, score),
      reason: reasons.join('; ') || 'Mixed conditions for skiing',
    };
  }

  private scoreSurfing(weather: WeatherData): ActivityScore {
    if (
      [95, 96, 99].includes(weather.weatherCode) ||
      weather.temperature < 10
    ) {
      return {
        activity: ActivityType.SURFING,
        score: 0,
        reason:
          'Severe weather risk or extreme low temperatures make surfing hazardous',
      };
    }
    let score = 0;
    const reasons: string[] = [];
    if (weather.windSpeed > 10 && weather.windSpeed < 25) {
      score += 35;
      reasons.push('Wind speed is ideal for generating clean breaks');
    } else if (weather.windSpeed >= 25) {
      score -= 15;
      reasons.push(
        'Excessive wind speeds causing choppy, unsafe water conditions',
      );
    } else {
      score -= 20;
      reasons.push('Insufficient wind to generate surfable breaks');
    }
    if (weather.temperature >= 15 && weather.temperature <= 25) {
      score += 20;
      reasons.push('Air temperature is comfortable');
    }
    const rainCodes = [61, 63, 65, 80, 81, 82];
    if (rainCodes.includes(weather.weatherCode)) {
      score += 15;
      reasons.push('Rain present, but surf breaks remain manageable');
    } else if (weather.weatherCode <= 3) {
      score += 20;
      reasons.push(
        'Clear conditions are excellent for water safety and visibility',
      );
    }
    return {
      activity: ActivityType.SURFING,
      score: Math.max(0, score),
      reason: reasons.join('; ') || 'Mixed conditions for surfing',
    };
  }

  private scoreIndoorSightseeing(weather: WeatherData): ActivityScore {
    let score = 30;
    const reasons: string[] = [
      'Always reliable option regardless of conditions',
    ];
    const poorWeatherCodes = [
      45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 85, 86, 95, 96,
      99,
    ];
    if (poorWeatherCodes.includes(weather.weatherCode)) {
      score += 50;
      reasons.push('Inclement weather makes indoor venues highly preferable');
    } else if (!weather.isDay) {
      score += 30;
      reasons.push('Night time is ideal for indoor evening events and museums');
    }
    return {
      activity: ActivityType.INDOOR_SIGHTSEEING,
      score,
      reason: reasons.join('; '),
    };
  }

  private scoreOutdoorSightseeing(weather: WeatherData): ActivityScore {
    if (!weather.isDay) {
      return {
        activity: ActivityType.OUTDOOR_SIGHTSEEING,
        score: 0,
        reason: 'Cannot do outdoor sightseeing after dark',
      };
    }
    const severeCodes = [63, 65, 73, 75, 95, 96, 99];
    if (severeCodes.includes(weather.weatherCode)) {
      return {
        activity: ActivityType.OUTDOOR_SIGHTSEEING,
        score: 0,
        reason: 'Severe weather alert makes outdoor touring unsafe',
      };
    }
    let score = 0;
    const reasons: string[] = [];
    if (weather.weatherCode === 0 || weather.weatherCode === 1) {
      score += 45;
      reasons.push('Beautiful clear skies offer perfect scenic views');
    } else if (weather.weatherCode <= 3) {
      score += 25;
      reasons.push('Mostly fair weather conditions');
    }
    if (weather.temperature >= 15 && weather.temperature <= 28) {
      score += 25;
      reasons.push('Highly comfortable walking temperatures');
    } else if (weather.temperature > 28) {
      score -= 10;
      reasons.push('High temperatures might make walking tiring');
    }
    if (weather.windSpeed < 15) {
      score += 15;
      reasons.push('Calm wind conditions');
    }
    return {
      activity: ActivityType.OUTDOOR_SIGHTSEEING,
      score: Math.max(0, score),
      reason: reasons.join('; ') || 'Standard conditions for outdoor paths',
    };
  }
}
