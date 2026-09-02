import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ActivityCard from '../src/components/ActivityCard';
import { useLocation } from '../src/hooks/useLocation';
import { placesService } from '../src/services/placesService';
import { apiFetch } from '../src/services/api';

export default function ActivitySearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [nearbyActivities, setNearbyActivities] = useState<any[]>([]);
  const [globalActivities, setGlobalActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { location, loading: locationLoading, fetchLocation } = useLocation();
  
  // Storing simple local states to track checked items
  const [addedActivities, setAddedActivities] = useState<Record<string, boolean>>({});

  const filters = ['All', 'Sightseeing', 'Food', 'Culture', 'Adventure'];

  const fetchGlobalActivities = async (q: string) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/activities/search?q=${encodeURIComponent(q)}`);
      if (res.data) setGlobalActivities(res.data);
    } catch (e) {
      console.warn("Failed to fetch global activities", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search nearby and global
    const timeout = setTimeout(async () => {
      fetchGlobalActivities(searchQuery);

      if (location && (searchQuery.length === 0 || searchQuery.length > 2)) {
        const places = await placesService.searchNearbyPlaces(location.latitude, location.longitude, searchQuery);
        setNearbyActivities(places);
      } else if (!location) {
        setNearbyActivities([]);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, location]);

  const handleFetchNearby = async () => {
    await fetchLocation();
  };

  const combinedActivities = [...globalActivities, ...nearbyActivities];

  const filteredActivities = combinedActivities.filter(activity => {
    if (filter === 'All') return true;
    return activity.type === filter;
  });

  const toggleActivity = (id: string) => {
    setAddedActivities(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-100 flex-row items-center justify-between bg-white z-10">
        <Text className="text-xl font-bold text-gray-900">Discover Activities</Text>
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full">
          <MaterialIcons name="close" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View className="px-5 py-4 border-b border-gray-100 bg-white">
        <View className="flex-row items-center bg-gray-100 px-4 py-2.5 rounded-xl">
          <MaterialIcons name="search" size={22} color="#9CA3AF" />
          <TextInput
            placeholder="Search by title or description..."
            className="flex-1 ml-2 text-base text-gray-900"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="cancel" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          onPress={handleFetchNearby}
          disabled={locationLoading}
          className="flex-row items-center mt-3 ml-2"
        >
          <MaterialIcons name="my-location" size={16} color="#7C3AED" />
          <Text className="text-primary text-sm font-medium ml-1">
            {locationLoading ? 'Finding you...' : 'Find nearby attractions'}
          </Text>
        </TouchableOpacity>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full mr-2 border ${
                filter === f ? 'bg-primary border-primary' : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`font-medium ${filter === f ? 'text-white' : 'text-gray-600'}`}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        {filteredActivities.map(activity => {
          const actId = activity._id || activity.id;
          return (
            <ActivityCard
              key={actId}
              activity={activity}
              isAdded={!!addedActivities[actId]}
              onToggle={() => toggleActivity(actId)}
            />
          );
        })}
        
        {filteredActivities.length === 0 && (
          <View className="items-center justify-center mt-10 p-6">
            <MaterialIcons name="event-busy" size={48} color="#D1D5DB" />
            <Text className="text-gray-400 text-base mt-2">No activities match your filters.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
