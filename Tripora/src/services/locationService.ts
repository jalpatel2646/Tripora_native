import * as Location from 'expo-location';

export interface LocationResult {
  latitude: number;
  longitude: number;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  name?: string | null;
}

class LocationService {
  /**
   * Request foreground location permission.
   */
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  /**
   * Get formatting name of a place from coordinates using reverse geocoding.
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<Location.LocationGeocodedAddress | null> {
    try {
      const result = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result && result.length > 0) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Get coordinates from address/city name.
   */
  async geocode(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const result = await Location.geocodeAsync(address);
      if (result && result.length > 0) {
        return { latitude: result[0].latitude, longitude: result[0].longitude };
      }
      return null;
    } catch (error) {
      console.error('Error in geocoding:', error);
      return null;
    }
  }

  /**
   * Get current location (optimized with last known).
   */
  async getCurrentLocation(): Promise<LocationResult | null> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return null;

    try {
      // First try to get last known position for speed
      let location = await Location.getLastKnownPositionAsync({});
      
      // If not available, get fresh
      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }
      
      if (!location) return null;
      
      const { latitude, longitude } = location.coords;
      const geocodeResult = await this.reverseGeocode(latitude, longitude);
      
      return {
        latitude,
        longitude,
        city: geocodeResult?.city || null,
        region: geocodeResult?.region || null,
        country: geocodeResult?.country || null,
        name: geocodeResult?.name || null,
      };
    } catch (error) {
      console.error('Error fetching current location:', error);
      return null;
    }
  }
}

export const locationService = new LocationService();
