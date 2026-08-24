import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../../src/components/ScreenWrapper';
import { MOCK_ITINERARY_STOPS } from '../../../src/data/mockData';
import { MOCK_BUDGET } from '../../../src/services/mockData';
import SectionHeader from '../../../src/components/SectionHeader';
import { useCameraStore } from '../../../src/store/cameraStore';

export default function TripOverviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const stops = MOCK_ITINERARY_STOPS; // Simulating data fetch for trip id
  const totalCost = 430; // Just mocking derived sum for demonstration

  const { capturedUri, activeMode, clearCapturedImage } = useCameraStore();
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    if (activeMode === 'cover' && capturedUri) {
      setCoverImage(capturedUri);
      clearCapturedImage();
    }
  }, [activeMode, capturedUri]);

  return (
    <ScreenWrapper className="bg-gray-50 flex-1">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row justify-between items-center z-10 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.push('/(tabs)/trips')} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Trip Overview</Text>
        <TouchableOpacity onPress={() => router.push(`/trips/${id}/builder`)} className="p-2 -mr-2 bg-purple-50 rounded-full">
           <MaterialIcons name="edit" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        {/* Top Summary / Cover Photo */}
        <ImageBackground 
          source={coverImage ? { uri: coverImage } : undefined}
          style={{ width: '100%', borderRadius: 24, padding: 24, marginBottom: 24, overflow: 'hidden', backgroundColor: coverImage ? undefined : '#7C3AED' }}
        >
          {coverImage && <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />}
          
          <View style={{ zIndex: 10 }}>
            <View className="flex-row justify-between items-start mb-6">
              <Text className="text-white/90 font-medium text-base">Estimated Total Cost</Text>
              <TouchableOpacity onPress={() => router.push('/camera?mode=cover')} className="bg-white/20 px-3 py-1.5 rounded-full items-center flex-row">
                 <MaterialIcons name="camera-alt" size={14} color="white" />
                 <Text className="text-white ml-2 text-xs font-bold">{coverImage ? 'Change Cover' : 'Add Cover'}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-end justify-between">
                <Text className="text-4xl font-bold text-white">${totalCost.toFixed(2)}</Text>
                <Text className="text-white/90 text-sm font-bold mb-1">/ {MOCK_BUDGET.totalAllocated} limit</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Quick Navigations */}
        <View className="flex-row justify-between mb-8 space-x-2">
           <TouchableOpacity 
             activeOpacity={0.8}
             onPress={() => router.push(`/trips/${id}/budget` as any)}
             className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center"
           >
              <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mb-1.5">
                <MaterialIcons name="pie-chart" size={20} color="#10B981" />
              </View>
              <Text className="font-bold text-gray-900 text-xs">Budget</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             activeOpacity={0.8}
             onPress={() => router.push(`/trips/${id}/map` as any)}
             className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center"
           >
              <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center mb-1.5">
                <MaterialIcons name="map" size={20} color="#7C3AED" />
              </View>
              <Text className="font-bold text-gray-900 text-xs">Map</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             activeOpacity={0.8}
             onPress={() => router.push(`/trips/${id}/calendar` as any)}
             className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center"
           >
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5">
                <MaterialIcons name="event" size={20} color="#3B82F6" />
              </View>
              <Text className="font-bold text-gray-900 text-xs">Timeline</Text>
           </TouchableOpacity>
           
           <TouchableOpacity 
             activeOpacity={0.8}
             onPress={() => router.push(`/trips/${id}/journal` as any)}
             className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center"
           >
              <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mb-1.5">
                <MaterialIcons name="photo-library" size={20} color="#F97316" />
              </View>
              <Text className="font-bold text-gray-900 text-xs">Journal</Text>
           </TouchableOpacity>
        </View>

        {/* Itinerary Summary list */}
        <SectionHeader title="Itinerary Highlights" />
        
        {stops.map(stop => (
          <View key={stop.id} className="mb-6 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <View className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-bold text-gray-900 text-lg">{stop.city}</Text>
                <Text className="text-gray-500 text-sm">{stop.days} Days</Text>
             </View>
             <View className="p-4">
                {stop.activities.length > 0 ? (
                  stop.activities.map((act, index) => (
                    <View key={act.id} className={`flex-row justify-between items-center ${index !== stop.activities.length - 1 ? 'border-b border-gray-100 pb-3 mb-3' : ''}`}>
                       <View className="flex-1 pr-4">
                         <Text className="font-bold text-gray-900 mb-1">{act.title}</Text>
                         <Text className="text-sm text-gray-500">{act.duration} • {act.type}</Text>
                       </View>
                       <Text className="font-bold text-primary bg-purple-50 px-2 py-1 rounded-lg">${act.cost}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-400 italic text-center py-2">No activities added yet.</Text>
                )}
             </View>
          </View>
        ))}

        {/* Documents Portal */}
        <SectionHeader title="Trip Resources" />
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.push(`/trips/${id}/insights` as any)}
          className="bg-white px-4 py-5 rounded-2xl shadow-sm border border-gray-100 flex-row items-center mb-3"
        >
           <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center mr-4">
              <MaterialIcons name="insights" size={24} color="#EC4899" />
           </View>
           <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base mb-0.5">Trip Insights</Text>
              <Text className="text-gray-500 text-xs">Analyze stats, pace, and spending distribution.</Text>
           </View>
           <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.push(`/trips/${id}/documents` as any)}
          className="bg-white px-4 py-5 rounded-2xl shadow-sm border border-gray-100 flex-row items-center mb-6"
        >
           <View className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center mr-4">
              <MaterialIcons name="folder-open" size={24} color="#6366F1" />
           </View>
           <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base mb-0.5">Documents & Bookings</Text>
              <Text className="text-gray-500 text-xs">Scan and store tickets, reservations, etc.</Text>
           </View>
           <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push(`/share/TRP-MOCK-1234`)}
          className="bg-purple-100 border border-purple-200 mt-4 py-4 rounded-2xl items-center justify-center flex-row"
        >
          <MaterialIcons name="ios-share" size={20} color="#7C3AED" />
          <Text className="text-primary font-bold text-lg ml-2">Share Trip</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}
