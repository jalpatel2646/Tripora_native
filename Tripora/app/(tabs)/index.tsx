import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { getLocalItem, setLocalItem } from '../../src/utils/storage';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import TripCard from '../../src/components/TripCard';
import CityCard from '../../src/components/CityCard';
import SectionHeader from '../../src/components/SectionHeader';
import EmptyState from '../../src/components/EmptyState';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { toast } from '../../src/store/toastStore';
import { useTripStore } from '../../src/store/tripStore';
import Animated, { FadeInDown, FadeInUp, FadeInRight } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { apiFetch } from '../../src/services/api';

const PREFERENCES = ['Beach', 'Adventure', 'Food', 'History', 'Nature', 'Nightlife'];

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  
  const { activeTrips, fetchTrips, isLoading: isTripsLoading } = useTripStore();
  const tripList = Object.values(activeTrips);
  
  const [preferences, setPreferences] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch dynamic recommendations and preferences from backend
      const res = await apiFetch('/api/users/recommendations');
      if (res.data) setRecommendations(res.data);
      if (res.preferences) setPreferences(res.preferences);
      
      await fetchTrips();
    } catch (e) {
      console.error(e);
      // Fallback
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await fetchData();
      toast.success('Dashboard updated');
    } catch (e) {
      toast.error('Failed to update dashboard');
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  const togglePreference = async (pref: string) => {
    const newPrefs = preferences.includes(pref) ? preferences.filter(p => p !== pref) : [...preferences, pref];
    setPreferences(newPrefs);
    try {
      await apiFetch('/api/users/preferences', { 
         method: 'PUT', 
         body: JSON.stringify({ preferences: newPrefs })
      });
      // Refresh recommendations based on new preferences
      const recRes = await apiFetch('/api/users/recommendations');
      if (recRes.data) setRecommendations(recRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} className="pt-16 pb-6 px-6 bg-white rounded-b-[40px] shadow-sm mb-6 border-b border-gray-100">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Good Morning,</Text>
              <Text className="text-3xl font-black text-gray-900 leading-tight">
                {user?.name?.split(' ')[0] || 'Traveler'}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/camera')} 
              activeOpacity={0.8}
              className="w-14 h-14 bg-gray-50 rounded-full items-center justify-center border border-gray-200 shadow-sm"
            >
              <MaterialIcons name="document-scanner" size={24} color={colors.primary} />
              <View className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-400 rounded-full border-2 border-white" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-between space-x-3 -mx-1">
            <TouchableOpacity 
              onPress={() => router.push('/ai-planner')}
              activeOpacity={0.9}
              className="flex-1 p-5 rounded-3xl shrink-0 mx-1 items-start justify-between shadow-sm min-h-[140px]"
              style={{ backgroundColor: colors.primary }}
            >
              <View className="bg-white/20 p-2.5 rounded-2xl mb-4">
                <MaterialIcons name="auto-awesome" size={26} color="white" />
              </View>
              <View>
                <Text className="text-white font-bold text-lg mb-1">AI Planner</Text>
                <Text className="text-white/80 font-medium text-xs">Magic trips</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/trips/new')}
              activeOpacity={0.9}
              className="flex-1 p-5 rounded-3xl shrink-0 mx-1 items-start justify-between bg-white shadow-sm border border-gray-100 min-h-[140px]"
            >
              <View className="bg-blue-50 p-2.5 rounded-2xl mb-4">
                <MaterialIcons name="add-location-alt" size={26} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-gray-900 font-bold text-lg mb-1">Manual</Text>
                <Text className="text-gray-500 font-medium text-xs">Build your own</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Trips Section */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} className="mb-8 pl-6">
          <View className="pr-6">
            <SectionHeader 
              title="Your Trips" 
              actionTitle="View All" 
              onActionPress={() => router.push('/(tabs)/trips')} 
            />
          </View>
          
          {loading && isTripsLoading ? (
            <Text className="text-gray-400 font-medium my-4">Loading adventures...</Text>
          ) : tripList.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pr-6 py-2 overflow-visible">
              {tripList.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} index={index} />
              ))}
              <View className="w-6" />
            </ScrollView>
          ) : (
            <View className="pr-6 mr-6">
              <EmptyState 
                title="Ready to explore?" 
                description="You don't have any upcoming trips. Use our AI to craft a perfect itinerary in seconds."
                iconName="explore"
                actionTitle="Start Planning"
                onActionPress={() => router.push('/ai-planner')}
              />
            </View>
          )}
        </Animated.View>

        {/* Discover Section */}
        <Animated.View entering={FadeInUp.duration(600).delay(350)}>
          <View className="px-6">
            <SectionHeader title={preferences.length > 0 ? "Curated For You" : "Discover Destinations"} />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 pl-6">
            <View className="flex-row pr-6 py-1">
              {PREFERENCES.map((pref, i) => {
                const isActive = preferences.includes(pref);
                return (
                  <Animated.View key={pref} entering={FadeInRight.delay(i * 50).duration(400)}>
                    <TouchableOpacity
                      onPress={() => togglePreference(pref)}
                      activeOpacity={0.7}
                      className={`px-5 py-2.5 rounded-full mr-3 border ${isActive ? 'border-primary' : 'border-gray-200'}`}
                      style={{
                        backgroundColor: isActive ? colors.primary : '#FFFFFF',
                        shadowColor: isActive ? colors.primary : '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isActive ? 0.15 : 0.05,
                        shadowRadius: 3,
                        elevation: isActive ? 4 : 1,
                      }}
                    >
                      <Text className={`font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                        {pref}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
              <View className="w-6" />
            </View>
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6 pb-4">
            <View className="flex-row pr-6">
              {recommendations.length > 0 ? recommendations.map((city, index) => (
                <CityCard key={city.id || index.toString()} city={city} index={index} />
              )) : (
                <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm w-80 mb-4 items-center">
                  <MaterialIcons name="search-off" size={32} color="#9CA3AF" />
                  <Text className="text-gray-500 font-medium mt-3 text-center">
                    No matching cities found for your preferences.
                  </Text>
                </View>
              )}
              <View className="w-6" />
            </View>
          </ScrollView>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
