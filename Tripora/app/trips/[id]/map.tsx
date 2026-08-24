import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

let MapView: any, Marker: any, Polyline: any, Callout: any;
if (Platform.OS !== 'web') {
  const Maps = require('react-' + 'native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
  Callout = Maps.Callout;
}
import { MaterialIcons } from '@expo/vector-icons';

const MOCK_ROUTE: any[] = [];

export default function InteractiveRouteMapScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const coordinates = MOCK_ROUTE.map((stop) => ({
    latitude: stop.latitude,
    longitude: stop.longitude,
  }));

  const region = {
    latitude: 22.0,
    longitude: 75.0,
    latitudeDelta: 15,
    longitudeDelta: 15,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Route Map</Text>
      </View>

      {Platform.OS === 'web' ? (
        <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }]}>
          <MaterialIcons name="map" size={48} color="#9CA3AF" />
          <Text style={{ color: '#6B7280', fontSize: 16, marginTop: 12 }}>Interactive map is available only on mobile devices.</Text>
        </View>
      ) : (
        <MapView 
          style={styles.map} 
          initialRegion={region}
          mapType="standard"
          userInterfaceStyle="light"
        >
          <Polyline 
            coordinates={coordinates}
            strokeColor="#7C3AED" 
            strokeWidth={4}
            lineDashPattern={[1]}
          />
          
          {MOCK_ROUTE.map((stop, index) => (
            <Marker 
              key={stop.id}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              title={stop.name}
              description={`${stop.activities} Activities Planned`}
              pinColor="#7C3AED"
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{stop.name}</Text>
                  <Text style={styles.calloutText}>{stop.activities} Activities</Text>
                  <Text style={styles.calloutSub}>Stop {index + 1}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
      
      <View style={styles.bottomCard}>
        <Text style={styles.bottomTitle}>Route Details</Text>
        <Text style={styles.bottomSubtitle}>{MOCK_ROUTE.length} Stops • ~2000 km</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
           {MOCK_ROUTE.map((s, idx) => (
             <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
               <View style={styles.stopPill}>
                 <Text style={styles.stopName}>{s.name}</Text>
               </View>
               {idx !== MOCK_ROUTE.length - 1 && (
                 <MaterialIcons name="arrow-right-alt" size={20} color="#9CA3AF" style={{ marginHorizontal: 4 }} />
               )}
             </View>
           ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
