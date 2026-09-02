import { Activity } from '../data/mockData';

export class PlacesService {
  async searchNearbyPlaces(latitude: number, longitude: number, query: string = ''): Promise<Activity[]> {
    // In a production app, this would call Google Places API, Foursquare, etc.
    // Abstracted here to avoid hardcoding secrets.
    return [
      {
        id: `mock-place-${Date.now()}-1`,
        title: query ? `${query} Spot 1` : 'Local Cafe',
        type: 'Food',
        duration: '1h',
        cost: '15',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80',
        tags: ['popular', 'nearby'],
        latitude: latitude + 0.005,
        longitude: longitude + 0.005,
        description: 'A cozy spot near you.',
      } as any,
      {
        id: `mock-place-${Date.now()}-2`,
        title: query ? `${query} Spot 2` : 'City Museum',
        type: 'Sightseeing',
        duration: '3h',
        cost: '25',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1518998053401-a4149015c7e1?w=500&q=80',
        tags: ['culture', 'nearby'],
        latitude: latitude - 0.008,
        longitude: longitude + 0.01,
        description: 'Learn about the local history and culture.',
      } as any,
    ];
  }
}

export const placesService = new PlacesService();
