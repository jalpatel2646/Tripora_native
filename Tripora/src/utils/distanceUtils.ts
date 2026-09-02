// utility for calculating haversine distance
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); 
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return Math.round(d);
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

export function calculateTotalDistance(route: { latitude: number; longitude: number }[]): number {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += getDistance(
      route[i].latitude, 
      route[i].longitude, 
      route[i+1].latitude, 
      route[i+1].longitude
    );
  }
  return total;
}

export function calculateEstimatedTravelTime(distanceKm: number): string {
  if (distanceKm === 0) return '0m';
  // Fallback estimation: Assume average travel speed of 60 km/h (1 km/min)
  const hours = Math.floor(distanceKm / 60);
  const minutes = Math.round(distanceKm % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
