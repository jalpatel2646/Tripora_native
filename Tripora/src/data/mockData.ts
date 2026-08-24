export type Tag = string;

export interface Activity {
  id: string;
  title: string;
  type: string;
  duration: string;
  cost: string;
  rating: number;
  image: string;
  tags: Tag[];
}

export interface CityStop {
  id: string;
  city: string;
  days: number;
  activities: Activity[];
}

export const MOCK_CITIES_EXTENDED: any[] = [];
export const MOCK_ACTIVITIES: Activity[] = [];
export const MOCK_ITINERARY_STOPS: CityStop[] = [];
