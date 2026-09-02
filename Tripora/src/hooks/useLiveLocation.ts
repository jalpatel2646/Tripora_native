import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

export function useLiveLocation() {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const startSharing = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location access needed to share live location.');
        return;
      }
      
      setIsSharing(true);
      setError(null);
      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (loc) => {
          // In a real application, send this coordinate via WebSocket/API 
          // console.log('Live location update:', loc.coords);
        }
      );
    } catch (err) {
      setError('Failed to start live tracking.');
      setIsSharing(false);
    }
  };

  const stopSharing = () => {
    setIsSharing(false);
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopSharing();
    };
  }, []);

  return { isSharing, startSharing, stopSharing, error };
}
