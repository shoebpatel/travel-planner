import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController],
  providers: [
    AppService,
    GeolocationService,
    WeatherService,
    ActivityRankingService,
    TravelResolver,
  ],
})
export class AppModule {}
