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
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;

  @Field(() => String)
  country!: string;

  @Field(() => String, { nullable: true })
  admin1?: string;
}

@InputType()
export class CitySuggestionInput {
  @Field(() => String)
  query!: string;

  @Field(() => Number, { nullable: true, defaultValue: 10 })
  limit?: number;
}

@ObjectType()
export class Weather {
  @Field(() => Float)
  temperature!: number;

  @Field(() => Number)
  weatherCode!: number;

  @Field(() => Float)
  windSpeed!: number;

  @Field(() => Float)
  precipitation!: number;

  @Field(() => Boolean)
  isDay!: boolean;

  @Field(() => String)
  description!: string;
}

@ObjectType()
export class CityWeather {
  @Field(() => String)
  city!: string;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;

  @Field(() => Weather)
  weather!: Weather;
}

@InputType()
export class CityWeatherInput {
  @Field(() => String)
  cityName!: string;

  @Field(() => Number)
  latitude!: number;

  @Field(() => Number)
  longitude!: number;
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
  activity!: ActivityType;

  @Field(() => Float)
  score!: number;

  @Field()
  reason!: string;
}

@ObjectType()
export class RankedActivities {
  @Field(() => ActivityType)
  bestActivity!: ActivityType;

  @Field(() => [ActivityScore])
  activities!: ActivityScore[];
}
