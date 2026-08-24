import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const MOCK_ROUTE: any[] = [];

export default function InteractiveRouteMapScreenWeb() {
  const { id } = useLocalSearchParams();
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
