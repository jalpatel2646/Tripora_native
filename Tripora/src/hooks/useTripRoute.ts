import { useState, useEffect, useRef } from 'react';
import { locationService } from '../services/locationService';
import { CityStop } from '../data/mockData';

export interface RouteStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  activities: number;
}

const coordinateCache: Record<string, { latitude: number; longitude: number }> = {};

export function useTripRoute(dbStops: any[], fallbackDestination: string) {
  const [route, setRoute] = useState<RouteStop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const resolveRoute = async () => {
      setLoading(true);
      const resolved: RouteStop[] = [];
      
      const stopsToProcess = dbStops && dbStops.length > 0 
        ? dbStops 
        : (fallbackDestination ? [{ _id: 'fallback', city: fallbackDestination, activities: [] }] : []);

      for (const stop of stopsToProcess) {
        // DB stops might already have latitude / longitude resolved if saved
        if (stop.latitude && stop.longitude) {
           resolved.push({
             id: stop._id || stop.id,
             name: stop.city,
             latitude: stop.latitude,
             longitude: stop.longitude,
             activities: stop.activities?.length || 0,
           });
           continue;
        }

        let coords = coordinateCache[stop.city?.toLowerCase()];
        
        if (!coords && stop.city) {
          const result = await locationService.geocode(stop.city);
          if (result) {
            coords = result;
            coordinateCache[stop.city.toLowerCase()] = coords; // Cache it
          }
        }
        
        if (coords) {
          resolved.push({
            id: stop._id || stop.id,
            name: stop.city,
            latitude: coords.latitude,
            longitude: coords.longitude,
            activities: stop.activities?.length || 0,
          });
        }
      }
      
      if (isMounted) {
        setRoute(resolved);
        setLoading(false);
      }
    };
    
    if (dbStops) {
      resolveRoute();
    }
    
    return () => { isMounted = false; };
  }, [dbStops, fallbackDestination]);

  return { route, loading };
}
