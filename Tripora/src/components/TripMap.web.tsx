import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TripMapProps {
  route: any[];
  loading: boolean;
  coordinates: any[];
}

export default function TripMap({ route, loading, coordinates }: TripMapProps) {
  return (
    <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }]}>
      <MaterialIcons name="map" size={48} color="#9CA3AF" />
      <Text style={{ color: '#6B7280', fontSize: 16, marginTop: 12 }}>Interactive map is available only on mobile devices.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});
