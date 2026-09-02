import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import TripCard from '../../src/components/TripCard';
import SectionHeader from '../../src/components/SectionHeader';
import EmptyState from '../../src/components/EmptyState';
import { useTheme } from '../../src/context/ThemeContext';
import { toast } from '../../src/store/toastStore';
import { useTripStore } from '../../src/store/tripStore';
import { useConfirmation } from '../../src/hooks/useConfirmation';

export default function MyTripsScreen() {
  const router = useRouter();
  const { colors, spacing, radius } = useTheme();
  const { confirm } = useConfirmation();
  const { activeTrips, fetchTrips, deleteTrip } = useTripStore();
  const trips = Object.values(activeTrips);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTrips();
      toast.success('Trips refreshed');
    } catch (error) {
      toast.error('Failed to refresh trips');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDeleteAttempt = (id: string) => {
    confirm({
      title: 'Delete Trip',
      message: 'Are you sure you want to delete this trip? This action cannot be undone.',
      confirmText: 'Delete',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteTrip(id);
          toast.success('Trip deleted successfully');
        } catch (e: any) {
          toast.error(e.message || 'Failed to delete trip');
        }
      }
    });
  };

  const handleEdit = (id: string) => {
    router.push(`/trips/${id}`);
  };

  return (
    <ScreenWrapper>
      <View style={{ 
        paddingHorizontal: spacing.xl, 
        paddingTop: spacing.xl, 
        paddingBottom: spacing.sm, 
        borderBottomWidth: 1, 
        borderBottomColor: colors.border,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: colors.background
      }}>
        <SectionHeader title="My Trips" />
        <TouchableOpacity 
          onPress={() => router.push('/trips/new')}
          style={{
            backgroundColor: colors.primary,
            width: 40, height: 40,
            borderRadius: radius.full,
            alignItems: 'center', justifyContent: 'center',
            marginTop: -16,
            shadowColor: colors.primary, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4
          }}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {trips.length > 0 ? (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          {trips.map(trip => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              showActions
              onEdit={() => handleEdit(trip.id)}
              onDelete={() => handleDeleteAttempt(trip.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          <EmptyState 
            title="No Trips Yet" 
            description="You haven't planned any trips. Start exploring the world securely today!"
            actionTitle="Plan a Trip"
            onActionPress={() => router.push('/trips/new')}
          />
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}
