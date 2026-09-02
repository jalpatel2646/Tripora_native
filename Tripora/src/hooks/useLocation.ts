import { useState, useCallback } from 'react';
import { locationService, LocationResult } from '../services/locationService';

export function useLocation() {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    try {
      const hasPermission = await locationService.requestPermission();
      if (!hasPermission) {
        setPermissionDenied(true);
        setError('Location permission denied.');
        setLoading(false);
        return null;
      }

      const result = await locationService.getCurrentLocation();
      if (result) {
        setLocation(result);
      } else {
        setError('Could not fetch location.');
      }
      setLoading(false);
      return result;
    } catch (e) {
      setError('An error occurred while fetching location.');
      setLoading(false);
      return null;
    }
  }, []);

  return {
    location,
    loading,
    error,
    permissionDenied,
    fetchLocation,
  };
}
