import { apiFetch } from './api';

export class PlacesService {
  async searchNearbyPlaces(latitude: number, longitude: number, query: string = ''): Promise<any[]> {
    try {
      const res = await apiFetch(`/api/activities/search?q=${encodeURIComponent(query)}&lat=${latitude}&lng=${longitude}`);
      return res.data || [];
    } catch (e) {
      console.warn("Places api error:", e);
      return [];
    }
  }
}

export const placesService = new PlacesService();
