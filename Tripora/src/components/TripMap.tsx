import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { locationService } from '../services/locationService';
import { TouchableOpacity } from 'react-native';

interface TripMapProps {
  route: any[];
  loading: boolean;
  coordinates: any[];
  onMarkerPress?: (stop: any) => void;
}

export default function TripMap({ route, loading, coordinates, onMarkerPress }: TripMapProps) {
  const mapRef = useRef<any>(null);
  const [hasLocationPermission, setHasLocationPermission] = React.useState(false);

  useEffect(() => {
    (async () => {
      const granted = await locationService.requestPermission();
      setHasLocationPermission(granted);
    })();
  }, []);

  useEffect(() => {
    if (coordinates.length > 0 && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 120, right: 50, bottom: 200, left: 50 },
          animated: true,
        });
      }, 500);
    }
  }, [coordinates.length]);

  const region = {
    latitude: coordinates.length > 0 ? coordinates[0].latitude : 22.0,
    longitude: coordinates.length > 0 ? coordinates[0].longitude : 75.0,
    latitudeDelta: 15,
    longitudeDelta: 15,
  };

  return (
    <>
      {loading && (
        <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.7)' }]}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={{ marginTop: 10, color: '#4B5563', fontWeight: '500' }}>Resolving locations...</Text>
        </View>
      )}
      <MapView
        ref={mapRef}
        style={styles.map} 
        initialRegion={region}
        mapType="standard"
        userInterfaceStyle="light"
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={false} // We will manually add a better styled button
      >
        {coordinates.length > 0 && (
          <Polyline 
            coordinates={coordinates}
            strokeColor="#7C3AED" 
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}
        
        {route.map((stop, index) => (
          <Marker 
            key={stop.id}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            onPress={() => onMarkerPress && onMarkerPress(stop)}
            pinColor="#7C3AED"
          />
        ))}
      </MapView>

      <TouchableOpacity 
        style={styles.locationButton}
        onPress={async () => {
          if (!hasLocationPermission) {
            const granted = await locationService.requestPermission();
            setHasLocationPermission(granted);
            if (!granted) return;
          }
          const loc = await locationService.getCurrentLocation();
          if (loc && mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: loc.latitude,
              longitude: loc.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }, 1000);
          }
        }}
      >
        <MaterialIcons name="my-location" size={24} color="#1F2937" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  locationButton: {
    position: 'absolute',
    right: 20,
    bottom: 230,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
  callout: {
    padding: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#7C3AED',
    marginBottom: 4
  },
  calloutText: {
    fontSize: 14,
    color: '#374151'
  },
  calloutSub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4
  }
});
