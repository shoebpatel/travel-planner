import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Travel Planner GraphQL API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const graphqlQuery = (query: string, variables?: any) => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables });
  };

  describe('City Suggestions', () => {
    it('should suggest cities based on partial input', async () => {
      const query = `
        query {
          suggestCities(input: { query: "Lon", limit: 5 }) {
            id
            name
            latitude
            longitude
            country
          }
        }
      `;

      const response = await graphqlQuery(query);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('suggestCities');
      expect(Array.isArray(response.body.data.suggestCities)).toBe(true);
    });

    it('should return error for empty query', async () => {
      const query = `
        query {
          suggestCities(input: { query: "" }) {
            name
          }
        }
      `;

      const response = await graphqlQuery(query);
      expect(response.body).toHaveProperty('errors');
    });

    it('should suggest multiple cities', async () => {
      const query = `
        query {
          suggestCities(input: { query: "Paris", limit: 10 }) {
            id
            name
            country
          }
        }
      `;

      const response = await graphqlQuery(query);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.suggestCities)).toBe(true);
    });
  });

  describe('Weather Forecast', () => {
    it('should fetch weather for a specific location', async () => {
      const query = `
        query {
          getCityWeather(cityName: "London", latitude: 51.5074, longitude: -0.1278) {
            city
            latitude
            longitude
            weather {
              temperature
              weatherCode
              windSpeed
              precipitation
              isDay
              description
            }
          }
        }
      `;

      const response = await graphqlQuery(query);
      expect(response.status).toBe(200);
      expect(response.body.data.getCityWeather).toHaveProperty('city', 'London');
      expect(response.body.data.getCityWeather.weather).toHaveProperty('temperature');
      expect(response.body.data.getCityWeather.weather).toHaveProperty('description');
    });

    it('should return error for invalid latitude', async () => {
      const query = `
        query {
          getCityWeather(cityName: "Invalid", latitude: 100, longitude: -0.1278) {
            city
          }
        }
      `;

      const response = await graphqlQuery(query);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return error for invalid longitude', async () => {
      const query = `
        query {
          getCityWeather(cityName: "Invalid", latitude: 51.5074, longitude: 200) {
            city
          }
        }
      `;

      const response = await graphqlQuery(query);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('Activity Ranking', () => {
    it('should rank activities based on weather', async () => {
      const query = `
        query {
          rankActivitiesByWeather(cityName: "London", latitude: 51.5074, longitude: -0.1278) {
            bestActivity
            activities {
              activity
              score
              reason
            }
          }
        }
      `;

      const response = await graphqlQuery(query);
      expect(response.status).toBe(200);
      expect(response.body.data.rankActivitiesByWeather).toHaveProperty('bestActivity');
      expect(Array.isArray(response.body.data.rankActivitiesByWeather.activities)).toBe(true);
      expect(response.body.data.rankActivitiesByWeather.activities.length).toBe(4);

      response.body.data.rankActivitiesByWeather.activities.forEach((activity: any) => {
        expect(['SKIING', 'SURFING', 'INDOOR_SIGHTSEEING', 'OUTDOOR_SIGHTSEEING']).toContain(
          activity.activity,
        );
        expect(activity.score).toBeGreaterThanOrEqual(0);
        expect(activity.reason).toBeTruthy();
      });
    });

    it('should return all four activity types', async () => {
      const query = `
        query {
          rankActivitiesByWeather(cityName: "Paris", latitude: 48.8566, longitude: 2.3522) {
            activities {
              activity
            }
          }
        }
      `;

      const response = await graphqlQuery(query);
      const activities = response.body.data.rankActivitiesByWeather.activities.map(
        (a: any) => a.activity,
      );
      expect(activities).toContain('SKIING');
      expect(activities).toContain('SURFING');
      expect(activities).toContain('INDOOR_SIGHTSEEING');
      expect(activities).toContain('OUTDOOR_SIGHTSEEING');
    });
  });

  describe('Integration Tests', () => {
    it('should perform full workflow: suggest city -> get weather -> rank activities', async () => {
      // Step 1: Suggest cities
      const suggestQuery = `
        query {
          suggestCities(input: { query: "Tokyo", limit: 1 }) {
            name
            latitude
            longitude
          }
        }
      `;

      const suggestResponse = await graphqlQuery(suggestQuery);
      expect(suggestResponse.status).toBe(200);
      const city = suggestResponse.body.data.suggestCities[0];

      // Step 2: Get weather for suggested city
      const weatherQuery = `
        query {
          getCityWeather(cityName: "${city.name}", latitude: ${city.latitude}, longitude: ${city.longitude}) {
            city
            weather {
              temperature
              description
            }
          }
        }
      `;

      const weatherResponse = await graphqlQuery(weatherQuery);
      expect(weatherResponse.status).toBe(200);
      expect(weatherResponse.body.data.getCityWeather.city).toBe(city.name);

      // Step 3: Rank activities
      const rankQuery = `
        query {
          rankActivitiesByWeather(cityName: "${city.name}", latitude: ${city.latitude}, longitude: ${city.longitude}) {
            bestActivity
            activities {
              activity
              score
            }
          }
        }
      `;

      const rankResponse = await graphqlQuery(rankQuery);
      expect(rankResponse.status).toBe(200);
      expect(rankResponse.body.data.rankActivitiesByWeather.bestActivity).toBeTruthy();
      expect(rankResponse.body.data.rankActivitiesByWeather.activities.length).toBe(4);
    });
  });
});
