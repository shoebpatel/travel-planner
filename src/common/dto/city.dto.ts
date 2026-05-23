export interface CityDto {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CitySuggestionInput {
  query: string;
  limit?: number;
}
