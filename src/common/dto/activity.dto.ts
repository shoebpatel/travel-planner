export enum ActivityType {
  SKIING = 'SKIING',
  SURFING = 'SURFING',
  INDOOR_SIGHTSEEING = 'INDOOR_SIGHTSEEING',
  OUTDOOR_SIGHTSEEING = 'OUTDOOR_SIGHTSEEING',
}

export interface ActivityScore {
  activity: ActivityType;
  score: number;
  reason: string;
}

export interface RankedActivities {
  activities: ActivityScore[];
  bestActivity: ActivityType;
}
