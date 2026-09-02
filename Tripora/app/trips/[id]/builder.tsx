import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import { apiFetch } from '../../../src/services/api';
import { toast } from '../../../src/store/toastStore';

export default function ItineraryBuilderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [stops, setStops] = useState<any[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const res = await apiFetch(`/api/trips/${id}/stops`);
        if (mounted && res.data) {
          setStops(res.data);
          if (res.data.length > 0) {
            setSelectedStopId(res.data[0]._id || res.data[0].id);
          }
        }
      } catch (err) {
        toast.error('Failed to load itinerary stops.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [id]);

  const selectedStop = stops.find(s => (s._id || s.id) === selectedStopId);

  const handleDeleteStop = async (stopId: string) => {
    try {
      await apiFetch(`/api/trips/${id}/stops/${stopId}`, { method: 'DELETE' });
      const updated = stops.filter(s => (s._id || s.id) !== stopId);
      setStops(updated);
      if (selectedStopId === stopId) {
         setSelectedStopId(updated.length > 0 ? (updated[0]._id || updated[0].id) : null);
      }
      toast.success('Stop deleted.');
    } catch (err) {
      toast.error('Failed to delete stop.');
    }
  };

  const renderStop = ({ item, drag, isActive }: RenderItemParams<any>) => (
    <ScaleDecorator>
      <StopCard 
        stop={item} 
        onDrag={drag}
        onPress={() => setSelectedStopId(item._id || item.id)}
        onDelete={() => handleDeleteStop(item._id || item.id)}
        isActive={selectedStopId === (item._id || item.id) || isActive}
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
          <TouchableOpacity onPress={() => router.push(`/trips/${id}` as any)} className="p-2 -mr-2 flex-row items-center">
             <MaterialIcons name="visibility" size={22} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {stops.length === 0 && !loading ? (
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
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderStop}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Selected Stop Details */}
            {selectedStop && (
               <View className="flex-1 mt-6 border-t border-gray-200 pt-6">
                 <View className="flex-row justify-between items-center mb-4">
                   <Text className="text-xl font-bold text-gray-900">
                     {selectedStop.cityName || selectedStop.city} Activities
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
                      keyExtractor={(item: any) => item._id || item.id}
                      renderItem={({ item }: { item: any }) => (
                         <ActivityCard 
                           activity={item}
                           isAdded={true}
                           onToggle={() => {
                             // Remove activity locally
                             const updatedStops = stops.map(s => {
                               if (s._id === selectedStop._id || s.id === selectedStop.id) {
                                 return {
                                   ...s,
                                   activities: s.activities.filter((a: any) => (a._id || a.id) !== (item._id || item.id)),
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
