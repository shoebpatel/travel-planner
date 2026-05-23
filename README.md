# Travel Planner - GraphQL API

A scalable and maintainable GraphQL API built with NestJS for a travel planning application. The API provides dynamic city suggestions, weather forecasts, and activity recommendations based on real-time weather conditions.

## Features

- **Dynamic City Suggestions**: Search for cities with autocomplete functionality powered by Open-Meteo Geolocation API
- **Weather Forecasts**: Get current weather data for any city including temperature, wind speed, and weather conditions
- **Activity Ranking**: Intelligent activity recommendations based on weather conditions:
  - Skiing
  - Surfing
  - Indoor Sightseeing
  - Outdoor Sightseeing

## Architecture & Technical Decisions

```
User (GraphQL Client)
         ↓
  GraphQL Playground / Client
         ↓
  TravelResolver (Queries)
         ↓
  Services (Business Logic)
    ├─ GeolocationService
    ├─ WeatherService
    └─ ActivityRankingService
         ↓
  Open-Meteo APIs
    ├─ Geocoding API
    └─ Weather API
```

### Clean Architecture Approach

The project follows clean architecture principles with clear separation of concerns:

```
src/
├── common/                 # Shared utilities and constants
│   ├── dto/               # Data Transfer Objects
│   ├── exceptions/        # Custom exceptions
│   └── constants/         # Constants (WMO weather codes)
├── services/              # Business logic & external API integration
│   ├── geolocation.service.ts
│   ├── weather.service.ts
│   └── activity-ranking.service.ts
├── graphql/               # GraphQL layer
│   ├── schemas.ts         # GraphQL types and objects
│   └── travel.resolver.ts # Query resolvers
└── app.module.ts          # Main application module
```

### Key Design Decisions

1. **Service Layer Abstraction**: Business logic is isolated in services that can be tested independently, making the system maintainable and testable.

2. **GraphQL-First Design**: The schema is defined using NestJS GraphQL decorators, providing type safety and automatic schema generation.

3. **External API Integration**: Uses axios with error handling for reliable communication with Open-Meteo APIs. Requests include proper timeout configuration and validation.

4. **Activity Ranking Algorithm**: Uses a weighted scoring system based on:
   - Temperature ranges optimal for each activity
   - WMO weather codes to determine conditions
   - Wind speed and precipitation levels
   - Day/night visibility requirements

5. **Exception Handling**: Custom exception classes provide clear error context to clients.

6. **Input Validation**: All inputs are validated before processing.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

```bash
# Navigate to project directory
cd travel-planner

# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start

# The GraphQL API will be available at http://localhost:3000/graphql
```

### Running Tests

```bash
# Unit tests
npm run test

# Test in watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

## GraphQL API Usage

The GraphQL playground is available at `http://localhost:3000/graphql`

### Example Queries

#### 1. Suggest Cities

```graphql
query {
  suggestCities(input: { query: "Lon", limit: 5 }) {
    id
    name
    latitude
    longitude
    country
    admin1
  }
}
```

#### 2. Get Weather for a City

```graphql
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
```

#### 3. Rank Activities Based on Weather

```graphql
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
```

## Testing Strategy

### Unit Tests
- Service layer tests covering all business logic
- Mock external API calls to ensure reliability
- Edge case testing for coordinate validation
- Coverage target: >80%

### Integration Tests
- End-to-end GraphQL query testing
- Full workflow testing
- Error handling and validation testing

### Test Files
- `src/services/*.spec.ts` - Unit tests (21 tests)
- `test/app.e2e-spec.ts` - E2E GraphQL tests

## Use of AI Tools

This project was developed with assistance from AI tools (GitHub Copilot) for code generation, error resolution, test writing, and documentation. All AI-generated code was reviewed, tested, and modified to ensure alignment with project architecture and best practices.

## Dependencies

### Core
- `@nestjs/common`: NestJS framework
- `@nestjs/graphql`: GraphQL integration
- `@apollo/server`: Apollo GraphQL server
- `graphql`: GraphQL language implementation
- `axios`: HTTP client for API calls

### Development/Testing
- `@nestjs/testing`: NestJS testing utilities
- `jest`: JavaScript testing framework
- `supertest`: HTTP assertion library for E2E tests
