import {
  ObjectType,
  Field,
  ID,
  Float,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';

@ObjectType()
export class City {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field()
  country: string;

  @Field({ nullable: true })
  admin1?: string;
}

@InputType()
export class CitySuggestionInput {
  @Field()
  query: string;

  @Field({ nullable: true, defaultValue: 10 })
  limit?: number;
}

@ObjectType()
export class Weather {
  @Field(() => Float)
  temperature: number;

  @Field()
  weatherCode: number;

  @Field(() => Float)
  windSpeed: number;

  @Field(() => Float)
  precipitation: number;

  @Field()
  isDay: boolean;

  @Field()
  description: string;
}

@ObjectType()
export class CityWeather {
  @Field()
  city: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => Weather)
  weather: Weather;
}

export enum ActivityType {
  SKIING = 'SKIING',
  SURFING = 'SURFING',
  INDOOR_SIGHTSEEING = 'INDOOR_SIGHTSEEING',
  OUTDOOR_SIGHTSEEING = 'OUTDOOR_SIGHTSEEING',
}

registerEnumType(ActivityType, {
  name: 'ActivityType',
  description: 'Types of activities ranked by weather conditions',
});

@ObjectType()
export class ActivityScore {
  @Field(() => ActivityType)
  activity: ActivityType;

  @Field(() => Float)
  score: number;

  @Field()
  reason: string;
}

@ObjectType()
export class RankedActivities {
  @Field(() => [ActivityScore])
  activities: ActivityScore[];

  @Field(() => ActivityType)
  bestActivity: ActivityType;
}
