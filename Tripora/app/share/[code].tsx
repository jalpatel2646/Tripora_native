import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenWrapper from '../../src/components/ScreenWrapper';
import { MOCK_ITINERARY_STOPS } from '../../src/data/mockData';
import { MOCK_TRIPS } from '../../src/services/mockData';
import { sharingService } from '../../src/services/sharingService';

export default function SharedItineraryScreen() {
  const { code } = useLocalSearchParams();
  const router = useRouter();

  const stops = MOCK_ITINERARY_STOPS || []; 
  const trip = MOCK_TRIPS && MOCK_TRIPS.length > 0 ? MOCK_TRIPS[0] : { name: 'Shared Adventure', startDate: '2026-09-01', endDate: '2026-09-10', imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800' }; 

  const handleCopyTrip = () => {
    Alert.alert('Trip Copied!', 'This highly curated trip has been copied to your account successfully.');
  };

  const handleShare = () => {
    sharingService.shareNative('Check out this spectacular trip loosely curated for you!', `https://tripora.app/share/${code}`);
  };

  return (
    <ScreenWrapper className="bg-gray-50 flex-1">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row justify-between items-center z-10 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="close" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Shared Trip</Text>
        <TouchableOpacity onPress={handleShare} className="p-2 -mr-2 bg-purple-50 rounded-full flex-row items-center">
           <MaterialIcons name="ios-share" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        {/* Public Header banner */}
        <View className="bg-primary/10 rounded-xl p-3 mb-6 flex-row items-center justify-center border border-primary/20">
           <MaterialIcons name="public" size={18} color="#7C3AED" />
           <Text className="text-primary font-medium ml-2 text-sm">Shared securely via Tripora</Text>
        </View>

        <Image source={{ uri: trip.imageUrl }} className="w-full h-48 rounded-3xl mb-6 shadow-sm" resizeMode="cover" />

        <Text className="text-3xl font-bold text-gray-900 leading-tight mb-2">{trip.name}</Text>
        <Text className="text-gray-500 mb-6">{trip.startDate} — {trip.endDate}</Text>

        <View className="border-t border-gray-200 pt-6 mb-6">
           <Text className="text-xl font-bold text-gray-900 mb-4">Itinerary View</Text>
           {stops.map((stop, index) => (
             <View key={stop.id}>
               <View className="flex-row items-center mb-3">
                 <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                   <Text className="text-primary font-bold text-base">{index + 1}</Text>
                 </View>
                 <View>
                   <Text className="text-lg font-bold text-gray-900">{stop.city}</Text>
                   <Text className="text-xs text-gray-500">{stop.days} Days Planned</Text>
                 </View>
               </View>
               <View className="pl-5 ml-4 border-l-2 border-gray-100 pb-6">
                 {stop.activities.map(act => (
                   <View key={act.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-3 flex-row items-center justify-between">
                     <View className="flex-1 pr-2">
                       <Text className="font-bold text-gray-900 mb-1">{act.title}</Text>
                       <Text className="text-xs text-gray-500">{act.duration} • {act.type}</Text>
                     </View>
                     <View className="bg-purple-50 p-2 rounded-xl">
                       <MaterialIcons name="local-activity" size={18} color="#7C3AED" />
                     </View>
                   </View>
                 ))}
                 {stop.activities.length === 0 && (
                   <Text className="text-gray-400 italic py-2">Exploration day.</Text>
                 )}
               </View>
             </View>
           ))}
        </View>

        <TouchableOpacity 
          onPress={handleCopyTrip}
          className="bg-primary py-4 rounded-2xl items-center justify-center flex-row shadow-md shadow-primary/30 mt-4"
        >
          <MaterialIcons name="content-copy" size={20} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Copy Trip</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}
