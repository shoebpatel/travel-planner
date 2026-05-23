export class CityDto {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export class CitySuggestionInput {
  query: string;
  limit?: number = 10;
}
