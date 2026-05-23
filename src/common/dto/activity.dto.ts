export enum ActivityType {
  SKIING = 'SKIING',
  SURFING = 'SURFING',
  INDOOR_SIGHTSEEING = 'INDOOR_SIGHTSEEING',
  OUTDOOR_SIGHTSEEING = 'OUTDOOR_SIGHTSEEING',
}

export class ActivityScore {
  activity: ActivityType;
  score: number;
  reason: string;
}

export class RankedActivities {
  activities: ActivityScore[];
  bestActivity: ActivityType;
}
