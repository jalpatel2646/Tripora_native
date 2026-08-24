import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ScreenWrapper from '../../../src/components/ScreenWrapper';
import StopCard from '../../../src/components/StopCard';
import SectionHeader from '../../../src/components/SectionHeader';
import PrimaryButton from '../../../src/components/PrimaryButton';
import EmptyState from '../../../src/components/EmptyState';
import ActivityCard from '../../../src/components/ActivityCard';
import { MOCK_ITINERARY_STOPS, CityStop } from '../../../src/data/mockData';

export default function ItineraryBuilderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [stops, setStops] = useState<CityStop[]>(MOCK_ITINERARY_STOPS);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(stops.length > 0 ? stops[0].id : null);

  const selectedStop = stops.find(s => s.id === selectedStopId);

  const handleDeleteStop = (stopId: string) => {
    const updated = stops.filter(s => s.id !== stopId);
    setStops(updated);
    if (selectedStopId === stopId) {
       setSelectedStopId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const renderStop = ({ item, drag, isActive }: RenderItemParams<CityStop>) => (
    <ScaleDecorator>
      <StopCard 
        stop={item} 
        onDrag={drag}
        onPress={() => setSelectedStopId(item.id)}
        onDelete={() => handleDeleteStop(item.id)}
        isActive={selectedStopId === item.id || isActive}
      />
    </ScaleDecorator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenWrapper className="bg-gray-50 flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row justify-between items-center z-10 bg-white">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Itinerary Builder</Text>
          <TouchableOpacity onPress={() => router.push(`/trips/${id}`)} className="p-2 -mr-2 flex-row items-center">
             <MaterialIcons name="visibility" size={22} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {stops.length === 0 ? (
           <EmptyState 
             title="No Stops Yet"
             description="Add cities to your trip to begin building your ultimate itinerary."
             actionTitle="Add Your First Stop"
             onActionPress={() => router.push('/city-search')}
           />
        ) : (
          <View className="flex-1 px-6 pt-6">
            <View className="mb-4 flex-row justify-between items-center">
               <SectionHeader title="Your Route" />
               <TouchableOpacity 
                 onPress={() => router.push('/city-search')}
                 className="flex-row items-center bg-purple-50 px-3 py-1.5 rounded-full mb-4"
               >
                 <MaterialIcons name="add" size={18} color="#7C3AED" />
                 <Text className="text-primary font-bold ml-1 text-sm">Add Stop</Text>
               </TouchableOpacity>
            </View>

            <View style={{ height: 220 }}>
              <DraggableFlatList
                data={stops}
                onDragEnd={({ data }) => setStops(data)}
                keyExtractor={(item) => item.id}
                renderItem={renderStop}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Selected Stop Details */}
            {selectedStop && (
               <View className="flex-1 mt-6 border-t border-gray-200 pt-6">
                 <View className="flex-row justify-between items-center mb-4">
                   <Text className="text-xl font-bold text-gray-900">
                     {selectedStop.cityName} Activities
                   </Text>
                   <TouchableOpacity 
                     onPress={() => router.push('/activity-search')}
                     className="bg-primary px-3 py-1.5 rounded-full"
                   >
                     <Text className="text-white font-bold text-xs">Add Activity</Text>
                   </TouchableOpacity>
                 </View>

                 {selectedStop.activities && selectedStop.activities.length > 0 ? (
                    <DraggableFlatList // Using a simple flatlist for activities inside
                      data={selectedStop.activities}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                         <ActivityCard 
                           activity={item}
                           isAdded={true}
                           onToggle={() => {
                             // Mock remove activity
                             const updatedStops = stops.map(s => {
                               if (s.id === selectedStop.id) {
                                 return {
                                   ...s,
                                   activities: s.activities.filter(a => a.id !== item.id),
                                   activitiesCount: s.activitiesCount - 1
                                 };
                               }
                               return s;
                             });
                             setStops(updatedStops);
                           }}
                         />
                      )}
                      showsVerticalScrollIndicator={false}
                    />
                 ) : (
                    <View className="flex-1 justify-center items-center py-6 bg-white rounded-2xl border border-gray-100 border-dashed">
                      <MaterialIcons name="local-activity" size={40} color="#D1D5DB" />
                      <Text className="text-gray-400 mt-2 font-medium">No activities planned here yet.</Text>
                    </View>
                 )}
               </View>
            )}
          </View>
        )}
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
}
