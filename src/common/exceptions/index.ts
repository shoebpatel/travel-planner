export class GeolocationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeolocationException';
  }
}

export class WeatherException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherException';
  }
}

export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}
