import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MOCK_CITIES_EXTENDED } from '../src/data/mockData';
import { useLocation } from '../src/hooks/useLocation';

export default function CitySearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const { location, loading: locationLoading, fetchLocation } = useLocation();

  const handleUseLocation = async () => {
    const loc = await fetchLocation();
    if (loc && loc.city) {
      setSearchQuery(loc.city);
    }
  };

  const filters = ['All', 'Europe', 'Asia', 'Americas'];

  const filteredCities = MOCK_CITIES_EXTENDED.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          city.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filter === 'All') return true;
    
    // Simplistic mock grouping
    if (filter === 'Europe') return ['France', 'Italy', 'Spain', 'Turkey'].includes(city.country);
    if (filter === 'Asia') return ['Japan', 'Indonesia', 'UAE'].includes(city.country);
    if (filter === 'Americas') return ['USA'].includes(city.country);
    
    return true;
  });

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-100 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-gray-900">Add City</Text>
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full">
          <MaterialIcons name="close" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <View className="px-5 py-4 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 px-4 py-2.5 rounded-xl">
          <MaterialIcons name="search" size={22} color="#9CA3AF" />
          <TextInput
            placeholder="Search by city or country..."
            className="flex-1 ml-2 text-base text-gray-900"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="cancel" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Use Current Location Button */}
        <TouchableOpacity 
          onPress={handleUseLocation}
          disabled={locationLoading}
          className="flex-row items-center mt-3 ml-2"
        >
          <MaterialIcons name="my-location" size={16} color="#7C3AED" />
          <Text className="text-primary text-sm font-medium ml-1">
            {locationLoading ? 'Detecting location...' : 'Use current location'}
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
        {filteredCities.map(city => (
          <View key={city.id} className="flex-row items-center bg-white border border-gray-100 rounded-2xl p-3 mb-3 shadow-sm">
            <Image source={{ uri: city.imageUrl }} className="w-16 h-16 rounded-xl" />
            <View className="flex-1 ml-4 justify-center">
              <Text className="text-base font-bold text-gray-900">{city.name}</Text>
              <Text className="text-sm text-gray-500">{city.country}</Text>
              <View className="flex-row mt-1 space-x-3">
                 <Text className="text-xs text-gray-400 font-medium">{city.popularity}</Text>
                 <Text className="text-xs text-green-600 font-bold">{city.costIndex}</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => {
                // Mock adding to trip
                router.back();
              }}
              className="bg-purple-50 p-2 rounded-full"
            >
              <MaterialIcons name="add" size={24} color="#7C3AED" />
            </TouchableOpacity>
          </View>
        ))}
        {filteredCities.length === 0 && (
          <View className="items-center justify-center mt-10 p-6">
            <MaterialIcons name="search-off" size={48} color="#D1D5DB" />
            <Text className="text-gray-400 text-base mt-2">No active destinations found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
