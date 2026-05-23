import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GeolocationService } from './services/geolocation.service';
import { WeatherService } from './services/weather.service';
import { ActivityRankingService } from './services/activity-ranking.service';
import { TravelResolver } from './graphql/travel.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      debug: true,
      sortSchema: true,
    }),
  ],
  providers: [
    TravelResolver,
    GeolocationService,
    WeatherService,
    ActivityRankingService,
  ],
})
export class AppModule {}
