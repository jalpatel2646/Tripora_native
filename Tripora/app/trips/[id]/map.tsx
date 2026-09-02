import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTripRoute } from '../../../src/hooks/useTripRoute';
import { calculateTotalDistance, calculateEstimatedTravelTime } from '../../../src/utils/distanceUtils';
import TripMap from '../../../src/components/TripMap';
import { MaterialIcons } from '@expo/vector-icons';
import { apiFetch } from '../../../src/services/api';
import { useTripStore } from '../../../src/store/tripStore';

export default function InteractiveRouteMapScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { activeTrips } = useTripStore();
  const trip = activeTrips[id as string];

  const [dbStops, setDbStops] = useState<any[]>([]);
  const [fetchingStops, setFetchingStops] = useState(true);
  const [selectedStop, setSelectedStop] = useState<any>(null);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const res = await apiFetch(`/api/trips/${id}/stops`);
        setDbStops(res.data || []);
      } catch (err) {
        console.warn('Failed to fetch stops:', err);
      } finally {
        setFetchingStops(false);
      }
    };
    fetchStops();
  }, [id]);

  const { route, loading } = useTripRoute(dbStops, trip?.destination || '');

  const coordinates = route.map((stop) => ({
    latitude: stop.latitude,
    longitude: stop.longitude,
  }));

  const totalDistance = calculateTotalDistance(coordinates);
  const estimatedTime = calculateEstimatedTravelTime(totalDistance);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Route Map</Text>
      </View>

      {fetchingStops || loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : (
        <TripMap 
          route={route} 
          loading={loading} 
          coordinates={coordinates} 
          onMarkerPress={(stop) => setSelectedStop(stop)} 
        />
      )}
      
      <View style={styles.bottomCard}>
        {selectedStop ? (
           <View>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.bottomTitle}>{selectedStop.name}</Text>
                <TouchableOpacity onPress={() => setSelectedStop(null)}>
                   <MaterialIcons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
             </View>
             <Text style={styles.bottomSubtitle}>{selectedStop.activities || 0} Activities Planned</Text>
             
             <TouchableOpacity 
               style={{ backgroundColor: '#7C3AED', padding: 16, borderRadius: 12, marginTop: 16, alignItems: 'center' }}
               onPress={() => router.push(`/trips/${id}/builder` as any)}
             >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>View Day Itinerary</Text>
             </TouchableOpacity>
           </View>
        ) : (
           <View>
             <Text style={styles.bottomTitle}>Route Details</Text>
             <Text style={styles.bottomSubtitle}>{route.length} Stops • ~{totalDistance} km • {estimatedTime}</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
                {route.map((s, idx) => (
                  <TouchableOpacity key={s.id} style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setSelectedStop(s)}>
                    <View style={styles.stopPill}>
                      <Text style={styles.stopName}>{s.name}</Text>
                    </View>
                    {idx !== route.length - 1 && (
                      <MaterialIcons name="arrow-right-alt" size={20} color="#9CA3AF" style={{ marginHorizontal: 4 }} />
                    )}
                  </TouchableOpacity>
                ))}
             </ScrollView>
           </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 12,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButton: {
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 12
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827'
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  bottomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827'
  },
  bottomSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  stopPill: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9D5FF'
  },
  stopName: {
    color: '#7C3AED',
    fontWeight: '600'
  }
});
