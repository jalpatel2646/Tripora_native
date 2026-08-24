import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import TripCard from '../../src/components/TripCard';
import SectionHeader from '../../src/components/SectionHeader';
import EmptyState from '../../src/components/EmptyState';
import { MOCK_TRIPS } from '../../src/services/mockData';

export default function MyTripsScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState(MOCK_TRIPS);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Trip', 'Are you sure you want to delete this trip?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => {
          setTrips(current => current.filter(t => t.id !== id));
        }
      }
    ]);
  };

  const handleEdit = (id: string) => {
    // Navigate to edit screen or just show alert
    Alert.alert('Edit Trip', `Navigating to edit trip ${id}...`);
  };

  return (
    <ScreenWrapper>
      <View className="px-6 pt-6 pb-2 border-b border-gray-100 flex-row justify-between items-center bg-gray-50">
        <SectionHeader title="My Trips" />
        <TouchableOpacity 
          onPress={() => router.push('/trips/new')}
          className="bg-primary w-10 h-10 rounded-full items-center justify-center -mt-4 shadow-sm"
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {trips.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
          {trips.map(trip => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              showActions
              onEdit={() => handleEdit(trip.id)}
              onDelete={() => handleDelete(trip.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <EmptyState 
          title="No Trips Yet" 
          description="You haven't planned any trips. Start exploring the world securely today!"
          actionTitle="Plan a Trip"
          onActionPress={() => router.push('/trips/new')}
        />
      )}
    </ScreenWrapper>
  );
}
