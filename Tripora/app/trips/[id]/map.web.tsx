import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function InteractiveRouteMapScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Route Map</Text>
      </View>

      <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }]}>
        <MaterialIcons name="map" size={48} color="#9CA3AF" />
        <Text style={{ color: '#6B7280', fontSize: 16, marginTop: 12 }}>Interactive map is available only on mobile devices.</Text>
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
  }
});
